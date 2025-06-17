from fastapi import HTTPException
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from src.gemini.service import GeminiService
from src.pdf.service import save_uploaded_file
# from app.services.gemini_service import GeminiService
# from app.utils.file_utils import save_uploaded_file
import glob
import shutil

class RAGService:
    CHROMA_PERSIST_DIRECTORY = "chroma_db"
    PDF_STORAGE_PATH = "src/pdf/"
    INITIAL_PDFS_PATH = "src/pdf/initial_pdfs/"

    @classmethod
    async def process_existing_pdfs(cls) -> int:
        """Procesa todos los PDFs de la carpeta initial_pdfs (solo copia, no mueve)"""
        # Crear carpetas si no existen
        os.makedirs(cls.INITIAL_PDFS_PATH, exist_ok=True)
        os.makedirs(cls.PDF_STORAGE_PATH, exist_ok=True)
        
        pdf_files = glob.glob(os.path.join(cls.INITIAL_PDFS_PATH, "*.pdf"))
        if not pdf_files:
            print(f"No se encontraron PDFs en {cls.INITIAL_PDFS_PATH}")
            return 0
        
        processed_count = 0
        for file_path in pdf_files:
            try:
                
                filename = os.path.basename(file_path)
                dest_path = os.path.join(cls.PDF_STORAGE_PATH, filename)
                
                
                if not os.path.exists(dest_path):
                    shutil.copy2(file_path, dest_path)
                    print(f"Copiado: {filename}")
                else:
                    print(f"El archivo {filename} ya existe en el destino. Omitiendo copia.")
                
                
                loader = PyPDFLoader(dest_path) 
                documents = loader.load()
                chunks = cls._split_documents(documents)
                cls._add_to_chroma(chunks)
                
                processed_count += 1
            except Exception as e:
                print(f"Error procesando {file_path}: {str(e)}")
                continue  
        
        print(f"Procesados {processed_count} archivos PDF (copiados y añadidos a Chroma DB)")
        return processed_count

    @classmethod
    def query_rag(cls, question: str) -> str:
        """Consulta al sistema RAG"""
        db = Chroma(
            persist_directory=cls.CHROMA_PERSIST_DIRECTORY,
            embedding_function=cls._get_embeddings()
        )
        
        retriever = db.as_retriever(search_kwargs={'k': 3})
        docs = retriever.invoke(question)
        context = "\n".join([doc.page_content for doc in docs])
        
        return GeminiService.generate_response(context, question)

    @classmethod
    async def process_uploaded_files(cls, files) -> int:
        """Procesa archivos subidos"""
        saved_files = []
        for file in files:
            if file.content_type != "application/pdf":
                continue
            file_path = await save_uploaded_file(file, cls.PDF_STORAGE_PATH)
            saved_files.append(file_path)
        
        if not saved_files:
            return 0
            
        documents = []
        for file_path in saved_files:
            loader = PyPDFLoader(file_path)
            documents.extend(loader.load())
        
        chunks = cls._split_documents(documents)
        cls._add_to_chroma(chunks)
        return len(saved_files)

    @staticmethod
    def _split_documents(documents: list[Document]) -> list[Document]:
        """Divide documentos en chunks"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n"]
        )
        return text_splitter.split_documents(documents)

    @staticmethod
    def _get_embeddings():
        """Obtiene embeddings de Google"""
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        return GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            task_type="RETRIEVAL_DOCUMENT"
        )

    @staticmethod
    def _add_to_chroma(chunks: list[Document]):
        """Añade chunks a Chroma DB"""
        db = Chroma(
            persist_directory=RAGService.CHROMA_PERSIST_DIRECTORY,
            embedding_function=RAGService._get_embeddings()
        )
        db.add_documents(chunks)
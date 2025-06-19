import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from src.gemini.service import GeminiService
from src.pdf.service import save_uploaded_file
import glob
from tempfile import NamedTemporaryFile
from src.constants import CHROMA_DIRECTORY, PDF_CORE_DIRECTORY

class RAGService:
    CHROMA_PERSIST_DIRECTORY = "chroma_db"
    PDF_STORAGE_PATH = "src/pdf/"
    INITIAL_PDFS_PATH = "src/pdf/initial_pdfs/"

    async def upload_pdf_cores_to_chromadb(self): 
        chromadb_exist = glob.glob(os.path.join(CHROMA_DIRECTORY, "chroma.sqlite3"))
        
        if not chromadb_exist:
            pdf_files = glob.glob(os.path.join(PDF_CORE_DIRECTORY, "*.pdf"))
            if not pdf_files:
                print(f"No se encontraron PDFs en {PDF_CORE_DIRECTORY}")
                return 0
            
            for pdf_file_path in pdf_files:
                try:
                    loader = PyPDFLoader(pdf_file_path) 
                    documents = loader.load()
                    chunks = self._split_documents(documents)
                    self._add_to_chroma(chunks)

                except Exception as e:
                    print(f"Error procesando {pdf_file_path}: {str(e)}")

    def query_rag(self, question: str) -> str:
        """Consulta al sistema RAG"""
        db = Chroma(
            persist_directory=CHROMA_DIRECTORY,
            embedding_function=self._get_embeddings()
        )
        
        retriever = db.as_retriever(search_kwargs={'k': 3})
        docs = retriever.invoke(question)
        context = "\n".join([doc.page_content for doc in docs])
        
        return GeminiService.generate_response(context, question)

    async def upload_files_to_the_database(cls, files) -> int:
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
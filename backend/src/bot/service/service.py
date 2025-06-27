import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from src.gemini.service import GeminiService
import glob
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from tempfile import NamedTemporaryFile
from src.constants import CHROMA_DIRECTORY, PDF_CORE_DIRECTORY

class RAGService:
    def query_rag(self, question: str) -> str:
        db = Chroma(
            persist_directory=CHROMA_DIRECTORY,
            embedding_function=self.get_embeddings()
        )
        
        retriever = db.as_retriever(search_kwargs={'k': 5})
        docs = retriever.invoke(question)
        context = "\n".join([doc.page_content for doc in docs])
        
        return GeminiService.generate_response(context, question)

    async def upload_files_to_the_database(cls, files) -> int:
        documents = []

        for file in files:
            if file.content_type != "application/pdf":
                continue

            contents = await file.read()

            tmp = NamedTemporaryFile(suffix=".pdf", delete=False)
            try:
                tmp.write(contents)
                tmp.close()

                loader = PyPDFLoader(tmp.name)
                documents.extend(loader.load())
            except Exception as e:
                print(f"Error procesando {file.filename}: {str(e)}")
            finally:
                try:
                    os.remove(tmp.name)
                except Exception as e:
                    print(f"No se pudo eliminar archivo temporal {tmp.name}: {str(e)}")

        if not documents:
            return 0

        chunks = cls.split_documents(documents)
        cls.add_to_chroma(chunks)
        return len(files)
    
    #Divide documents in chunks
    def split_documents(self, documents: list[Document]) -> list[Document]:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n"]
        )
        return text_splitter.split_documents(documents)

    #Obtain embeddings of Google
    def get_embeddings(self):
        return GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            task_type="RETRIEVAL_DOCUMENT"
        )

    def add_to_chroma(self, chunks: list[Document]):
        db = Chroma(
            persist_directory=CHROMA_DIRECTORY,
            embedding_function=self.get_embeddings()
        )
        db.add_documents(chunks)

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
                    chunks = self.split_documents(documents)
                    self.add_to_chroma(chunks)

                except Exception as e:
                    print(f"Error procesando {pdf_file_path}: {str(e)}")
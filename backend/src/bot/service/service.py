from fastapi import HTTPException
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from src.gemini.service import GeminiService
from src.pdf.service import save_uploaded_file
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class RAGService:
    CHROMA_PERSIST_DIRECTORY = "chroma_db"
    PDF_STORAGE_PATH = "src/pdf/"

    def query_rag(cls, question: str) -> str:
        """Consulta al sistema RAG"""
        db = Chroma(
            persist_directory=cls.CHROMA_PERSIST_DIRECTORY,
            embedding_function=cls.get_embeddings()
        )
        
        retriever = db.as_retriever(search_kwargs={'k': 3})
        docs = retriever.invoke(question)
        context = "\n".join([doc.page_content for doc in docs])
        
        return GeminiService.generate_response(context, question)
    

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
        
        chunks = cls.split_documents(documents)
        cls.add_to_chroma(chunks)
        return len(saved_files)


    def split_documents(documents: list[Document]) -> list[Document]:
        """Divide documentos en chunks"""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n"]
        )
        return text_splitter.split_documents(documents)


    def get_embeddings():
        """Obtiene embeddings de Google"""
        return GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            task_type="RETRIEVAL_DOCUMENT"
        )


    def add_to_chroma(chunks: list[Document]):
        """Añade chunks a Chroma DB"""
        db = Chroma(
            persist_directory=RAGService.CHROMA_PERSIST_DIRECTORY,
            embedding_function=RAGService.get_embeddings()
        )
        db.add_documents(chunks)
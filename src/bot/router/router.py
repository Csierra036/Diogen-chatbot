from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from src.bot.service.service import RAGService
from src.gemini.model.model import QueryRequest, QueryResponse, UploadResponse

router = APIRouter()


@router.post("/query")
async def query_rag(request: QueryRequest):
    """Endpoint para realizar consultas al sistema RAG"""
    return RAGService.query_rag(request.question)


@router.post("/upload", response_model=UploadResponse)
async def upload_documents(files: List[UploadFile] = File(...)):
    """Endpoint para subir y procesar nuevos documentos"""
    try:
        processed = await RAGService.process_uploaded_files(files)
        return {"message": "Documents processed successfully", "count": processed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
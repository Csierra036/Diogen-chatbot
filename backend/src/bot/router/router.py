from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from src.bot.service.service import RAGService
from src.gemini.model.model import QueryRequest, QueryResponse, UploadResponse
from src.auth.deps.deps import get_current_user

rag_service = RAGService()

router = APIRouter(
    prefix="/chatbot",
    tags=["ChatBOT"])


@router.post("/query")
async def query_rag(request: QueryRequest, user: str = Depends(get_current_user)):
    """Endpoint para realizar consultas al sistema RAG"""
    return rag_service.query_rag(request.question)


@router.post("/upload", response_model=UploadResponse)
async def upload_documents(files: List[UploadFile] = File(...),user: str = Depends(get_current_user)):
    """Endpoint para subir y procesar nuevos documentos"""
    try:
        processed = await rag_service.upload_files_to_the_database(files)
        return {"message": "Documents processed successfully", "count": processed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
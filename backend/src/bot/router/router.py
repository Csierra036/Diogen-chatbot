from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from src.bot.service.service import RAGService
from src.gemini.model.model import QueryRequest, QueryResponse, UploadResponse
from src.auth.deps.deps import get_current_user
router = APIRouter(
    prefix="/chatbot",
    tags=["ChatBOT"])


@router.post("/query")
async def query_rag(request: QueryRequest, user: str = Depends(get_current_user)):
    """Endpoint para realizar consultas al sistema RAG"""
    return RAGService.query_rag(request.question)


@router.post("/upload", response_model=UploadResponse)
async def upload_documents(files: List[UploadFile] = File(...),user: str = Depends(get_current_user)):
    """Endpoint para subir y procesar nuevos documentos"""
    try:
        processed = await RAGService.process_uploaded_files(files)
        return {"message": "Documents processed successfully", "count": processed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/load-existing", response_model=UploadResponse)
async def load_existing_pdfs(user: str = Depends(get_current_user)):
    """Endpoint para cargar todos los PDFs existentes en la carpeta"""
    try:
        count = await RAGService.process_existing_pdfs()
        return {"message": f"Processed {count} existing PDFs", "count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
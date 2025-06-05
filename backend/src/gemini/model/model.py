from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str

class UploadResponse(BaseModel):
    message: str
    count: int
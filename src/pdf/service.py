import os
from fastapi import UploadFile

async def save_uploaded_file(file: UploadFile, destination: str) -> str:
    """Guarda archivos subidos en el servidor"""
    os.makedirs(destination, exist_ok=True)
    file_path = os.path.join(destination, file.filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return file_path
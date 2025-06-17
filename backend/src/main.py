from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.bot.router.router import router as bot_router
from src.auth.router.router import router as auth_router
from src.database import Base, engine
from src.user.model.user import User
from src.bot.service.service import RAGService

def start_app() -> FastAPI:

    app = FastAPI(
        title = "Gemini API ",
        version = "v0.0.1",
        debug = True
    )

    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins = origins,
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"],
    )
    app.include_router(bot_router)
    app.include_router(auth_router)
    return app

app = start_app()

@app.on_event("startup")
async def startup_event():
    # ✅ Crear todas las tablas si no existen
    Base.metadata.create_all(bind=engine)
    await RAGService.process_existing_pdfs()
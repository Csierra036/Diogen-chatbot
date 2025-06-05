from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.bot.router.router import router as bot_router
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
    return app

app = start_app()
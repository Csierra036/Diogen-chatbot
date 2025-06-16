from pydantic_settings import BaseSettings
from typing import Optional
class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    DB_USERNAME: Optional[str]
    DB_PASSWORD: str
    DB_HOST: Optional[str]
    DB_PORT: Optional[str]
    DB_NAME: Optional[str]
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    ENV: str
settings = Settings()
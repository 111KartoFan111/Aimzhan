from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # База данных
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "0000")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "cars_db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    # Безопасность
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt-tokens")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 дней
    
    # Админ
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin1233")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@example.com")
    
    # API настройки
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Car Catalog API"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost", "http://localhost:5173", "http://localhost:3000"]
    
    @property
    def DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
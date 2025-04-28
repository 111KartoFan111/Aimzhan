import logging
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from sqlalchemy.orm import Session

from app.api.api import api_router
from app.core.auth import get_current_admin_user
from app import crud, models
from app.schemas.user import UserCreate
from app.database import engine, get_db, Base
from app.config import settings

# Настройка логгирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

# Создаем приложение FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Настраиваем CORS
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Монтируем статические файлы для админки
BASE_DIR = Path(__file__).resolve().parent.parent
static_folder = Path(BASE_DIR, "app", "static")
if static_folder.exists():
    app.mount("/static", StaticFiles(directory=str(static_folder)), name="static")

# Включаем основной API роутер
app.include_router(api_router, prefix=settings.API_V1_STR)

# Функция для создания первого админа при старте приложения
def create_first_admin(db: Session) -> None:
    """
    Создает первого администратора, если он еще не существует
    """
    admin_username = settings.ADMIN_USERNAME
    admin_email = settings.ADMIN_EMAIL

    # Проверяем существует ли уже админ с таким именем
    admin = crud.get_user_by_username(db, username=admin_username)
    if admin:
        logger.info(f"Администратор {admin_username} уже существует")
        return

    # Создаем админа
    admin_data = UserCreate(
        username=admin_username,
        email=admin_email,
        password=settings.ADMIN_PASSWORD
    )

    admin = crud.create_admin_user(db, user=admin_data)
    logger.info(f"Создан администратор {admin.username}")

@app.on_event("startup")
async def startup_event():
    """
    Запускается при старте приложения
    """
    logger.info("Запуск приложения...")

    # Создаем первого админа
    db = next(get_db())
    create_first_admin(db)

    logger.info("Приложение запущено")

@app.get("/")
async def root():
    """
    Корневой эндпоинт для проверки работы API
    """
    return {"message": "Car Catalog API работает"}
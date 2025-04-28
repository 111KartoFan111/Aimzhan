from fastapi import APIRouter

from app.api.endpoints import cars, users, auth, favorites, admin

# Создаем основной роутер API
api_router = APIRouter()

# Регистрируем все эндпоинты, убедившись, что они включены в схему
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["auth"]
)
api_router.include_router(
    users.router, 
    prefix="/users", 
    tags=["users"]
)
api_router.include_router(
    cars.router, 
    prefix="/cars", 
    tags=["cars"]
)
api_router.include_router(
    favorites.router, 
    prefix="/favorites", 
    tags=["favorites"]
)
api_router.include_router(
    admin.router, 
    prefix="/admin", 
    tags=["admin"]
)
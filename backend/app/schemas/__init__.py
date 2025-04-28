from app.schemas.car import Car, CarCreate, CarUpdate
from app.schemas.user import User, UserCreate, UserUpdate, UserWithFavorites
from app.schemas.token import Token, TokenPayload, TokenData
from app.schemas.favorite import Favorite, FavoriteCreate, FavoriteWithCar

# Для удобства импорта всех схем
__all__ = [
    "Car", "CarCreate", "CarUpdate",
    "User", "UserCreate", "UserUpdate", "UserWithFavorites",
    "Token", "TokenPayload", "TokenData",
    "Favorite", "FavoriteCreate", "FavoriteWithCar"
]
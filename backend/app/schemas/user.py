from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Базовая схема пользователя
class UserBase(BaseModel):
    username: str
    email: EmailStr

# Схема для создания пользователя
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# Схема для обновления пользователя
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

# Схема для ответа API
class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

# Схема для личного кабинета пользователя с избранными автомобилями
class UserWithFavorites(User):
    favorites: List["FavoriteInfo"] = []

class FavoriteInfo(BaseModel):
    car_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

# Обновляем импорты для UserWithFavorites, т.к. используем FavoriteInfo
UserWithFavorites.update_forward_refs()
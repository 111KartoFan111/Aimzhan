from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.car import Car

# Схема для создания избранного
class FavoriteCreate(BaseModel):
    car_id: int

# Схема для ответа API
class Favorite(BaseModel):
    id: int
    user_id: int
    car_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

# Схема для ответа API с полной информацией об автомобиле
class FavoriteWithCar(Favorite):
    car: Optional[Car] = None
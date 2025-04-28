from pydantic import BaseModel, Field
from typing import List, Optional

# Базовая схема автомобиля
class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price: float
    engine: str
    transmission: str
    color: str
    body_type: str
    drivetrain: str
    description: str
    features: List[str]
    image: str

# Схема для создания автомобиля
class CarCreate(CarBase):
    pass

# Схема для обновления автомобиля (все поля опциональны)
class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    engine: Optional[str] = None
    transmission: Optional[str] = None
    color: Optional[str] = None
    body_type: Optional[str] = None
    drivetrain: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    image: Optional[str] = None

# Схема для ответа API
class Car(CarBase):
    id: int
    
    class Config:
        orm_mode = True
        from_attributes = True
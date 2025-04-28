from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.database import get_db
from app.core.auth import get_current_user, get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Car])
def read_cars(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    year: Optional[int] = None,
) -> Any:
    """
    Получение списка автомобилей с возможностью фильтрации
    """
    if brand or min_price is not None or max_price is not None or year is not None:
        cars = crud.search_cars(db, brand, min_price, max_price, year, skip, limit)
    else:
        cars = crud.get_cars(db, skip=skip, limit=limit)
    return cars

@router.get("/brands", response_model=List[str])
def read_brands(db: Session = Depends(get_db)) -> Any:
    """
    Получение списка всех доступных брендов
    """
    return crud.get_brands(db)

@router.get("/brand/{brand}", response_model=List[schemas.Car])
def read_cars_by_brand(
    brand: str,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Получение автомобилей конкретного бренда
    """
    cars = crud.get_cars_by_brand(db, brand=brand, skip=skip, limit=limit)
    return cars

@router.get("/{car_id}", response_model=schemas.Car)
def read_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_active_user),
) -> Any:
    """
    Получение информации о конкретном автомобиле
    """
    car = crud.get_car(db, car_id=car_id)
    if car is None:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    return car

@router.post("/", response_model=schemas.Car)
def create_car(
    car_in: schemas.CarCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Создание нового автомобиля (только для админов)
    """
    car = crud.create_car(db, car=car_in)
    return car

@router.put("/{car_id}", response_model=schemas.Car)
def update_car(
    car_id: int,
    car_in: schemas.CarUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Обновление информации об автомобиле (только для админов)
    """
    car = crud.get_car(db, car_id=car_id)
    if car is None:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    car = crud.update_car(db, car_id=car_id, car_update=car_in)
    return car

@router.delete("/{car_id}", response_model=bool)
def delete_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Удаление автомобиля (только для админов)
    """
    car = crud.get_car(db, car_id=car_id)
    if car is None:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    result = crud.delete_car(db, car_id=car_id)
    return result
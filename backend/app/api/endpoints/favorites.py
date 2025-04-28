from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.database import get_db
from app.core.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.FavoriteWithCar])
def read_favorites(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Получение списка избранных автомобилей текущего пользователя
    """
    favorites = crud.get_favorites_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return favorites

@router.post("/", response_model=schemas.Favorite)
def create_favorite(
    favorite_in: schemas.FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Добавление автомобиля в избранное
    """
    # Проверяем существует ли автомобиль
    car = crud.get_car(db, car_id=favorite_in.car_id)
    if car is None:
        raise HTTPException(status_code=404, detail="Автомобиль не найден")
    
    # Проверяем, не добавлен ли уже автомобиль в избранное
    existing_favorite = crud.get_favorite_by_user_and_car(
        db, user_id=current_user.id, car_id=favorite_in.car_id
    )
    if existing_favorite:
        raise HTTPException(
            status_code=400, 
            detail="Этот автомобиль уже добавлен в избранное"
        )
    
    favorite = crud.create_favorite(db, favorite=favorite_in, user_id=current_user.id)
    return favorite

@router.delete("/{car_id}", response_model=bool)
def delete_favorite(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Удаление автомобиля из избранного
    """
    result = crud.delete_favorite(db, user_id=current_user.id, car_id=car_id)
    if not result:
        raise HTTPException(
            status_code=404, 
            detail="Автомобиль не найден в избранном"
        )
    return result

@router.get("/check/{car_id}", response_model=bool)
def check_favorite(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Проверка, находится ли автомобиль в избранном у пользователя
    """
    return crud.check_is_favorite(db, user_id=current_user.id, car_id=car_id)
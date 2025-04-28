from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.database import get_db
from app.core.auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Получение списка всех пользователей (только для админов)
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Получение информации о текущем пользователе
    """
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Обновление информации о текущем пользователе
    """
    user = crud.update_user(db, user_id=current_user.id, user_update=user_in)
    return user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Получение информации о конкретном пользователе (только для админов)
    """
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Обновление информации о пользователе (только для админов)
    """
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user = crud.update_user(db, user_id=user_id, user_update=user_in)
    return user

@router.delete("/{user_id}", response_model=bool)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Удаление пользователя (только для админов)
    """
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Запрещаем удалять себя
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя удалить себя")
    
    result = crud.delete_user(db, user_id=user_id)
    return result
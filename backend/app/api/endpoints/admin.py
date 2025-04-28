from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os
from pathlib import Path

from sqlalchemy.orm import Session

from app import schemas, crud, models
from app.database import get_db
from app.core.auth import get_current_admin_user

# Путь к шаблонам
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
templates = Jinja2Templates(directory=str(Path(BASE_DIR, "app", "static", "admin")))

router = APIRouter()

@router.get("/dashboard", response_class=HTMLResponse)
async def admin_dashboard(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Административная панель
    """
    cars_count = len(crud.get_cars(db))
    users_count = len(crud.get_users(db))
    
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "current_user": current_user, 
         "cars_count": cars_count, "users_count": users_count}
    )

@router.get("/stats", response_model=dict)
async def admin_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Получение статистики для админ-панели в формате JSON
    """
    cars = crud.get_cars(db)
    users = crud.get_users(db)
    
    # Получаем список брендов и количество моделей для каждого
    brands = {}
    for car in cars:
        if car.brand in brands:
            brands[car.brand] += 1
        else:
            brands[car.brand] = 1
    
    # Сортируем бренды по количеству моделей
    sorted_brands = sorted(brands.items(), key=lambda x: x[1], reverse=True)
    
    # Собираем статистику пользователей
    active_users = sum(1 for user in users if user.is_active)
    admin_users = sum(1 for user in users if user.is_admin)
    
    return {
        "total_cars": len(cars),
        "total_users": len(users),
        "active_users": active_users,
        "admin_users": admin_users,
        "brands": dict(sorted_brands),
    }

@router.get("/users", response_model=List[schemas.User])
async def admin_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Получение списка пользователей для админ-панели
    """
    return crud.get_users(db, skip=skip, limit=limit)

@router.get("/cars", response_model=List[schemas.Car])
async def admin_cars(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_admin_user),
) -> Any:
    """
    Получение списка автомобилей для админ-панели
    """
    return crud.get_cars(db, skip=skip, limit=limit)
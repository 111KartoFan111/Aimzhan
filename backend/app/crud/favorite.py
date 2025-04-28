from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteCreate

def get_favorite(db: Session, favorite_id: int) -> Optional[Favorite]:
    return db.query(Favorite).filter(Favorite.id == favorite_id).first()

def get_favorite_by_user_and_car(db: Session, user_id: int, car_id: int) -> Optional[Favorite]:
    return db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.car_id == car_id
    ).first()

def get_favorites_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Favorite]:
    return db.query(Favorite).filter(Favorite.user_id == user_id).offset(skip).limit(limit).all()

def create_favorite(db: Session, favorite: FavoriteCreate, user_id: int) -> Favorite:
    db_favorite = Favorite(
        user_id=user_id,
        car_id=favorite.car_id
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

def delete_favorite(db: Session, user_id: int, car_id: int) -> bool:
    db_favorite = get_favorite_by_user_and_car(db, user_id, car_id)
    if not db_favorite:
        return False
    
    db.delete(db_favorite)
    db.commit()
    return True

def check_is_favorite(db: Session, user_id: int, car_id: int) -> bool:
    db_favorite = get_favorite_by_user_and_car(db, user_id, car_id)
    return db_favorite is not None
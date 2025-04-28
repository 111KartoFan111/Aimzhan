from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.models.car import Car
from app.schemas.car import CarCreate, CarUpdate

def get_car(db: Session, car_id: int) -> Optional[Car]:
    return db.query(Car).filter(Car.id == car_id).first()

def get_cars(db: Session, skip: int = 0, limit: int = 100) -> List[Car]:
    return db.query(Car).offset(skip).limit(limit).all()

def get_cars_by_brand(db: Session, brand: str, skip: int = 0, limit: int = 100) -> List[Car]:
    return db.query(Car).filter(Car.brand == brand).offset(skip).limit(limit).all()

def get_brands(db: Session) -> List[str]:
    return [brand[0] for brand in db.query(Car.brand).distinct().all()]

def create_car(db: Session, car: CarCreate) -> Car:
    db_car = Car(
        brand=car.brand,
        model=car.model,
        year=car.year,
        price=car.price,
        engine=car.engine,
        transmission=car.transmission,
        color=car.color,
        body_type=car.body_type,
        drivetrain=car.drivetrain,
        description=car.description,
        features=car.features,
        image=car.image
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

def update_car(db: Session, car_id: int, car_update: CarUpdate) -> Optional[Car]:
    db_car = get_car(db, car_id)
    if not db_car:
        return None
    
    # Обновляем только предоставленные поля
    update_data = car_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_car, key, value)
    
    db.commit()
    db.refresh(db_car)
    return db_car

def delete_car(db: Session, car_id: int) -> bool:
    db_car = get_car(db, car_id)
    if not db_car:
        return False
    
    db.delete(db_car)
    db.commit()
    return True

def search_cars(db: Session, 
                brand: Optional[str] = None, 
                min_price: Optional[float] = None, 
                max_price: Optional[float] = None, 
                year: Optional[int] = None,
                skip: int = 0, 
                limit: int = 100) -> List[Car]:
    query = db.query(Car)
    
    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))
    
    if min_price is not None:
        query = query.filter(Car.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Car.price <= max_price)
    
    if year is not None:
        query = query.filter(Car.year == year)
    
    return query.offset(skip).limit(limit).all()
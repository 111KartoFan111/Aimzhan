from sqlalchemy import Column, Integer, String, Float, Text, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base

class Car(Base):
    __tablename__ = "cars"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer)
    price = Column(Float)
    engine = Column(String)
    transmission = Column(String)
    color = Column(String)
    body_type = Column(String)
    drivetrain = Column(String)
    description = Column(Text)
    features = Column(ARRAY(String))  # Хранение списка особенностей
    image = Column(String)  # URL изображения
    
    # Отношение к избранному
    favorites = relationship("Favorite", back_populates="car", cascade="all, delete-orphan")
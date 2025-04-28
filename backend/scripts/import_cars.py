import sys
import os
import json
import logging
from sqlalchemy.orm import Session

# Добавляем путь к корневой директории проекта
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models.car import Car
from app import crud

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Данные о машинах
CARS_DATA = [
    # Toyota модели 2025
    {
        "brand": "Toyota",
        "model": "Camry Hybrid",
        "year": 2025,
        "price": 32000,
        "engine": "2.5 л Hybrid",
        "transmission": "Автоматическая",
        "color": "Серебристый",
        "body_type": "Седан",
        "drivetrain": "Передний",
        "description": "Современный гибридный седан с впечатляющей топливной эффективностью и комфортабельным салоном.",
        "features": [
            "Система адаптивного круиз-контроля",
            "Мультимедиа система с 10-дюймовым экраном",
            "Беспроводная зарядка",
            "Система помощи при парковке",
            "Электронный стояночный тормоз"
        ],
        "image": "/images/cars/camry-hybrid-2025.jpg"
    },
    {
        "brand": "Toyota",
        "model": "RAV4 Electric",
        "year": 2025,
        "price": 45000,
        "engine": "Полностью электрический",
        "transmission": "Автоматическая",
        "color": "Синий",
        "body_type": "Кроссовер",
        "drivetrain": "Полный",
        "description": "Полностью электрический кроссовер с запасом хода более 500 км и современными технологиями безопасности.",
        "features": [
            "Автономное вождение уровень 2",
            "Панорамная крыша",
            "Системы климат-контроля для задних пассажиров",
            "Быстрая зарядка до 80% за 30 минут",
            "Адаптивные светодиодные фары"
        ],
        "image": "/images/cars/rav4-hybrid-2025.jpg"
    },
    # BMW модели 2025
    {
        "brand": "BMW",
        "model": "i4 M50",
        "year": 2025,
        "price": 65000,
        "engine": "Полностью электрический",
        "transmission": "Автоматическая",
        "color": "Черный",
        "body_type": "Седан",
        "drivetrain": "Полный",
        "description": "Электрический седан класса люкс с впечатляющей динамикой и запасом хода более 600 км.",
        "features": [
            "Система автономного вождения",
            "Огромный тачскрин с ИИ",
            "Быстрая зарядка",
            "Адаптивная пневмоподвеска",
            "Премиальная аудиосистема Bowers & Wilkins"
        ],
        "image": "/images/cars/i4m50.jpg"
    },
    {
        "brand": "BMW",
        "model": "X7 M60",
        "year": 2025,
        "price": 120000,
        "engine": "4.4 л V8 Гибрид",
        "transmission": "Автоматическая",
        "color": "Темно-синий",
        "body_type": "Внедорожник",
        "drivetrain": "Полный",
        "description": "Флагманский внедорожник с непревзойденным уровнем комфорта и производительности.",
        "features": [
            "Массажные сиденья",
            "Холодильник между сиденьями",
            "Панорамная крыша",
            "Система Night Vision",
            "Автоматические задние двери"
        ],
        "image": "/images/cars/x7m60.jpg"
    },
    # Lexus модели 2025
    {
        "brand": "Lexus",
        "model": "RX 500h F Sport",
        "year": 2025,
        "price": 65000,
        "engine": "2.4 л Турбо Гибрид",
        "transmission": "Автоматическая",
        "color": "Темно-синий",
        "body_type": "Кроссовер",
        "drivetrain": "Полный",
        "description": "Премиальный гибридный кроссовер с динамичным дизайном и передовыми технологиями.",
        "features": [
            "Адаптивная спортивная подвеска",
            "Системы помощи водителю",
            "Премиальная аудиосистема Mark Levinson",
            "Проекционный дисплей",
            "Электронный задний дифференциал"
        ],
        "image": "/images/cars/rx.png"
    },
    {
        "brand": "Lexus",
        "model": "LC 500 Convertible",
        "year": 2025,
        "price": 105000,
        "engine": "5.0 л V8",
        "transmission": "Автоматическая",
        "color": "Белый",
        "body_type": "Кабриолет",
        "drivetrain": "Задний",
        "description": "Роскошный спортивный кабриолет с элегантным дизайном и мощным двигателем.",
        "features": [
            "Складной мягкий верх",
            "Кожаный салон ручной работы",
            "Активная система выхлопа",
            "Адаптивная подвеска",
            "Система контроля тяги"
        ],
        "image": "/images/cars/lc500.jpg"
    },
    # Mercedes модели 2025
    {
        "brand": "Mercedes",
        "model": "EQS 580 4MATIC",
        "year": 2025,
        "price": 125000,
        "engine": "Полностью электрический",
        "transmission": "Автоматическая",
        "color": "Серебристый",
        "body_type": "Седан",
        "drivetrain": "Полный",
        "description": "Флагманский электрический седан с футуристическим дизайном и передовыми технологиями.",
        "features": [
            "Гиперэкран MBUX",
            "Система активного шумоподавления",
            "Автономное вождение уровень 3",
            "Быстрая зарядка до 80% за 30 минут",
            "Адаптивная пневмоподвеска"
        ],
        "image": "/images/cars/eqs.jpg"
    },
    {
        "brand": "Mercedes",
        "model": "G 63 AMG",
        "year": 2025,
        "price": 220000,
        "engine": "4.0 л V8 Битурбо",
        "transmission": "Автоматическая",
        "color": "Черный",
        "body_type": "Внедорожник",
        "drivetrain": "Полный",
        "description": "Культовый внедорожник с экстремальной производительностью и непревзойденным стилем.",
        "features": [
            "Карбоновые элементы кузова",
            "Адаптивная подвеска AMG",
            "Спортивные сиденья с электроприводом",
            "Система Launch Control",
            "Активная выхлопная система"
        ],
        "image": "/images/cars/g63.jpg"
    },
]

def main():
    """
    Импортирует данные о машинах в базу данных
    """
    logger.info("Создание таблиц в базе данных...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже машины в базе
        existing_cars = db.query(Car).count()
        if existing_cars > 0:
            logger.info(f"В базе данных уже есть {existing_cars} машин. Пропускаем импорт.")
            return
        
        logger.info("Начинаем импорт машин...")
        for car_data in CARS_DATA:
            # Проверяем наличие всех необходимых полей
            car = Car(
                brand=car_data["brand"],
                model=car_data["model"],
                year=car_data["year"],
                price=car_data["price"],
                engine=car_data["engine"],
                transmission=car_data["transmission"],
                color=car_data["color"],
                body_type=car_data["body_type"],
                drivetrain=car_data.get("drivetrain", "Не указано"),  # Используем get для безопасного доступа
                description=car_data["description"],
                features=car_data["features"],
                image=car_data["image"]
            )
            db.add(car)
        
        db.commit()
        logger.info(f"Импорт завершен. Импортировано {len(CARS_DATA)} машин.")
    
    except Exception as e:
        logger.error(f"Ошибка при импорте данных: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
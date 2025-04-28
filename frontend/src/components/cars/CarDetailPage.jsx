import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import carService from '../../services/carService';
import favoriteService from '../../services/favoriteService';
import authService from '../../services/authService';
import './CarDetailPage.css';

function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carData = await carService.getCarById(parseInt(carId));
        setCar(carData);
        
        // Проверяем, авторизован ли пользователь
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);
        
        // Если пользователь авторизован, проверяем, есть ли автомобиль в избранном
        if (isAuth) {
          const favStatus = await favoriteService.checkIsFavorite(parseInt(carId));
          setIsFavorite(favStatus);
        }
      } catch (error) {
        setError('Не удалось загрузить информацию об автомобиле');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Если автомобиль уже в избранном, удаляем его
        await favoriteService.removeFromFavorites(parseInt(carId));
        setIsFavorite(false);
      } else {
        // Иначе добавляем в избранное
        await favoriteService.addToFavorites(parseInt(carId));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="car-detail-error">
        <h2>Ошибка</h2>
        <p>{error}</p>
        <Link to="/cars" className="back-to-cars-btn">Вернуться к списку автомобилей</Link>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="car-detail-error">
        <h2>Автомобиль не найден</h2>
        <Link to="/cars" className="back-to-cars-btn">Вернуться к списку автомобилей</Link>
      </div>
    );
  }

  return (
    <div className="car-detail-container">
      <div className="car-detail-header">
        <Link to="/cars" className="back-btn">
          ← Назад к списку
        </Link>
        <h1>{car.brand} {car.model}</h1>
        {isAuthenticated && (
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </button>
        )}
      </div>

      <div className="car-detail-content">
        <div className="car-detail-image-container">
          <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-detail-image" />
        </div>

        <div className="car-detail-info">
          <div className="car-basic-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Год выпуска:</span>
                <span className="info-value">{car.year}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Цена:</span>
                <span className="info-value">${car.price?.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Двигатель:</span>
                <span className="info-value">{car.engine}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Трансмиссия:</span>
                <span className="info-value">{car.transmission}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Привод:</span>
                <span className="info-value">{car.drivetrain}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Цвет:</span>
                <span className="info-value">{car.color}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Тип кузова:</span>
                <span className="info-value">{car.body_type}</span>
              </div>
            </div>
          </div>

          <div className="car-description">
            <h2>Описание</h2>
            <p>{car.description}</p>
          </div>

          <div className="car-features">
            <h2>Особенности и комплектация</h2>
            <ul className="features-list">
              {car.features && car.features.map((feature, index) => (
                <li key={index} className="feature-item">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetailPage;
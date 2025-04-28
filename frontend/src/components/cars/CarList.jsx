
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import carService from '../../services/carService';
import favoriteService from '../../services/favoriteService';
import authService from '../../services/authService';
import './CarList.css';
function CarList() {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritesMap, setFavoritesMap] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        // Получаем список автомобилей с сервера
        const carsData = await carService.getAllCars();
        setCars(carsData);

        // Проверяем, авторизован ли пользователь
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        // Если пользователь авторизован, получаем список избранных автомобилей
        if (isAuth) {
          const favorites = await favoriteService.getFavorites();
          const favsMap = {};
          favorites.forEach(fav => {
            favsMap[fav.car_id] = true;
          });
          setFavoritesMap(favsMap);
        }
      } catch (error) {
        setError('Не удалось загрузить список автомобилей');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsData();
  }, []);

  const handleSelectCar = (car) => {
  };

  const handleToggleFavorite = async (carId, event) => {
    // Предотвращаем всплытие события, чтобы не вызвать handleSelectCar
    event.stopPropagation();

    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      alert('Пожалуйста, войдите, чтобы добавить автомобиль в избранное');
      return;
    }

    try {
      if (favoritesMap[carId]) {
        // Если автомобиль уже в избранном, удаляем его
        await favoriteService.removeFromFavorites(carId);
        setFavoritesMap(prev => {
          const newMap = { ...prev };
          delete newMap[carId];
          return newMap;
        });
      } else {
        // Иначе добавляем в избранное
        await favoriteService.addToFavorites(carId);
        setFavoritesMap(prev => ({
          ...prev,
          [carId]: true
        }));
      }
    } catch (error) {
      console.error('Ошибка при обновлении избранного:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка списка автомобилей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="car-list-container">
      <div className="car-grid">
        {cars.map(car => (
          <div key={car.id} className="car-card">
            <div className="car-card-image">
              <img src={car.image} alt={`${car.brand} ${car.model}`} />
              {isAuthenticated && (
                <button 
                  className={`favorite-toggle ${favoritesMap[car.id] ? 'active' : ''}`}
                  onClick={(e) => handleToggleFavorite(car.id, e)}
                  title={favoritesMap[car.id] ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  ♥
                </button>
              )}
            </div>
            <div className="car-card-info">
              <h3>{car.brand} {car.model}</h3>
              <p>Год: {car.year}</p>
              <p>Цена: ${car.price?.toLocaleString()}</p>
              <Link to={`/cars/${car.id}`} className="view-details-btn">
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarList;
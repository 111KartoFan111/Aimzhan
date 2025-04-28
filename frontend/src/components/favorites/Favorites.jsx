import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import favoriteService from '../../services/favoriteService';
import './Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesData = await favoriteService.getFavoritesWithCars();
        setFavorites(favoritesData);
      } catch (error) {
        setError('Не удалось загрузить избранные автомобили');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (carId) => {
    try {
      await favoriteService.removeFromFavorites(carId);
      // Обновляем список избранного, удаляя машину с указанным id
      setFavorites(favorites.filter(fav => fav.car_id !== carId));
    } catch (error) {
      setError('Не удалось удалить автомобиль из избранного');
      console.error(error);
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

  return (
    <div className="favorites-container">
      <h1>Избранные автомобили</h1>
      
      {error && <div className="favorites-error">{error}</div>}
      
      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>У вас пока нет избранных автомобилей</p>
          <Link to="/cars" className="favorites-link">Перейти в каталог автомобилей</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-card">
              <button 
                className="remove-favorite-btn" 
                onClick={() => handleRemoveFromFavorites(favorite.car_id)}
                title="Удалить из избранного"
              >
                ×
              </button>
              
              <div className="favorite-card-image">
                <img 
                  src={favorite.car.image} 
                  alt={`${favorite.car.brand} ${favorite.car.model}`}
                />
              </div>
              
              <div className="favorite-card-info">
                <h3>{favorite.car.brand} {favorite.car.model}</h3>
                <p>Год: {favorite.car.year}</p>
                <p>Цена: ${favorite.car.price.toLocaleString()}</p>
                <p>Двигатель: {favorite.car.engine}</p>
                
                <div className="favorite-card-actions">
                  <Link 
                    to={`/cars/${favorite.car_id}`} 
                    className="favorite-card-btn"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
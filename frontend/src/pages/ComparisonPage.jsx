import React, { useState, useEffect } from 'react';
import carService from '../services/carService';
import './ComparisonPage.css';

function ComparisonPage() {
  const [brands, setBrands] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        // Получаем список всех автомобилей с сервера
        const carsData = await carService.getAllCars();
        
        // Получаем уникальные бренды
        const uniqueBrands = [...new Set(carsData.map(car => car.brand))];
        
        setBrands(uniqueBrands);
        setAvailableCars(carsData);
      } catch (error) {
        setError('Не удалось загрузить данные автомобилей');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsData();
  }, []);

  const handleCarSelect = (car) => {
    if (selectedCars.length < 2 && !selectedCars.some(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
      // Фильтруем доступные машины, исключая уже выбранные
      setAvailableCars(availableCars.filter(c => c.id !== car.id));
    }
  };

  const removeSelectedCar = (carToRemove) => {
    // Удаляем машину из выбранных
    const updatedSelectedCars = selectedCars.filter(car => car.id !== carToRemove.id);
    setSelectedCars(updatedSelectedCars);
    
    // Возвращаем удаленную машину в список доступных
    setAvailableCars([...availableCars, carToRemove].sort((a, b) => a.id - b.id));
  };

  const resetComparison = () => {
    setSelectedCars([]);
    // Восстанавливаем все автомобили в списке доступных
    setAvailableCars(prev => [...prev, ...selectedCars].sort((a, b) => a.id - b.id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных автомобилей...</p>
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
    <div className="comparison-page">
      <h1>Сравнение Автомобилей</h1>
      
      <div className="car-selection">
        {/* Список доступных машин */}
        <div className="available-cars">
          <h2>Доступные Автомобили</h2>
          
          {/* Фильтр по брендам */}
          <div className="brands-filter">
            <select 
              onChange={(e) => {
                if (e.target.value === 'all') {
                  // Показать все автомобили, кроме выбранных
                  const selectedIds = selectedCars.map(car => car.id);
                  setAvailableCars(
                    availableCars.filter(car => !selectedIds.includes(car.id))
                  );
                } else {
                  // Фильтровать по выбранному бренду
                  const selectedIds = selectedCars.map(car => car.id);
                  const filteredCars = availableCars.filter(
                    car => car.brand === e.target.value && !selectedIds.includes(car.id)
                  );
                  setAvailableCars(filteredCars);
                }
              }}
              className="brand-select"
            >
              <option value="all">Все бренды</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          
          {availableCars.length === 0 ? (
            <p className="no-cars-message">Нет доступных автомобилей</p>
          ) : (
            <div className="cars-list">
              {availableCars.map(car => (
                <div 
                  key={car.id} 
                  className="car-selector"
                  onClick={() => handleCarSelect(car)}
                >
                  {car.brand} {car.model} ({car.year})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Секция сравнения */}
        <div className="comparison-section">
          {selectedCars.length > 0 ? (
            selectedCars.map(car => (
              <div key={car.id} className="compared-car">
                <button
                  className="remove-btn"
                  onClick={() => removeSelectedCar(car)}
                  title="Удалить из сравнения"
                >
                  ×
                </button>
                
                <div className="compared-car-image">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} />
                </div>
                
                <h3>{car.brand} {car.model}</h3>
                
                <div className="compared-car-details">
                  <div className="compared-car-item">
                    <strong>Год:</strong> <span>{car.year}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Цена:</strong> <span>${car.price?.toLocaleString()}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Двигатель:</strong> <span>{car.engine}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Трансмиссия:</strong> <span>{car.transmission}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Привод:</strong> <span>{car.drivetrain}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Тип кузова:</strong> <span>{car.body_type}</span>
                  </div>
                  <div className="compared-car-item">
                    <strong>Цвет:</strong> <span>{car.color}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="placeholder">
              <p>Выберите до 2 автомобилей для сравнения</p>
            </div>
          )}
        </div>
      </div>

      {selectedCars.length > 0 && (
        <button 
          className="reset-comparison-btn" 
          onClick={resetComparison}
        >
          Сбросить сравнение
        </button>
      )}
    </div>
  );
}

export default ComparisonPage;
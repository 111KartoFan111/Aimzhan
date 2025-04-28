import React, { useState } from 'react';
import { CARS_DATA } from '../data/carsData';
import './ComparisonPage.css';

function ComparisonPage() {
  // Извлекаем уникальные бренды
  const brands = [...new Set(CARS_DATA.map(car => car.brand))];
  
  // Состояние для выбранных машин и брендов
  const [selectedCars, setSelectedCars] = useState([]);
  const [availableCars, setAvailableCars] = useState(CARS_DATA);

  const handleCarSelect = (car) => {
    if (selectedCars.length < 2 && !selectedCars.includes(car)) {
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
    setAvailableCars([...availableCars, carToRemove]);
  };

  const resetComparison = () => {
    setSelectedCars([]);
    setAvailableCars(CARS_DATA);
  };

  return (
    <div className="comparison-page">
      <h1>Сравнение Автомобилей</h1>
      <div className="car-selection">
        {/* Список доступных машин */}
        <div className="available-cars">
          <h2>Доступные Автомобили</h2>
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

        {/* Секция сравнения */}
        <div className="comparison-section">
          {selectedCars.length > 0 ? (
            selectedCars.map(car => (
              <div key={car.id} className="compared-car">
                <button
                  className="remove-btn"
                  onClick={() => removeSelectedCar(car)}
                >
                  ×
                </button>
                <img src={car.image} alt={`${car.brand} ${car.model}`} />
                <h2>{car.brand} {car.model}</h2>
                <div className="car-details">
                  <p>Год: {car.year}</p>
                  <p>Цена: ${car.price}</p>
                  <p>Двигатель: {car.engine}</p>
                  <p>Коробка передач: {car.transmission}</p>
                  <p>Привод: {car.drivetrain}</p>
                  <p>Кузов: {car.bodyType}</p>
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

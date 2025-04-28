import React, { useState } from 'react';
import { CARS_DATA } from '../data/carsData';
import './CarsPage.css';

function CarsPage() {
  // Get unique brands from the CARS_DATA
  const brands = [...new Set(CARS_DATA.map(car => car.brand))];
  
  // State to track selected brand
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // State for modal
  const [selectedCar, setSelectedCar] = useState(null);

  // Filter cars based on selected brand
  const filteredCars = selectedBrand 
    ? CARS_DATA.filter(car => car.brand === selectedBrand)
    : [];

  // Функция для открытия модального окна
  const openModal = (car) => {
    setSelectedCar(car);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setSelectedCar(null);
  };

  return (
    <div className="cars-page">
      <h1>Каталог Автомобилей</h1>
      
      {/* Brand Selection Section */}
      <div className="brand-selection">
        <h2>Выберите Бренд</h2>
        <div className="brands-grid">
          {brands.map(brand => (
            <button 
              key={brand} 
              className={`brand-btn ${selectedBrand === brand ? 'selected' : ''}`}
              onClick={() => setSelectedBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Display Section */}
      {selectedBrand && (
        <div>
          <h2>Модели {selectedBrand}</h2>
          <div className="cars-grid">
            {filteredCars.map(car => (
              <div key={car.id} className="car-card">
                <img src={car.image} alt={`${car.brand} ${car.model}`} />
                <div className="car-info">
                  <h2>{car.brand} {car.model}</h2>
                  <p>Год: {car.year}</p>
                  <p>Цена: ${car.price}</p>
                  <button 
                    className="btn" 
                    onClick={() => openModal(car)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional: Reset Button */}
      {selectedBrand && (
        <button 
          className="reset-btn" 
          onClick={() => setSelectedBrand(null)}
        >
          Сбросить выбор
        </button>
      )}

      {/* Модальное окно */}
      {selectedCar && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="close-modal" 
              onClick={closeModal}
            >
              ×
            </button>

            <div className="modal-car-details">
              <img 
                src={selectedCar.image} 
                alt={`${selectedCar.brand} ${selectedCar.model}`} 
                className="modal-car-image"
              />
              
              <div className="modal-car-info">
                <h2>{selectedCar.brand} {selectedCar.model}</h2>
                
                <div className="car-specs">
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span>Год:</span>
                      <p>{selectedCar.year}</p>
                    </div>
                    <div className="spec-item">
                      <span>Цена:</span>
                      <p>${selectedCar.price}</p>
                    </div>
                    <div className="spec-item">
                      <span>Двигатель:</span>
                      <p>{selectedCar.engine}</p>
                    </div>
                    <div className="spec-item">
                      <span>Коробка передач:</span>
                      <p>{selectedCar.transmission}</p>
                    </div>
                    <div className="spec-item">
                      <span>Привод:</span>
                      <p>{selectedCar.drivetrain}</p>
                    </div>
                    <div className="spec-item">
                      <span>Цвет:</span>
                      <p>{selectedCar.color}</p>
                    </div>
                  </div>
                </div>

                <div className="car-description">
                  <h3>Описание</h3>
                  <p>{selectedCar.description}</p>
                </div>

                <div className="car-additional-details">
                  <h3>Дополнительная информация</h3>
                  <ul>
                    {selectedCar.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarsPage;
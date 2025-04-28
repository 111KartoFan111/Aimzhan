import React, { useState } from 'react';
import './CarCard.css';

function CarCard({ car, onSelectCar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault(); // Prevent default button behavior
    e.stopPropagation(); // Stop event from bubbling to parent
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.preventDefault(); // Prevent default button behavior
    e.stopPropagation(); // Stop event from bubbling to parent
    setIsModalOpen(false);
  };

  return (
    <div className="car-card" onClick={() => onSelectCar(car)}>
      <img src={car.image} alt={`${car.brand} ${car.model}`} />
      
      <div className="car-card-info">
        <h3>{car.brand} {car.model}</h3>
        <p>Год: {car.year}</p>
        <p>Цена: ${car.price}</p>
        
        <button 
          className="btn" 
          onClick={openModal}
        >
          Подробнее
        </button>
      </div>

      {isModalOpen && (
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
                src={car.image} 
                alt={`${car.brand} ${car.model}`} 
                className="modal-car-image"
              />
              
              <div className="modal-car-info">
                <h2>{car.brand} {car.model}</h2>
                
                <div className="car-specs">
                  <div className="spec-grid">
                    <div className="spec-item">
                      <span>Год:</span>
                      <p>{car.year}</p>
                    </div>
                    <div className="spec-item">
                      <span>Цена:</span>
                      <p>${car.price}</p>
                    </div>
                    <div className="spec-item">
                      <span>Двигатель:</span>
                      <p>{car.engine}</p>
                    </div>
                    <div className="spec-item">
                      <span>Коробка передач:</span>
                      <p>{car.transmission}</p>
                    </div>
                    <div className="spec-item">
                      <span>Привод:</span>
                      <p>{car.drivetrain}</p>
                    </div>
                    <div className="spec-item">
                      <span>Цвет:</span>
                      <p>{car.color}</p>
                    </div>
                  </div>
                </div>

                <div className="car-description">
                  <h3>Описание</h3>
                  <p>{car.description}</p>
                </div>

                <div className="car-additional-details">
                  <h3>Дополнительная информация</h3>
                  <ul>
                    {car.features.map((feature, index) => (
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

export default CarCard;
import React from 'react';
import './CarDetails.css';

function CarDetails({ car }) {
  return (
    <div className="car-details">
      <div className="car-details-image">
        <img src={car.image} alt={`${car.brand} ${car.model}`} />
      </div>
      <div className="car-details-info">
        <h2>{car.brand} {car.model}</h2>
        <div className="car-details-grid">
          <div className="detail-item">
            <span>Год:</span>
            <p>{car.year}</p>
          </div>
          <div className="detail-item">
            <span>Цена:</span>
            <p>${car.price}</p>
          </div>
          <div className="detail-item">
            <span>Двигатель:</span>
            <p>{car.engine}</p>
          </div>
          <div className="detail-item">
            <span>Трансмиссия:</span>
            <p>{car.transmission}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;
import React, { useState } from 'react';
import { CARS_DATA } from '../../data/carsData';
import CarCard from './CarCard';
import CarDetails from './CarDetails';
import './CarList.css';

function CarList() {
  const [selectedCar, setSelectedCar] = useState(null);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  return (
    <div className="car-list-container">
      <div className="car-grid">
        {CARS_DATA.map(car => (
          <CarCard 
            key={car.id} 
            car={car} 
            onSelectCar={handleSelectCar} 
          />
        ))}
      </div>
      {selectedCar && (
        <div className="car-details-section">
          <CarDetails car={selectedCar} />
        </div>
      )}
    </div>
  );
}

export default CarList;
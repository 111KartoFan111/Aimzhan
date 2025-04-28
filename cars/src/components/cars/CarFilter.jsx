import React, { useState } from 'react';
import { CARS_DATA } from '../../data/carsData';
import './CarFilter.css';

function CarFilter({ onFilterApply }) {
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    year: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filteredCars = CARS_DATA;

    if (filters.brand) {
      filteredCars = filteredCars.filter(car => 
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filteredCars = filteredCars.filter(car => 
        car.price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filteredCars = filteredCars.filter(car => 
        car.price <= parseInt(filters.maxPrice)
      );
    }

    if (filters.year) {
      filteredCars = filteredCars.filter(car => 
        car.year === parseInt(filters.year)
      );
    }

    onFilterApply(filteredCars);
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      year: ''
    });
    onFilterApply(CARS_DATA);
  };

  return (
    <div className="car-filter">
      <div className="filter-inputs">
        <input
          type="text"
          name="brand"
          placeholder="Марка"
          value={filters.brand}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Мин. цена"
          value={filters.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Макс. цена"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="year"
          placeholder="Год"
          value={filters.year}
          onChange={handleInputChange}
        />
      </div>
      <div className="filter-actions">
        <button 
          className="btn filter-btn" 
          onClick={applyFilters}
        >
          Применить фильтры
        </button>
        <button 
          className="btn filter-btn reset-btn" 
          onClick={resetFilters}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}

export default CarFilter;
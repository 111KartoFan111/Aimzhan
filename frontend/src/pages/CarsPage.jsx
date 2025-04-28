import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService';
import './CarsPage.css';

function CarsPage() {
  // State для хранения данных из БД
  const [brands, setBrands] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State to track selected brand
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // State for modal
  const [selectedCar, setSelectedCar] = useState(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем список всех брендов
        const brandsData = await carService.getAllBrands();
        setBrands(brandsData);
        
        // Загружаем все автомобили
        const carsData = await carService.getAllCars();
        setCars(carsData);
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Фильтруем машины по выбранному бренду
  const filteredCars = selectedBrand 
    ? cars.filter(car => car.brand === selectedBrand)
    : [];

  // Функция для открытия модального окна
  const openModal = (car) => {
    setSelectedCar(car);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setSelectedCar(null);
  };
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных...</p>
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
                  <Link 
                    to={`/cars/${car.id}`} 
                    className="btn"
                  >
                    Подробнее
                  </Link>

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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './Admin.css';

function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    engine: '',
    transmission: '',
    color: '',
    body_type: '',
    drivetrain: '',
    description: '',
    features: [],
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCars();
      setCars(data);
    } catch (error) {
      setError('Ошибка при загрузке автомобилей');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (car = null) => {
    if (car) {
      // Преобразуем features в строку для редактирования
      const featuresString = car.features ? car.features.join(', ') : '';
      setFormData({
        ...car,
        features: featuresString
      });
      setCurrentCar(car);
    } else {
      setFormData({
        brand: '',
        model: '',
        year: '',
        price: '',
        engine: '',
        transmission: '',
        color: '',
        body_type: '',
        drivetrain: '',
        description: '',
        features: '',
        image: ''
      });
      setCurrentCar(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Преобразуем строку features обратно в массив
      const processedData = {
        ...formData,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        features: formData.features.split(',').map(item => item.trim())
      };

      let result;
      if (currentCar) {
        // Обновляем существующий автомобиль
        result = await adminService.updateCar(currentCar.id, processedData);
      } else {
        // Создаем новый автомобиль
        result = await adminService.createCar(processedData);
      }

      // Обновляем список автомобилей
      fetchCars();
      handleCloseModal();
      alert(currentCar ? 'Автомобиль успешно обновлен' : 'Автомобиль успешно добавлен');
    } catch (error) {
      console.error('Ошибка при сохранении автомобиля:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      try {
        await adminService.deleteCar(carId);
        fetchCars();
        alert('Автомобиль успешно удален');
      } catch (error) {
        console.error('Ошибка при удалении автомобиля:', error);
        alert('Ошибка при удалении автомобиля');
      }
    }
  };

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !cars.length) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Управление автомобилями</h1>
        <div className="admin-actions">
          <Link to="/admin" className="admin-btn secondary">Назад к дашборду</Link>
          <button className="admin-btn" onClick={() => handleOpenModal()}>
            Добавить автомобиль
          </button>
        </div>
      </div>

      <div className="admin-search">
        <input
          type="text"
          placeholder="Поиск по бренду или модели..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Бренд</th>
              <th>Модель</th>
              <th>Год</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map(car => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.model}`} 
                    className="admin-table-image"
                  />
                </td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>${car.price?.toLocaleString()}</td>
                <td className="admin-actions-cell">
                  <button 
                    className="admin-btn icon-btn edit"
                    onClick={() => handleOpenModal(car)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    className="admin-btn icon-btn delete"
                    onClick={() => handleDelete(car.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно для добавления/редактирования */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{currentCar ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Бренд</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Модель</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Год</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Цена</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Двигатель</label>
                  <input
                    type="text"
                    name="engine"
                    value={formData.engine}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Трансмиссия</label>
                  <input
                    type="text"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Цвет</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Тип кузова</label>
                  <input
                    type="text"
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Привод</label>
                  <input
                    type="text"
                    name="drivetrain"
                    value={formData.drivetrain}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL изображения</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group full-width">
                <label>Особенности (через запятую)</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  required
                  rows="4"
                ></textarea>
              </div>
              
              <div className="admin-form-actions">
                <button type="button" className="admin-btn secondary" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className="admin-btn">
                  {currentCar ? 'Сохранить изменения' : 'Добавить автомобиль'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarsManagement;
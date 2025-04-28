import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        setError('Не удалось загрузить данные пользователя');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Подготовка данных для обновления
    const updateData = {
      username: formData.username,
      email: formData.email,
    };

    // Добавляем пароль только если он указан
    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      // Вызываем API для обновления профиля
      // Предполагается, что у authService есть метод updateProfile
      await authService.updateProfile(updateData);
      
      // Обновляем данные пользователя
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      
      // Показываем сообщение об успехе
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка при обновлении профиля');
      console.error(error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
    <div className="profile-container">
      <div className="profile-card">
        <h2>Профиль пользователя</h2>
        
        {error && <div className="profile-error">{error}</div>}
        {updateSuccess && <div className="profile-success">Профиль успешно обновлен</div>}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Новый пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Оставьте пустым, чтобы не менять"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Оставьте пустым, чтобы не менять"
            />
          </div>
          
          <div className="profile-actions">
            <button type="submit" className="profile-button">Сохранить изменения</button>
            <button type="button" className="profile-button logout-button" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
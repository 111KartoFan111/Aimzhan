import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import './Admin.css';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_active: true,
    is_admin: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    // Получаем информацию о текущем пользователе (админе)
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentAdmin(user);
      } catch (error) {
        console.error('Ошибка при получении данных текущего пользователя:', error);
      }
    };

    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Ошибка при загрузке пользователей');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Пароль не отображаем
        is_active: user.is_active,
        is_admin: user.is_admin
      });
      setCurrentUser(user);
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        is_active: true,
        is_admin: false
      });
      setCurrentUser(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (currentUser) {
        // Отправляем только измененные данные
        const updateData = { ...formData };
        // Если пароль пустой, удаляем его из данных
        if (!updateData.password) {
          delete updateData.password;
        }
        // Обновляем существующего пользователя
        result = await adminService.updateUser(currentUser.id, updateData);
      } else {
        // Создаем нового пользователя
        result = await adminService.createUser(formData);
      }

      // Обновляем список пользователей
      fetchUsers();
      handleCloseModal();
      alert(currentUser ? 'Пользователь успешно обновлен' : 'Пользователь успешно добавлен');
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
      if (error.response && error.response.data) {
        alert(`Ошибка: ${error.response.data.detail || 'Неизвестная ошибка'}`);
      } else {
        alert('Ошибка при сохранении данных');
      }
    }
  };

  const handleDelete = async (userId) => {
    // Проверяем, не пытается ли админ удалить самого себя
    if (currentAdmin && currentAdmin.id === userId) {
      alert('Вы не можете удалить собственную учетную запись');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
        alert('Пользователь успешно удален');
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !users.length) {
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
        <h1>Управление пользователями</h1>
        <div className="admin-actions">
          <Link to="/admin" className="admin-btn secondary">Назад к дашборду</Link>
          <button className="admin-btn" onClick={() => handleOpenModal()}>
            Добавить пользователя
          </button>
        </div>
      </div>

      <div className="admin-search">
        <input
          type="text"
          placeholder="Поиск по имени или email..."
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
              <th>Имя пользователя</th>
              <th>Email</th>
              <th>Статус</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td>
                  <span className={`admin-badge ${user.is_admin ? 'admin' : 'user'}`}>
                    {user.is_admin ? 'Администратор' : 'Пользователь'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="admin-actions-cell">
                  <button 
                    className="admin-btn icon-btn edit"
                    onClick={() => handleOpenModal(user)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  {/* Не даем удалить самого себя */}
                  {currentAdmin && currentAdmin.id !== user.id && (
                    <button 
                      className="admin-btn icon-btn delete"
                      onClick={() => handleDelete(user.id)}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  )}
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
              <h2>{currentUser ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
              <button className="admin-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Имя пользователя</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  {currentUser 
                    ? 'Новый пароль (оставьте пустым, чтобы не менять)' 
                    : 'Пароль'
                  }
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentUser} // Обязательно только для новых пользователей
                  minLength={8}
                />
                {currentUser && (
                  <small className="form-hint">
                    Оставьте поле пустым, если не хотите менять пароль
                  </small>
                )}
              </div>
              
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Активен
                </label>
              </div>
              
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                  />
                  Администратор
                </label>
              </div>
              
              <div className="admin-form-actions">
                <button type="button" className="admin-btn secondary" onClick={handleCloseModal}>
                  Отмена
                </button>
                <button type="submit" className="admin-btn">
                  {currentUser ? 'Сохранить изменения' : 'Добавить пользователя'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
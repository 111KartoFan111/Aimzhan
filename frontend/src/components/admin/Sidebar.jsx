import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h2>AutoGuide</h2>
        <p>Панель администратора</p>
      </div>

      <nav className="admin-sidebar-nav">
        <Link 
          to="/admin" 
          className={`admin-sidebar-link ${location.pathname === '/admin' ? 'active' : ''}`}
        >
          <span className="admin-sidebar-icon">📊</span>
          <span>Дашборд</span>
        </Link>
        
        <Link 
          to="/admin/cars" 
          className={`admin-sidebar-link ${location.pathname === '/admin/cars' ? 'active' : ''}`}
        >
          <span className="admin-sidebar-icon">🚗</span>
          <span>Автомобили</span>
        </Link>
        
        <Link 
          to="/admin/users" 
          className={`admin-sidebar-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
        >
          <span className="admin-sidebar-icon">👤</span>
          <span>Пользователи</span>
        </Link>
        
        <Link to="/" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">🏠</span>
          <span>Вернуться на сайт</span>
        </Link>
      </nav>

      <button onClick={handleLogout} className="admin-sidebar-logout">
        <span className="admin-sidebar-icon">🚪</span>
        <span>Выйти</span>
      </button>
    </div>
  );
}

export default Sidebar;
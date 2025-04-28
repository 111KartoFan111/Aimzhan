import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import favoriteService from '../../services/favoriteService';
import './Header.css';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          setIsAuthenticated(true);
          // Получаем информацию о пользователе
          const user = await authService.getCurrentUser();
          setUsername(user.username);
          
          // Получаем количество избранных автомобилей
          const count = await favoriteService.getFavoritesCount();
          setFavoritesCount(count);
        } else {
          setIsAuthenticated(false);
          setUsername('');
          setFavoritesCount(0);
        }
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
        setIsAuthenticated(false);
        authService.logout();
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername('');
    setFavoritesCount(0);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">AutoGuide</Link>
      </div>
      
      {/* Кнопка мобильного меню */}
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        <span className="menu-icon"></span>
      </button>
      
      <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Главная</Link>
        <Link to="/cars" className="nav-link" onClick={() => setMenuOpen(false)}>Автомобили</Link>
        <Link to="/comparison" className="nav-link" onClick={() => setMenuOpen(false)}>Сравнение</Link>
        
        {/* Ссылки для аутентифицированных пользователей */}
        {isAuthenticated ? (
          <>
            <Link to="/favorites" className="nav-link favorites-link" onClick={() => setMenuOpen(false)}>
              Избранное
              {favoritesCount > 0 && <span className="favorites-count">{favoritesCount}</span>}
            </Link>
            <div className="user-menu-wrapper">
              <div className="user-menu-trigger">
                <span className="username">{username}</span>
                <span className="dropdown-icon">▼</span>
              </div>
              <div className="user-menu">
                <Link to="/profile" className="user-menu-item" onClick={() => setMenuOpen(false)}>
                  Мой профиль
                </Link>
                <button onClick={handleLogout} className="user-menu-item logout-btn">
                  Выйти
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Вход</Link>
            <Link to="/register" className="nav-link register-link" onClick={() => setMenuOpen(false)}>
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
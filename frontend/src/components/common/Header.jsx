import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">AutoGuide</Link>
      </div>
      <nav className="main-nav">
        <Link to="/" className="nav-link">Главная</Link>
        <Link to="/cars" className="nav-link">Автомобили</Link>
        <Link to="/comparison" className="nav-link">Сравнение</Link>
      </nav>
    </header>
  );
}

export default Header;
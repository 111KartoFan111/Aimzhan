import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="main-navigation">
      <ul>
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/cars">Автомобили</Link></li>
        <li><Link to="/comparison">Сравнение</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
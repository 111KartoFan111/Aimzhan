import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Автомобильная Информационная Система</h1>
        <p>Ваш гид в мире автомобилей</p>
        <div className="hero-actions">
          <Link to="/cars" className="btn">Каталог Авто</Link>
          <Link to="/comparison" className="btn btn-secondary">Сравнение Моделей</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Извините, запрашиваемая страница не существует.</p>
        <Link to="/" className="back-home-btn">Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
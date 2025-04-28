import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>О нас</h4>
          <p>Наш сайт — это удобная платформа для знакомства с новыми моделями автомобилей определенных марок. Мы собираем актуальную информацию, технические характеристики и ключевые особенности каждой новинки, чтобы помочь вам следить за последними тенденциями в мире авто.</p>
        </div>
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>Email: autoguide@gmail.com</p>
          <p>Телефон: +7 (776) 502-75-11  </p>
        </div>
        <div className="footer-section">
          <h4>Социальные сети</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/aaiym_ss" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 AutoInfo. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;
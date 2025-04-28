import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import './Admin.css';

// Chart.js для графиков
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Регистрируем компоненты Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await adminService.getStats();
        setStats(statsData);
      } catch (error) {
        setError('Ошибка при загрузке статистики');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Подготовка данных для графика брендов
  const prepareBrandsChartData = () => {
    if (!stats || !stats.brands) return null;

    const brands = Object.keys(stats.brands);
    const counts = Object.values(stats.brands);

    return {
      labels: brands,
      datasets: [
        {
          label: 'Количество моделей',
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Подготовка данных для графика пользователей
  const prepareUsersChartData = () => {
    if (!stats) return null;

    return {
      labels: ['Активные пользователи', 'Неактивные пользователи', 'Администраторы'],
      datasets: [
        {
          data: [
            stats.active_users - stats.admin_users, 
            stats.total_users - stats.active_users,
            stats.admin_users
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="admin-btn">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Административная панель</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-info">
            <h3>Автомобили</h3>
            <p className="stat-value">{stats.total_cars}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>Пользователи</h3>
            <p className="stat-value">{stats.total_users}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Активные пользователи</h3>
            <p className="stat-value">{stats.active_users}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔑</div>
          <div className="stat-info">
            <h3>Администраторы</h3>
            <p className="stat-value">{stats.admin_users}</p>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Распределение автомобилей по брендам</h3>
          <div className="chart-wrapper">
            {stats && stats.brands && (
              <Bar data={prepareBrandsChartData()} />
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Статистика пользователей</h3>
          <div className="chart-wrapper">
            {stats && (
              <Pie data={prepareUsersChartData()} />
            )}
          </div>
        </div>
      </div>
      
      <div className="quick-links">
        <Link to="/admin/cars" className="admin-btn">Управление автомобилями</Link>
        <Link to="/admin/users" className="admin-btn">Управление пользователями</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
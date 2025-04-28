import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import ComparisonPage from './pages/ComparisonPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import Favorites from './components/favorites/Favorites';
import CarDetailPage from './components/cars/CarDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Dashboard';
import CarsManagement from './components/admin/CarsManagement';
import UsersManagement from './components/admin/UsersManagement';
import NotFoundPage from './pages/NotFoundPage';
import './assets/styles/global.css';

// Компонент общего Layout
function Layout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>

        {/* Маршруты админ-панели */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<CarsManagement />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>

        {/* Основные маршруты с Header/Footer */}
        <Route path="/" element={<Layout />}>
          {/* Публичные страницы */}
          <Route index element={<HomePage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="cars/:carId" element={<CarDetailPage />} />
          <Route path="comparison" element={<ComparisonPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Защищённые страницы */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route 
            path="favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

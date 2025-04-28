import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

function ProtectedRoute({ children, adminOnly = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем наличие токена
        if (authService.isAuthenticated()) {
          // Дополнительно проверяем валидность токена, получая данные текущего пользователя
          const user = await authService.getCurrentUser();
          setIsAuthenticated(true);
          
          // Проверяем, является ли пользователь администратором
          setIsAdmin(user.is_admin);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        // В случае ошибки удаляем токен
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Отображаем индикатор загрузки, пока проверяем аутентификацию
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа,
  // с сохранением пути, на который он пытался перейти
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуются права администратора, но пользователь не админ
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Если пользователь аутентифицирован (и имеет необходимые права), отображаем защищенный контент
  return children;
}

export default ProtectedRoute;
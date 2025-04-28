import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

// Создаем экземпляр axios с базовым URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена аутентификации к запросам
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработчик ошибок для перехвата 401 ошибок (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Удаляем токен и перенаправляем на страницу входа
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Сервис аутентификации
const authService = {
  // Регистрация нового пользователя
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Вход пользователя
  login: async (username, password) => {
    try {
      // Для входа используем форму, как требует FastAPI OAuth2
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Сохраняем токен в localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Выход пользователя
  logout: () => {
    localStorage.removeItem('token');
  },

  // Получение текущего пользователя
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Проверка авторизации
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },
};

export default authService;
export { axiosInstance };
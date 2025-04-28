import { axiosInstance } from './authService';

const adminService = {
  // Получение статистики для дашборда
  getStats: async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Получение всех пользователей
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Создание пользователя (админом)
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Обновление пользователя
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Удаление пользователя
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Получение всех автомобилей
  getAllCars: async () => {
    try {
      const response = await axiosInstance.get('/cars');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Создание автомобиля
  createCar: async (carData) => {
    try {
      const response = await axiosInstance.post('/cars', carData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Обновление автомобиля
  updateCar: async (carId, carData) => {
    try {
      const response = await axiosInstance.put(`/cars/${carId}`, carData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Удаление автомобиля
  deleteCar: async (carId) => {
    try {
      const response = await axiosInstance.delete(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;
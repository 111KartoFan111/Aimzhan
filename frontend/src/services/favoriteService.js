import { axiosInstance } from './authService';

const favoriteService = {
  // Получение всех избранных автомобилей текущего пользователя
  getFavorites: async () => {
    try {
      const response = await axiosInstance.get('/favorites');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

// Получение избранных автомобилей с полной информацией
  getFavoritesWithCars: async () => {
    try {
      const response = await axiosInstance.get('/favorites/with-cars');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных избранного с автомобилями:', error);
      throw error;
    }
  },

  // Добавление автомобиля в избранное
  addToFavorites: async (carId) => {
    try {
      const response = await axiosInstance.post('/favorites', { car_id: carId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Удаление автомобиля из избранного
  removeFromFavorites: async (carId) => {
    try {
      const response = await axiosInstance.delete(`/favorites/${carId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Проверка, находится ли автомобиль в избранном
  checkIsFavorite: async (carId) => {
    try {
      const response = await axiosInstance.get(`/favorites/check/${carId}`);
      return response.data;
    } catch (error) {
      return false; // В случае ошибки возвращаем false
    }
  },

  // Получение количества избранных автомобилей
  getFavoritesCount: async () => {
    try {
      const response = await axiosInstance.get('/favorites/count');
      return response.data;
    } catch (error) {
      return 0; // В случае ошибки возвращаем 0
    }
  },
};

export default favoriteService;
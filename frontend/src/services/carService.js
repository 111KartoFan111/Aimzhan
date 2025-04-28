import { axiosInstance } from './authService';

const carService = {
  // Получение всех автомобилей
  getAllCars: async () => {
    try {
      const response = await axiosInstance.get('/cars');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Получение автомобиля по ID
  getCarById: async (carId) => {
    try {
      const response = await axiosInstance.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Получение автомобилей по бренду
  getCarsByBrand: async (brand) => {
    try {
      const response = await axiosInstance.get(`/cars/brand/${brand}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Получение списка всех брендов
  getAllBrands: async () => {
    try {
      const response = await axiosInstance.get('/cars/brands');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Поиск автомобилей по фильтрам
  searchCars: async (filters) => {
    try {
      // Создаем параметры запроса для фильтрации
      const params = new URLSearchParams();
      
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.year) params.append('year', filters.year);
      
      const response = await axiosInstance.get(`/cars?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default carService;
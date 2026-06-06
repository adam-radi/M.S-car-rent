import axiosInstance from './axiosInstance';

export const getCars = async (params) => {
  const response = await axiosInstance.get('/api/cars', { params });
  return response.data;
};

export const getCar = async (id) => {
  const response = await axiosInstance.get(`/api/cars/${id}`);
  return response.data;
};

export const createCar = async (carData) => {
  const response = await axiosInstance.post('/api/cars', carData);
  return response.data;
};

export const updateCar = async (id, carData) => {
  const response = await axiosInstance.put(`/api/cars/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await axiosInstance.delete(`/api/cars/${id}`);
  return response.data;
};

export const getCarFilters = async () => {
  const response = await axiosInstance.get('/api/cars/filters');
  return response.data;
};

export const getCarAvailability = async (params) => {
  const response = await axiosInstance.get('/api/cars/availability', { params });
  return response.data;
};

export const getCarBusyDates = async (id) => {
  const response = await axiosInstance.get(`/api/cars/${id}/busy-dates`);
  return response.data;
};

export const uploadCarImages = async (formData) => {
  const response = await axiosInstance.post('/api/cars/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

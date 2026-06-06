import axiosInstance from './axiosInstance';

export const getAllMaintenance = async () => {
  const response = await axiosInstance.get('/api/maintenance');
  return response.data;
};

export const createMaintenance = async (data) => {
  const response = await axiosInstance.post('/api/maintenance', data);
  return response.data;
};

export const updateMaintenanceStatus = async (id, data) => {
  const response = await axiosInstance.patch(`/api/maintenance/${id}`, data);
  return response.data;
};

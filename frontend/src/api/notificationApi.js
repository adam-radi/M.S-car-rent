import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  const response = await axiosInstance.get('/api/notifications');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axiosInstance.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.patch('/api/notifications/read-all');
  return response.data;
};

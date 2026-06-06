import axiosInstance from './axiosInstance';

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/api/dashboard/stats');
  return response.data;
};

export const getDashboardAnalytics = async () => {
  const response = await axiosInstance.get('/api/dashboard/analytics');
  return response.data;
};


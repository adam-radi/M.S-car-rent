import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/api/auth/login', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.get('/api/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/api/auth/users');
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await axiosInstance.put('/api/auth/updatepassword', passwordData);
  return response.data;
};

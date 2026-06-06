import axiosInstance from './axiosInstance';

export const submitContactMessage = async (formData) => {
  const response = await axiosInstance.post('/api/contact', formData);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await axiosInstance.get('/api/contact');
  return response.data;
};

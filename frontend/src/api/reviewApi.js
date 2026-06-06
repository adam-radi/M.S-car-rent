import axiosInstance from './axiosInstance';

export const getAllReviews = async () => {
  const response = await axiosInstance.get('/api/reviews');
  return response.data;
};

export const getCarReviews = async (carId) => {
  const response = await axiosInstance.get(`/api/reviews/car/${carId}`);
  return response.data;
};

export const addReview = async (reviewData) => {
  const response = await axiosInstance.post('/api/reviews', reviewData);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/api/reviews/${id}`);
  return response.data;
};

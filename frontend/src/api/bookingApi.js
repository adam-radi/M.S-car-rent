import axiosInstance from './axiosInstance';

export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post('/api/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await axiosInstance.get('/api/bookings/my-bookings');
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/api/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await axiosInstance.put(`/api/bookings/${id}/status`, statusData);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axiosInstance.get('/api/bookings');
  return response.data;
};
export const downloadInvoice = async (id) => {
  const response = await axiosInstance.get(`/api/bookings/${id}/invoice`, {
    responseType: 'blob'
  });
  return response.data;
};

export const getCarBookedDates = async (carId) => {
  const response = await axiosInstance.get(`/api/bookings/car/${carId}/dates`);
  return response.data;
};

import axios from './axiosInstance';

export const getCarDocuments = (carId) => {
  const query = carId ? `?carId=${carId}` : '';
  return axios.get(`/api/car-documents${query}`).then(res => res.data);
};

export const addCarDocument = (formData) => {
  return axios.post('/api/car-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);
};

export const updateCarDocument = (id, data) => {
  return axios.put(`/api/car-documents/${id}`, data).then(res => res.data);
};

export const deleteCarDocument = (id) => {
  return axios.delete(`/api/car-documents/${id}`).then(res => res.data);
};

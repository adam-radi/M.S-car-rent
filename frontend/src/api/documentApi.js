import axiosInstance from './axiosInstance';

export const getMyDocuments = async () => {
  const response = await axiosInstance.get('/api/documents');
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await axiosInstance.post('/api/documents/upload', formData);
  return response.data;
};

export const getAllDocuments = async () => {
  const response = await axiosInstance.get('/api/documents/all');
  return response.data;
};

export const updateDocumentStatus = async (id, data) => {
  const response = await axiosInstance.patch(`/api/documents/${id}/status`, data);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await axiosInstance.delete(`/api/documents/${id}`);
  return response.data;
};


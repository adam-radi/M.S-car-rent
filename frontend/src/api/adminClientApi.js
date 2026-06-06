import axiosInstance from './axiosInstance';

export const getClientsList = async () => {
  const response = await axiosInstance.get('/api/admin/clients/list');
  return response.data;
};

export const lookupClientByCin = async ({ cin, phone }) => {
  const params = new URLSearchParams();
  if (cin) {
    params.append('cin', cin);
  }

  if (phone) {
    params.append('phone', phone);
  }

  const response = await axiosInstance.get(`/api/admin/clients?${params.toString()}`);
  return response.data;
};

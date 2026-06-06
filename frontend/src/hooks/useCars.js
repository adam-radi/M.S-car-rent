import { useState, useCallback } from 'react';
import * as carApi from '../api/carApi';

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchCars = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.getCars(params);
      setCars(data.data);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCar = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.getCar(id);
      setCar(data.data);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch car details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCar = async (carData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.createCar(carData);
      setCars((prev) => [data.data, ...prev]);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create car');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editCar = async (id, carData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carApi.updateCar(id, carData);
      setCars((prev) => prev.map((c) => (c._id === id ? data.data : c)));
      if (car?._id === id) setCar(data.data);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await carApi.deleteCar(id);
      setCars((prev) => prev.filter((c) => c._id !== id));
      if (car?._id === id) setCar(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete car');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    cars,
    car,
    loading,
    error,
    pagination,
    fetchCars,
    fetchCar,
    addCar,
    editCar,
    removeCar
  };
};

import { useState, useCallback } from 'react';
import * as bookingApi from '../api/bookingApi';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getUserBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBooking = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getBookingById(id);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await bookingApi.createBooking(bookingData);
      if (res.success) {
        setSuccess('Booking created successfully!');
        setBooking(res.data);
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id, cancelReason) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.updateBookingStatus(id, {
        status: 'cancelled',
        cancelReason
      });
      if (res.success) {
        setSuccess('Booking cancelled successfully');
        // Update list
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, status: 'cancelled' } : b))
        );
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    booking,
    loading,
    error,
    success,
    clearMessages,
    fetchUserBookings,
    fetchBooking,
    createBooking,
    cancelBooking
  };
};

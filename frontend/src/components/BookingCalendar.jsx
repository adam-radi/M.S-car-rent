import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { getCarBusyDates } from '../api/carApi';

const BookingCalendar = ({ carId, onDateSelect }) => {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRange, setSelectedRange] = useState([]);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    if (!carId) return;

    const fetchBusyDates = async () => {
      setLoading(true);
      setError('');
      setSelectedRange([]);
      setMaxDate(null);
      setIsBlocked(false);
      onDateSelect(null, null);

      try {
        const res = await getCarBusyDates(carId);
        if (res.success) {
          setReservations(
            res.data.busyDates.map((d) => ({
              start_date: d.from,
              end_date: d.to,
            }))
          );
          setIsBlocked(res.data.isCurrentlyBlocked);
          if (res.data.isCurrentlyBlocked) {
            setError(t('bookingCalendar.blocked', { reasons: res.data.reasons.join(', ') }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch busy dates', err);
        setError(t('bookingCalendar.loadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchBusyDates();
  }, [carId, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const disabledRanges = reservations.map((res) => ({
    from: res.start_date,
    to: res.end_date,
  }));

  const isRangeOverlapping = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return reservations.some((res) => {
      const resStart = new Date(res.start_date);
      const resEnd = new Date(res.end_date);
      return (
        (startDate <= resStart && endDate >= resStart) ||
        (startDate <= resEnd && endDate >= resEnd) ||
        (startDate >= resStart && endDate <= resEnd)
      );
    });
  };

  const handleDateChange = (selectedDates) => {
    setError('');
    setSelectedRange(selectedDates);

    if (selectedDates.length === 1) {
      const start = selectedDates[0];
      const futureReservations = reservations
        .map((res) => new Date(res.start_date))
        .filter((resDate) => resDate > start)
        .sort((a, b) => a - b);

      if (futureReservations.length > 0) {
        const nearestRes = futureReservations[0];
        const prevDay = new Date(nearestRes);
        prevDay.setDate(prevDay.getDate() - 1);
        setMaxDate(prevDay);
      } else {
        setMaxDate(null);
      }

      onDateSelect(selectedDates[0], null);
    } else if (selectedDates.length === 2) {
      const [start, end] = selectedDates;

      if (isRangeOverlapping(start, end)) {
        setError(t('bookingCalendar.overlapError'));
        setSelectedRange([]);
        setMaxDate(null);
        onDateSelect(null, null);
      } else {
        onDateSelect(start, end);
        setMaxDate(null);
      }
    } else {
      onDateSelect(null, null);
      setMaxDate(null);
    }
  };

  return (
    <div className="booking-calendar-container">
      {loading ? (
        <div className="calendar-loading">
          <div className="spinner"></div>
          <p>{t('bookingCalendar.loading')}</p>
        </div>
      ) : (
        <>
          <h3>{t('bookingCalendar.selectDates')}</h3>
          <Flatpickr
            value={selectedRange}
            onChange={handleDateChange}
            options={{
              mode: 'range',
              minDate: isBlocked ? '2099-01-01' : 'today',
              maxDate: isBlocked ? '2099-01-01' : maxDate,
              disable: disabledRanges,
              dateFormat: 'Y-m-d',
              inline: true,
            }}
            className="flatpickr-custom"
          />
          {error && (
            <div className="booking-alert error" style={{ marginTop: '10px' }}>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingCalendar;

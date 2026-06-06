import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../hooks/useCars';
import { getCarAvailability } from '../api/carApi';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import '../styles/BookingPage.css';
import BookingSummary from '../components/BookingSummary';
import BookingCalendar from '../components/BookingCalendar';

const BookingPage = () => {
  const { t } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { car, loading: carLoading, fetchCar } = useCars();
  const { createBooking, loading: bookingLoading, error, success } = useBookings();
  const { isAuthenticated, user } = useAuth();

  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate,   setEndDate]   = useState(searchParams.get('end_date')   || '');
  const [pickupLocation, setPickupLocation] = useState('');
  const [cin, setCin] = useState('');
  const [phone, setPhone] = useState('');
  const [customSuccess, setCustomSuccess] = useState('');
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchCar(carId);
  }, [carId, fetchCar]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setCin(user.cin || '');
      setPhone(user.phone || '');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (car && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const totalDays = Math.ceil((end - start) / msPerDay);
        const basePrice = car.dailyPrice * totalDays;
        let discount = 0;
        let finalPrice = basePrice;

        if (car.discountThreshold && totalDays >= car.discountThreshold && car.discountPercent) {
          discount = car.discountPercent;
          finalPrice = basePrice * (1 - discount / 100);
        }

        setPreview({ totalDays, basePrice, discount, finalPrice });
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [car, startDate, endDate]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert(t('booking.alertPickDates'));
      return;
    }

    try {
      const res = await getCarAvailability({ start_date: startDate, end_date: endDate, id: carId });
      const thisCar = res.data.find(c => c._id === carId);
      if (!thisCar || thisCar.availability === 'unavailable') {
        alert(t('booking.alertUnavailable'));
        return;
      }
    } catch (err) {
      console.error('Availability check failed', err);
    }

    if (!cin || !phone) {
      alert(t('booking.alertCinPhone'));
      return;
    }
    if (!preview) {
      alert(t('booking.alertInvalidDates'));
      return;
    }
    setShowSummary(true);
  };

  const handleFinalConfirm = async () => {
    // Simulate Backend validation for Guest CIN logic
    let successMessage = t('booking.successConfirmed');
    if (!isAuthenticated) {
      const mockPastBookings = cin.startsWith('LOYAL') ? 3 : (cin.startsWith('RET') ? 1 : 0);
      if (mockPastBookings >= 3) {
        successMessage = t('booking.successLoyal');
      } else if (mockPastBookings > 0) {
        successMessage = t('booking.successReturning');
      }
    }

    const result = await createBooking({
      carId,
      cin,
      phone,
      startDate,
      endDate,
      pickupLocation,
      notes
    });

    if (result) {
      setCustomSuccess(successMessage);
      setTimeout(() => navigate('/my-bookings'), 3000);
    }
  };

  if (carLoading) {
    return (
      <div className="booking-loading">
        <div className="spinner"></div>
        <p>{t('booking.loading')}</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="booking-error">
        <h2>{t('booking.notFound')}</h2>
        <button type="button" className="btn-back" onClick={() => navigate('/cars')}>{t('booking.backToCars')}</button>
      </div>
    );
  }

  const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const carImage = car.images && car.images.length > 0
    ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}${car.images[0].startsWith('/') ? car.images[0] : '/' + car.images[0]}`)
    : 'https://via.placeholder.com/400x250?text=Car';

  return (
    <div className="booking-container">
      <div className="booking-header">
        <button type="button" className="btn-back-booking" onClick={() => navigate(`/cars/${carId}`)}>
          &larr; {t('booking.backToDetails')}
        </button>
        <h1>{t('booking.title')}</h1>
      </div>

      <div className="booking-content">
        {/* Car Summary Card */}
        <div className="booking-car-summary">
          <div className="summary-image">
            <img src={carImage} alt={`${car.brand} ${car.model}`} />
          </div>
          <div className="summary-info">
            <h2>{car.brand} {car.model} <span className="year">{car.year}</span></h2>
            <div className="summary-specs">
              <span>⚙️ {car.transmission || 'Automatic'}</span>
              <span>⛽ {car.fuelType || 'Gasoline'}</span>
              <span>💺 {car.seats || 5} seats</span>
            </div>
            <div className="summary-price">
              <span className="daily-price">${car.dailyPrice}</span>
              <span className="per-day">{t('booking.perDay')}</span>
            </div>
            {car.discountThreshold > 0 && car.discountPercent > 0 && (
              <div className="discount-badge">
                🎉 {t('booking.discountBadge', { percent: car.discountPercent, threshold: car.discountThreshold })}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-form-card">
          {error && <div className="booking-alert error">{error}</div>}
          {(success || customSuccess) && <div className="booking-alert success">{customSuccess || success}</div>}

          <form className="booking-form" onSubmit={handleInitialSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cin">{t('booking.cinLabel')}</label>
                <input
                  type="text"
                  id="cin"
                  value={cin}
                  onChange={(e) => setCin(e.target.value.toUpperCase())}
                  placeholder={t('booking.cinPlaceholder')}
                  required
                  className='input'
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">{t('booking.phoneLabel')}</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('booking.phonePlaceholder')}
                  required
                  className='input'

                />
              </div>
            </div>

            <div className="calendar-section" style={{marginBottom: '20px'}}>
              <label>{t('booking.selectDates')}</label>
              <div 
                className={`calendar-trigger-book ${startDate ? 'selected' : ''}`}
                onClick={() => setShowCalendar(true)}
              >
                {startDate && endDate 
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                  : t('booking.datesPlaceholder')}
                <span className="calendar-icon">📅</span>
              </div>
              
              <div className={`calendar-modal-overlay ${showCalendar ? 'active' : ''}`} onClick={() => setShowCalendar(false)}>
                <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="close-calendar" onClick={() => setShowCalendar(false)}>&times;</button>
                  <BookingCalendar 
                    carId={carId} 
                    onDateSelect={(start, end) => {
                      setStartDate(start);
                      setEndDate(end);
                      if (start && end) {
                        setTimeout(() => setShowCalendar(false), 300); // Slight delay for better UX
                      }
                    }} 
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pickupLocation">{t('booking.pickupLabel')}</label>
              <input
                type="text"
                id="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder={t('booking.pickupPlaceholder')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>

            {/* Price Preview */}
            {preview && (
              <div className="price-preview">
                <h3>{t('booking.priceSummary')}</h3>
                <div className="preview-row">
                  <span>{t('booking.duration')}</span>
                  <span>{t('booking.day', { count: preview.totalDays })}</span>
                </div>
                <div className="preview-row">
                  <span>{t('booking.basePrice')} </span>
                  <span>{preview.basePrice.toFixed(2)} DH</span>
                </div>
                {preview.discount > 0 && (
                  <div className="preview-row discount">
                    <span>{t('booking.discount', { percent: preview.discount })}</span>
                    <span>-{(preview.basePrice - preview.finalPrice).toFixed(2)} DH</span>
                  </div>
                )}
                <div className="preview-row total">
                  <span>{t('booking.total')}</span>
                  <span> {preview.finalPrice.toFixed(2)} DH</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-confirm-booking"
              disabled={bookingLoading || !startDate || !endDate || !pickupLocation}
            >
              {bookingLoading ? t('booking.processing') : t('booking.proceedSummary')}
            </button>
          </form>
        </div>
      </div>

      {showSummary && (
        <BookingSummary
          car={car}
          startDate={startDate}
          endDate={endDate}
          notes={notes}
          total={preview?.finalPrice}
          onBack={() => setShowSummary(false)}
          onConfirm={handleFinalConfirm}
        />
      )}
    </div>
  );
};

export default BookingPage;

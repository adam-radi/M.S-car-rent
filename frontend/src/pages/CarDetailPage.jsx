import React, { useEffect, useState, useCallback} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCars } from '../hooks/useCars';
import {useAuth} from '../hooks/useAuth';
import { getCarReviews, deleteReview } from '../api/reviewApi';
import { getCarBookedDates } from '../api/bookingApi';
import ReviewCard from '../components/ReviewCard';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CarDetailPage.css';
import '../styles/CarDetailPage_Reviews.css';
import '../styles/CarAvailability.css';

const CarDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, loading, error, fetchCar } = useCars();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

 

  const fetchBookedDates = useCallback(async () => {
    try {
      const res = await getCarBookedDates(id);
      if (res.success) setBookedDates(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await getCarReviews(id);
      if (res.success) setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar(id);
    fetchReviews();
    fetchBookedDates();
  }, [id, fetchCar, fetchReviews, fetchBookedDates]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure reviews are rendered
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight class
          element.classList.add('highlight-review');
          setTimeout(() => element.classList.remove('highlight-review'), 3000);
        } else if (hash === '#reviews') {
          const reviewsSection = document.getElementById('reviews');
          if (reviewsSection) reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [reviewsLoading, car]);
  

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm(t('carDetail.deleteReviewConfirm'))) return;
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert(t('carDetail.deleteReviewFailed'));
    }
  };

  const isDateBooked = useCallback((date) => {
    return bookedDates.some(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });
  }, [bookedDates]);

  const tileClassName = useCallback(({ date, view }) => {
    if (view === 'month' && isDateBooked(date)) {
      return 'booked-date';
    }
    return null;
  }, [isDateBooked]);

  const tileDisabled = useCallback(({ date, view }) => {
    if (view === 'month') {
      return isDateBooked(date);
    }
    return false;
  }, [isDateBooked]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;


  if (loading) {
    return (
      <div className="car-detail-loading">
        <div className="spinner"></div>
        <p>{t('carDetail.loading')}</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-detail-error">
        <h2>{error || t('carDetail.notFound')}</h2>
        <button type="button" className="btn-back-details" onClick={() => navigate('/cars')}>{t('carDetail.backToCars')}</button>
      </div>
    );
  }

  const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const images = car.images && car.images.length > 0 
    ? car.images.map(img => img.startsWith('http') ? img : `${API_URL}${img.startsWith('/') ? img : '/' + img}`)
    : ['https://via.placeholder.com/800x500?text=Car+Image'];

  const isAvailable = car.status === 'available';

  return (
    <div className="car-detail-container">
      <div className="car-detail-header">
        <button className="btn-back-details" onClick={() => navigate('/cars')}>
          &larr; {t('carDetail.backToCars')}
        </button>
      </div>

      <div className="car-detail-content">
        <div className="car-gallery">
          <div className="thumbnails">
            {images.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`${car.brand} thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            <img src={images[activeImage]} alt={`${car.brand} ${car.model}`} />
            <div className={`car-status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
              {t(`common.status.${car.status}`, { defaultValue: car.status })}
            </div>
          </div>
        </div>

        <div className="car-info">
          <div className="car-info-title">
            <h1>{car.brand} {car.model} <span className="car-year">{car.year}</span></h1>
            {averageRating && (
              <div className="avg-rating">
                <span className="star">★</span> {averageRating} <span className="count">{t('carDetail.reviewsCount', { count: reviews.length })}</span>
              </div>
            )}
          </div>
          
          <div className="price-tag">
            <span className="price">{t('common.dhPerDay', { price: car.dailyPrice })}</span>
            <span className="period">{t('common.perDay')}</span>
          </div>
          
          <p className="car-description">
            {car.description || t('carDetail.defaultDescription')}
          </p>

          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">{t('carDetail.transmission')}</span>
              <span className="spec-value">{car.transmission || t('booking.transmissionFallback')}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('carDetail.fuelType')}</span>
              <span className="spec-value">{car.fuelType || t('carCard.petrol')}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">{t('carDetail.seats')}</span>
              <span className="spec-value">{car.seats || 5}</span>
            </div>
          </div>

          <div className="booking-action">
            {car.status !== 'retired' ? (
              <Link to={`/book/${car._id}`} className="btn-book-now">
                {car.status === 'available' ? t('carDetail.bookThisCar') : t('carDetail.reserveFuture')}
              </Link>
            ) : (
              <button type="button" disabled className="btn-unavailable">
                {t('carDetail.retiredUnavailable')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="car-availability-section">
        <h2>{t('carDetail.availability')}</h2>
        <p>
          {t('carDetail.availabilityDesc')}{' '}
          <span className="booked-legend">{t('carDetail.bookedLegend')}</span> {t('carDetail.bookedLegendSuffix')}
        </p>
        <div className="calendar-wrapper">
          <Calendar
            tileClassName={tileClassName}
            tileDisabled={tileDisabled}
            minDate={new Date()}
          />
        </div>
      </div>

      <div id="reviews" className="car-reviews-section">
        <h2>{t('carDetail.customerReviews')}</h2>
        {reviewsLoading ? (
          <div className="admin-loading"><div className="spinner"></div></div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">{t('carDetail.noReviews')}</div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <ReviewCard 
                key={review._id} 
                review={review} 
                isAdmin={user?.role === 'admin' || user?.role === 'employee'}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetailPage;

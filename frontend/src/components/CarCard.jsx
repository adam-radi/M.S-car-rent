import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CarStyles.css';

const CarCard = ({ car }) => {
  const { _id, brand, model, year, dailyPrice, images, transmission, fuelType, seats, status } = car;
  
  const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  
  // Use first image or a placeholder
  const imageUrl = images && images.length > 0 
    ? (images[0].startsWith('http') ? images[0] : `${API_URL}${images[0].startsWith('/') ? images[0] : '/' + images[0]}`)
    : 'https://via.placeholder.com/400x250?text=Car+Image';

  const isAvailable = status === 'available';

  return (
    <div className="car-card">
      <div className="car-image-container">
        <img src={imageUrl} alt={`${brand} ${model}`} className="car-image" />
        <div className={`car-status ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
          {t(`common.status.${status}`, { defaultValue: status })}
        </div>
      </div>
      
      <div className="car-content">
        <div className="car-header">
          <h3>{brand} {model} <span className="car-year">{year}</span></h3>
          <div className="car-price">
            <span className="price-amount">${dailyPrice}</span>
            <span className="price-period">{t('common.perDay')}</span>
          </div>
        </div>
        
        <div className="car-features">
          <div className="feature"><i className="icon-transmission"></i> {transmission || t('carCard.auto')}</div>
          <div className="feature"><i className="icon-fuel"></i> {fuelType || t('carCard.petrol')}</div>
          <div className="feature"><i className="icon-seats"></i> {t('carCard.seats', { count: seats || 5 })}</div>
        </div>
        
        <div className="car-actions">
          <Link to={`/cars/${_id}`} className="btn-details">{t('common.viewDetails')}</Link>
          {isAvailable && (
            <Link to={`/book/${_id}`} className="btn-book">{t('common.bookNow')}</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;

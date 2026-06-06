import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/BookingSummary.css';

const BookingSummary = ({ car, startDate, endDate, notes, total, onConfirm, onBack }) => {
  const { t } = useTranslation();
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="booking-summary overlay">
      <div className="summary-card">
        <div className="summary-header">
          <h2>{t('booking.summaryTitle')}</h2>
          <p>{t('booking.summarySubtitle')}</p>
        </div>

        <div className="summary-details">
          <div className="summary-row">
            <span>{t('booking.vehicle')}</span>
            <strong>{car.brand} {car.model}</strong>
          </div>
          <div className="summary-row">
            <span>{t('booking.durationLabel')}</span>
            <strong>{t('booking.daysCount', { count: days })}</strong>
          </div>
          <div className="summary-row">
            <span>{t('booking.datesLabel')}</span>
            <strong>{new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</strong>
          </div>
          <div className="summary-row">
            <span>{t('booking.dailyRate')}</span>
            <strong>{car.dailyPrice} DH</strong>
          </div>
          <hr />
          <div className="summary-row total">
            <span>{t('booking.totalAmount')}</span>
            <strong>{total} DH</strong>
          </div>
        </div>

        {notes && (
          <div className="summary-notes">
            <label>{t('booking.additionalNotes')}</label>
            <p>{notes}</p>
          </div>
        )}

        <div className="summary-actions">
          <button type="button" className="btn-back-summary" onClick={onBack}>{t('booking.modify')}</button>
          <button type="button" className="btn-confirm" onClick={onConfirm}>{t('booking.confirmPay')}</button>
        </div>

        <p className="payment-hint">{t('booking.paymentHint')}</p>
      </div>
    </div>
  );
};

export default BookingSummary;

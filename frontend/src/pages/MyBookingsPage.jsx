import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../hooks/useAuth';
import { downloadInvoice } from '../api/bookingApi';
import ReviewModal from '../components/ReviewModal';
import '../styles/MyBookingsPage.css';
import '../styles/MyBookings_Loyalty.css';

const STATUS_COLORS = {
  pending:   { bg: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', border: '#fbbf24' },
  confirmed: { bg: 'rgba(52, 211, 153, 0.12)', color: '#34d399', border: '#34d399' },
  active:    { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa', border: '#60a5fa' },
  completed: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', border: '#94a3b8' },
  cancelled: { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171', border: '#f87171' },
  rejected:  { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171', border: '#f87171' },
};

const MyBookingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { bookings, loading, error, success, fetchUserBookings, cancelBooking } = useBookings();
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
  }, [isAuthenticated, navigate, fetchUserBookings]);

  const handleCancel = async (id) => {
    if (window.confirm(t('myBookings.cancelConfirm'))) {
      setCancellingId(id);
      await cancelBooking(id, 'Cancelled by customer');
      setCancellingId(null);
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const blob = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert(t('myBookings.invoiceFailed'));
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading && bookings.length === 0) {
    return (
      <div className="mybookings-loading">
        <div className="spinner"></div>
        <p>{t('myBookings.loading')}</p>
      </div>
    );
  }

  return (
    <div className="mybookings-container">
      <div className="mybookings-header">
        <h1>{t('myBookings.title')}</h1>
        <button type="button" className="btn-browse" onClick={() => navigate('/cars')}>
          {t('myBookings.browseCars')}
        </button>
      </div>

      {error && <div className="mybookings-alert error">{error}</div>}
      {success && <div className="mybookings-alert success">{success}</div>}

      {bookings.length === 0 ? (
        <div className="mybookings-empty">
          <div className="empty-icon">🚗</div>
          <h2>{t('myBookings.emptyTitle')}</h2>
          <p>{t('myBookings.emptyDesc')}</p>
          <button type="button" className="btn-explore" onClick={() => navigate('/cars')}>
            {t('myBookings.exploreCars')}
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const statusKey = booking.status || 'pending';
            const statusColors = STATUS_COLORS[statusKey] || STATUS_COLORS.pending;
            const carInfo = booking.car || {};
            const carImage =
              carInfo.images && carInfo.images.length > 0
                ? carInfo.images[0]
                : 'https://via.placeholder.com/140x90?text=Car';

            return (
              <div key={booking._id} className={`booking-card booking-card--${statusKey}`} style={{ borderLeft: `3px solid ${statusColors.border}` }}>
                <div className="booking-card-image">
                  <img src={carImage} alt={`${carInfo.brand || ''} ${carInfo.model || ''}`} />
                </div>

                <div className="booking-card-info">
                  <div className="booking-card-top">
                    <h3>
                      {carInfo.brand} {carInfo.model}{' '}
                      {carInfo.year && <span className="year">{carInfo.year}</span>}
                    </h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors.bg, color: statusColors.color }}
                    >
                      {t(`myBookings.status.${statusKey}`, { defaultValue: statusKey })}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-label">📅 {t('myBookings.startDate')}</span>
                      <span className="detail-value">{formatDate(booking.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🏁 {t('myBookings.endDate')}</span>
                      <span className="detail-value">{formatDate(booking.endDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏱ {t('myBookings.duration')}</span>
                      <span className="detail-value">{t('myBookings.day', { count: booking.totalDays })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📍 {t('myBookings.pickup')}</span>
                      <span className="detail-value">{booking.pickupLocation}</span>
                    </div>
                  </div>
                  <div className="booking-price">
                    <span className="price-label">{t('myBookings.totalAmount')}</span>
                    <div className="price-stack">
                      {booking.totalPrice > booking.finalPrice && (
                        <span className="old-price">${booking.totalPrice?.toFixed(2)}</span>
                      )}
                      <span className="price-value">${booking.finalPrice?.toFixed(2)}</span>
                    </div>
                    {(booking.personalDiscount > 0 || booking.manualDiscount > 0 || booking.discountApplied > 0) && (
                      <span className="discount-tag-small">
                        -{Math.round(((booking.totalPrice - booking.finalPrice) / booking.totalPrice) * 100)}% OFF 🏷️
                      </span>
                    )}
                  </div>
                </div>

                <div className="booking-card-actions">
                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      type="button"
                      className="btn-cancel-booking"
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? t('myBookings.cancelling') : t('myBookings.cancel')}
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <>
                      <button type="button" className="btn-rate" onClick={() => setSelectedBooking(booking)}>
                        {t('myBookings.rateExperience')}
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => handleDownloadInvoice(booking._id)}>
                        {t('myBookings.downloadInvoice')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            alert(t('myBookings.thankYouReview'));
            fetchUserBookings();
          }}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;

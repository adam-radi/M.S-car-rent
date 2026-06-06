import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addReview } from '../api/reviewApi';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await addReview({
        carId: booking.car._id,
        bookingId: booking._id,
        rating: Number(rating),
        comment,
      });
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || t('reviewModal.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content review-modal">
        <div className="modal-header">
          <h2>{t('reviewModal.title')}</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>
              {t('reviewModal.question', {
                brand: booking.car.brand,
                model: booking.car.model,
              })}
            </p>

            <div className="form-group">
              <label>{t('reviewModal.yourRating')}</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('reviewModal.shareThoughts')}</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('reviewModal.placeholder')}
                rows="4"
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn-save" disabled={submitting}>
              {submitting ? t('reviewModal.submitting') : t('reviewModal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

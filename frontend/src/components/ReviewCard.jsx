import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Testimonials.css';
import './ReviewCard.css';
import unconu from '../assets/unconu.png';

const ReviewCard = ({ review, isAdmin, onDelete }) => {
  const { t } = useTranslation();
  const { user, rating, comment, createdAt } = review;
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
    ));
  };

  return (
    <div className="testimonial-card review-page-card" id={`review-${review._id}`}>
      <div className="testimonial-user">
        <div className="testimonial-avatar">
          <img src={unconu} alt="user profile" />
        </div>
        <div className="testimonial-user-info">
          <h4 className="testimonial-name">{user?.firstName} {user?.lastName}</h4>
          <p className="testimonial-role">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="testimonial-stars">
        {renderStars(rating)}
      </div>
      <div className="testimonial-quote-icon">"</div>

      <p className="testimonial-comment">
        {comment}
      </p>
      {isAdmin && (
        <button type="button" className="btn-delete-review-icon" onClick={() => onDelete(review._id)} title={t('carDetail.deleteReview')} style={{position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer'}}>
          &times;
        </button>
      )}
    </div>
  );
};

export default ReviewCard;

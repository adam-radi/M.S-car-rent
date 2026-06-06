import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllReviews } from '../api/reviewApi';
import unconu from '../assets/unconu.png';
import '../styles/Testimonials.css';
// Mock data as fallback
const mockReviews = [
  { id: 1, name: "Mohammad", role: "Sales Director", initials: "SM", rating: 5, comment: "The booking experience was flawless! I picked up an Audi A6 for a weekend, and everything went smoothly." },
  { id: 2, name: "Salah", role: "Entrepreneur", initials: "MD", rating: 5, comment: "I've rented from many companies, but PrefectDrive is truly different. I got my dream Porsche Macan in 2 hours." },
  { id: 3, name: "Amina", role: "Event Organizer", initials: "EL", rating: 5, comment: "Perfect for our wedding day! We rented a magnificent Volkswagen R Line 8.5 and it made our special day even more memorable." }
];

const Testimonials = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const handleReviewClick = (review) => {
    if (review.carId) {
      navigate(`/cars/${review.carId}#review-${review.id}`);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews();
        if (response.success && response.data.length > 0) {
          // Format the backend data to match our component structure
          const formattedReviews = response.data.map(rev => ({
            id: rev._id,
            carId: rev.car?._id,
            name: `${rev.user.firstName} ${rev.user.lastName}`,
            role: t('testimonials.verifiedClient'),
            initials: `${rev.user.firstName.charAt(0)}${rev.user.lastName.charAt(0)}`,
            rating: rev.rating,
            comment: rev.comment
          }));
          setReviews(formattedReviews.slice(0, 3));
        } else {
          setReviews(mockReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(mockReviews);
      }
    };

    fetchReviews();
  }, [t]);

  const stats = [
    { label: "AVERAGE RATING", value: "4.9/5" },
    { label: "SATISFIED CLIENTS", value: "100+" },
    { label: "RECOMMEND US", value: "98%" }
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-grid-bg"></div>
      
      <div className="testimonials-container">
        <header className="testimonials-header">
          <span className="testimonials-badge">{t('testimonials.badge')}</span>
          <div className="header-main-row">
            <h2 className="testimonials-title">{t('testimonials.title')}</h2>
            <Link to="/reviews" className="btn-view-all-reviews">
              {t('testimonials.viewAll')}
            </Link>
          </div>
        </header>

        <div className="testimonials-cards">
          {reviews.map((review, idx) => (
            <div 
              key={review.id} 
              className={`testimonial-card ${idx === 1 && reviews.length === 3 ? 'featured' : ''}`}
              onClick={() => handleReviewClick(review)}
              style={{ cursor: review.carId ? 'pointer' : 'default' }}
            >
              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  <img src={unconu} alt="user profile" />
                </div>
                <div className="testimonial-user-info">
                  <h4 className="testimonial-name">{review.name}</h4>
                  <p className="testimonial-role">{review.role}</p>
                </div>
              </div>
              <div className="testimonial-stars">
                {renderStars(review.rating)}
              </div>
              <div className="testimonial-quote-icon">"</div>
              <p className="testimonial-comment">
                {review.comment.length > 100 
                  ? `${review.comment.substring(0, 100)}...` 
                  : review.comment}
              </p>
            </div>
          ))}
        </div>


        <div className="testimonials-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

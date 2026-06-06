import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllReviews } from '../api/reviewApi';
import unconu from '../assets/unconu.png';
import '../styles/Testimonials.css';
import '../styles/ReviewsPage.css';

const mockReviews = [
  { id: 1, name: 'Mohammad', role: 'Sales Director', rating: 5, comment: 'The booking experience was flawless! I picked up an Audi A6 for a weekend, and everything went smoothly.' },
  { id: 2, name: 'Salah', role: 'Entrepreneur', rating: 5, comment: "I've rented from many companies, but PrefectDrive is truly different. I got my dream Porsche Macan in 2 hours." },
  { id: 3, name: 'Amina', role: 'Event Organizer', rating: 5, comment: 'Perfect for our wedding day! We rented a magnificent Volkswagen R Line 8.5 and it made our special day even more memorable.' },
];

const renderStars = (rating) =>
  Array(5)
    .fill(0)
    .map((_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews();

        if (response.success && response.data.length > 0) {
          const formattedReviews = response.data.map((rev) => ({
            id: rev._id,
            carId: rev.car?._id,
            name: `${rev.user?.firstName || ''} ${rev.user?.lastName || ''}`.trim() || t('reviewsPage.anonymous'),
            role: rev.car ? `${rev.car.brand} ${rev.car.model}` : t('testimonials.verifiedClient'),
            rating: rev.rating,
            comment: rev.comment,
          }));

          setReviews(formattedReviews);
          return;
        }

        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [t]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : '0.0';
    const fiveStarRate = totalReviews
      ? `${Math.round((reviews.filter((review) => review.rating === 5).length / totalReviews) * 100)}%`
      : '0%';

    return [
      { label: t('reviewsPage.stats.rating'), value: `${averageRating}/5` },
      { label: t('reviewsPage.stats.total'), value: `${totalReviews}+` },
      { label: t('reviewsPage.stats.fiveStar'), value: fiveStarRate },
    ];
  }, [reviews, t]);

  const handleReviewClick = (review) => {
    if (review.carId) {
      navigate(`/cars/${review.carId}#review-${review.id}`);
    }
  };

  return (
    <section className="testimonials-section reviews-page-shell">
      <div className="testimonials-grid-bg"></div>

      <div className="testimonials-container reviews-page-container">
        <header className="testimonials-header reviews-page-header">
          <span className="testimonials-badge">{t('reviewsPage.badge')}</span>
          <div className="header-main-row reviews-page-title-row">
            <h1 className="testimonials-title">{t('reviewsPage.title')}</h1>
          </div>
          <p className="testimonials-subtitle reviews-page-subtitle">{t('reviewsPage.subtitle')}</p>
        </header>

        {loading ? (
          <div className="reviews-page-status">{t('reviewsPage.loading')}</div>
        ) : reviews.length === 0 ? (
          <div className="reviews-page-status">{t('reviewsPage.empty')}</div>
        ) : (
          <div className="testimonials-cards reviews-page-grid">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="testimonial-card reviews-page-card"
                onClick={() => handleReviewClick(review)}
                style={{ cursor: review.carId ? 'pointer' : 'default' }}
              >
                <div className="testimonial-user">
                  <div className="testimonial-avatar">
                    <img src={unconu} alt="" />
                  </div>
                  <div className="testimonial-user-info">
                    <h4 className="testimonial-name">{review.name}</h4>
                    <p className="testimonial-role">{review.role}</p>
                  </div>
                </div>

                <div className="testimonial-stars">{renderStars(review.rating)}</div>

                <div className="testimonial-quote-icon">"</div>
                <p className="testimonial-comment reviews-page-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="testimonials-stats reviews-page-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsPage;

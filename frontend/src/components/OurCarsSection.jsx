import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import { getCars } from '../api/carApi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import '../styles/OurCarsSection.css';

const OurCarsSection = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await getCars();
        if (response.success) {
          // Sort: featured first, then available, then newest
          const sortedCars = [...response.data].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            if (a.status === 'available' && b.status !== 'available') return -1;
            if (a.status !== 'available' && b.status === 'available') return 1;
            return 0;
          });
          setCars(sortedCars.slice(0, 8));
        } else {
          setError(t('ourCars.fetchError'));
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError(t('ourCars.genericError'));
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [t]);

  const handleCardClick = (id) => {
    navigate(`/cars/${id}`);
  };

  if (loading) {
    return (
      <section className="our-cars-section loading">
        <div className="section-loader">
          <div className="spinner"></div>
          <p>{t('common.loadingFleet')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="our-cars-section error">
        <div className="error-message">
          <h3>{t('common.oops')}</h3>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-retry">{t('common.retry')}</button>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="our-cars-section empty">
        <div className="empty-state">
          <h3>No Cars Available</h3>
          <p>We are currently updating our fleet. Please check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="our-cars-section">
      <div className="our-cars-header-container">
        <div className="our-cars-header-text">
          <h2 className="our-cars-title">{t('ourCars.title')}</h2>
          <p className="our-cars-subtitle">{t('ourCars.subtitle')}</p>
        </div>
        <Link to="/cars" className="btn-more-cars-header">
          <span>{t('common.showAll')}</span>
          <div className="btn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </Link>
      </div>

      <div className="our-cars-swiper-container">
        <Swiper
          modules={[Navigation, Grid]}
          spaceBetween={16}
          slidesPerView={1}
          grid={{ rows: 2, fill: 'row' }}
          navigation={{
            nextEl: '.ourcars-button-next',
            prevEl: '.ourcars-button-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          loop={false}
          className="our-cars-swiper"
        >
          {cars.map((car) => {
            const isAvailable = car.status === 'available';
            const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
            const mainImage = car.images && car.images.length > 0 
              ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}${car.images[0].startsWith('/') ? car.images[0] : '/' + car.images[0]}`)
              : 'https://via.placeholder.com/600x400?text=Premium+Car';

            return (
              <SwiperSlide key={car._id}>
                <div
                  className={`car-luxury-card ${!isAvailable ? 'unavailable' : ''}`}
                  onClick={() => handleCardClick(car._id)}
                >
                  <div className="card-image-bg" style={{ backgroundImage: `url(${mainImage})` }}>
                    <div className="card-overlay-cars">
                      {!isAvailable && (
                        <span className="unavailable-badge">
                          {t(`common.status.${car.status}`, { defaultValue: car.status })}
                        </span>
                      )}

                      <div className="card-bottom-content">
                        <div className="card-info">
                          <h3 className="car-name-display">{car.brand} {car.model}</h3>
                          <p className="car-price-display">{t('common.dhPerDay', { price: car.dailyPrice })}</p>
                        </div>

                        <Link
                          to={`/book/${car._id}`}
                          className="btn-book-luxury"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{isAvailable ? t('common.bookNow') : t('common.reserveLater')}</span>
                          <div className="btn-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="carousel-navigation-controls">
          <button className="ourcars-button-prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="ourcars-button-next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurCarsSection;

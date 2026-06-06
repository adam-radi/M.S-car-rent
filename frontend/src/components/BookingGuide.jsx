import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingGuide.css';
import mockupImg from '../assets/booking_mockup.png';

const BookingGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="booking-guide-wrapper">
      <div className="guide-content">
        <div className="guide-text">
          <h2 className="guide-title">
            {t('bookingGuide.title')} <span className="text-red">{t('bookingGuide.titleAccent')}</span>
          </h2>
          <p className="guide-intro">{t('bookingGuide.intro')}</p>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-num">01</div>
              <div className="step-info">
                <h3>{t('bookingGuide.step1Title')}</h3>
                <p>{t('bookingGuide.step1Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">02</div>
              <div className="step-info">
                <h3>{t('bookingGuide.step2Title')}</h3>
                <p>{t('bookingGuide.step2Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">03</div>
              <div className="step-info">
                <h3>{t('bookingGuide.step3Title')}</h3>
                <p>{t('bookingGuide.step3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-items">
              <div className="legend-item"><span className="dot dot-unavailable"></span><span>{t('bookingGuide.busy')}</span></div>
              <div className="legend-item"><span className="dot dot-selected"></span><span>{t('bookingGuide.selected')}</span></div>
            </div>
          </div>

          <div className="guide-summary">
            <Link to="/cars" className="guide-cta-link">{t('bookingGuide.cta')}</Link>
          </div>
        </div>

        <div className="guide-visual">
          <div className="mockup-container">
            <img src={mockupImg} alt="" className="mockup-image" />
            <div className="mockup-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingGuide;

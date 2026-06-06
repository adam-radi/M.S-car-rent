import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingGuide.css';
import statusImg from '../assets/status_mockup.png';

const StatusManagementGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="booking-guide-wrapper">
      <div className="guide-content">
        <div className="guide-text">
          <h2 className="guide-title">
            {t('statusGuide.title')} <span className="text-red">{t('statusGuide.titleAccent')}</span>
          </h2>
          <p className="guide-intro">{t('statusGuide.intro')}</p>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-num">01</div>
              <div className="step-info">
                <h3>{t('statusGuide.step1Title')}</h3>
                <p>{t('statusGuide.step1Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">02</div>
              <div className="step-info">
                <h3>{t('statusGuide.step2Title')}</h3>
                <p>{t('statusGuide.step2Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num">03</div>
              <div className="step-info">
                <h3>{t('statusGuide.step3Title')}</h3>
                <p>{t('statusGuide.step3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-items">
              <div className="legend-item"><span className="dot" style={{ background: '#666' }}></span> <span>{t('statusGuide.pending')}</span></div>
              <div className="legend-item"><span className="dot" style={{ background: '#ff385c' }}></span> <span>{t('statusGuide.confirmed')}</span></div>
              <div className="legend-item"><span className="dot" style={{ background: '#fff' }}></span> <span>{t('statusGuide.onRoad')}</span></div>
            </div>
          </div>

          <div className="guide-summary">
            <Link to="/my-bookings" className="guide-cta-link">{t('statusGuide.cta')}</Link>
          </div>
        </div>

        <div className="guide-visual">
          <div className="mockup-container">
            <img src={statusImg} alt="" className="mockup-image" />
            <div className="mockup-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusManagementGuide;

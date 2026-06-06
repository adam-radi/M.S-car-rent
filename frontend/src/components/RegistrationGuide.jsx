import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BookingGuide.css';
import registerImg from '../assets/register_mockup.png';

const RegistrationGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="booking-guide-wrapper">
      <div className="guide-content">
        <div className="guide-text">
          <h2 className="guide-title">
            {t('registrationGuide.title')} <span className="text-red">{t('registrationGuide.titleAccent')}</span>
          </h2>
          <p className="guide-intro">{t('registrationGuide.intro')}</p>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-num" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>✓</div>
              <div className="step-info">
                <h3>{t('registrationGuide.benefit1Title')}</h3>
                <p>{t('registrationGuide.benefit1Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>✓</div>
              <div className="step-info">
                <h3>{t('registrationGuide.benefit2Title')}</h3>
                <p>{t('registrationGuide.benefit2Desc')}</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-num" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>✓</div>
              <div className="step-info">
                <h3>{t('registrationGuide.benefit3Title')}</h3>
                <p>{t('registrationGuide.benefit3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="guide-summary" style={{ borderLeftColor: '#fff', background: 'rgba(255,255,255,0.05)' }}>
            <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{t('registrationGuide.readyJourney')}</p>
            <div style={{ marginTop: '15px' }}>
              <Link
                to="/register"
                className="guide-cta-link"
                style={{ background: '#fff', color: '#000', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }}
              >
                {t('registrationGuide.cta')}
              </Link>
            </div>
          </div>
        </div>

        <div className="guide-visual">
          <div className="mockup-container">
            <img src={registerImg} alt="" className="mockup-image" />
            <div className="mockup-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationGuide;

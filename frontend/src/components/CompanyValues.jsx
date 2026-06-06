import React from 'react';
import { useTranslation } from 'react-i18next';
import './BookingGuide.css';
import excellenceImg from '../assets/feature_locations.png';

const CompanyValues = () => {
  const { t } = useTranslation();

  const values = [
    { titleKey: 'value1Title', descKey: 'value1Desc' },
    { titleKey: 'value2Title', descKey: 'value2Desc' },
    { titleKey: 'value3Title', descKey: 'value3Desc' },
  ];

  return (
    <div className="booking-guide-wrapper">
      <div className="guide-content">
        <div className="guide-text">
          <h2 className="guide-title">
            {t('companyValues.title')}
            {t('companyValues.titleAccent') ? (
              <> <span className="text-red">{t('companyValues.titleAccent')}</span></>
            ) : null}
          </h2>
          <p className="guide-intro">{t('companyValues.intro')}</p>

          <div className="guide-steps">
            {values.map((v, i) => (
              <div className="guide-step" key={i}>
                <div className="step-num" style={{ borderRadius: '8px' }}>
                  <div style={{ width: '24px', height: '24px' }}>✓</div>
                </div>
                <div className="step-info">
                  <h3>{t(`companyValues.${v.titleKey}`)}</h3>
                  <p>{t(`companyValues.${v.descKey}`)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="guide-summary">
            <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>{t('companyValues.whyTitle')}</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>{t('companyValues.whyDesc')}</p>
          </div>
        </div>

        <div className="guide-visual">
          <div className="mockup-container">
            <img src={excellenceImg} alt="" className="mockup-image" style={{ padding: '40px' }} />
            <div className="mockup-overlay" style={{ background: 'linear-gradient(45deg, rgba(255, 56, 92, 0.15) 0%, transparent 100%)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyValues;

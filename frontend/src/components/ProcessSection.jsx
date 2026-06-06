import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCar, FaShieldAlt, FaHeadset, FaRegComments, FaHands } from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';
import './ProcessSection.css';

const ProcessSection = ({ isEmbedded = false }) => {
  const { t } = useTranslation();

  return (
    <section className={`process-section ${isEmbedded ? 'embedded' : ''}`}>
      <div className="process-container">
        {!isEmbedded && <h2 className="process-title">{t('process.title')}</h2>}

        <div className="process-steps">
          <div className="process-step">
            <div className="icon-wrapper">
              <div className="icon-box">
                <FaCar className="main-icon" />
                <FaShieldAlt className="sub-icon" />
              </div>
            </div>
            <div className="step-content">
              <h3>{t('process.step1Title')}</h3>
              <p>{t('process.step1Desc')}</p>
            </div>
          </div>

          <div className="process-arrow arrow-1">
            <svg viewBox="0 0 100 80" preserveAspectRatio="none">
              <path d="M5,70 Q50,10 95,70" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M90,65 L95,70 L90,75" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="process-step">
            <div className="icon-wrapper">
              <div className="icon-box">
                <FaHeadset className="main-icon" />
                <FaRegComments className="sub-icon-alt" />
              </div>
            </div>
            <div className="step-content">
              <h3>{t('process.step2Title')}</h3>
              <p>{t('process.step2Desc')}</p>
            </div>
          </div>

          <div className="process-arrow arrow-2">
            <svg viewBox="0 0 100 80" preserveAspectRatio="none">
              <path d="M5,10 Q50,70 95,10" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M90,5 L95,10 L90,15" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="process-step">
            <div className="icon-wrapper">
              <div className="icon-box">
                <GiSteeringWheel className="main-icon large" />
                <FaHands className="sub-icon-driving" />
              </div>
            </div>
            <div className="step-content">
              <h3>{t('process.step3Title')}</h3>
              <p>{t('process.step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

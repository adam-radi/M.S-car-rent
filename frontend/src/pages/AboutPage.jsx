import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/AboutPage.css';
import { FaShieldAlt, FaTags, FaCar, FaCalendarCheck, FaSearch, FaUserPlus, FaKey, FaSmile } from 'react-icons/fa';
import ProcessSection from '../components/ProcessSection';
import BookingGuide from '../components/BookingGuide';
import StatusManagementGuide from '../components/StatusManagementGuide';

const AboutPage = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = useMemo(
    () => [
      { id: 0, titleKey: 'account', descKey: 'account', icon: <FaUserPlus />, pos: { top: '10%', left: '10%' } },
      { id: 1, titleKey: 'explore', descKey: 'explore', icon: <FaSearch />, pos: { top: '30%', left: '60%' } },
      { id: 2, titleKey: 'booking', descKey: 'booking', icon: <FaCalendarCheck />, pos: { top: '70%', left: '20%' } },
      { id: 3, titleKey: 'drive', descKey: 'drive', icon: <FaKey />, pos: { top: '80%', left: '70%' } },
    ],
    []
  );

  const whyCards = useMemo(
    () => [
      { icon: <FaShieldAlt />, feature: 'trusted' },
      { icon: <FaCar />, feature: 'quality' },
      { icon: <FaTags />, feature: 'pricing' },
      { icon: <FaSmile />, feature: 'satisfaction' },
    ],
    []
  );

  const services = useMemo(() => ['service1', 'service2', 'service3'], []);

  return (
    <div className="abp-container">
      <section className="abp-hero">
        <div className="abp-hero-content">
          <h1 className="abp-hero-title">{t('aboutPage.heroTitle')}</h1>
          <p className="abp-hero-subtitle">{t('aboutPage.heroSubtitle')}</p>
        </div>
      </section>

      <section className="abp-section">
        <div className="abp-section-header">
          <span className="abp-section-tag">{t('aboutPage.tagReliability')}</span>
          <h2 className="abp-section-title">{t('aboutPage.whyTitle')}</h2>
        </div>
        <div className="abp-why-grid">
          {whyCards.map((card) => (
            <div key={card.feature} className="abp-why-card">
              <div className="abp-card-icon">{card.icon}</div>
              <h3 className="abp-card-title">{t(`home.features.${card.feature}.title`)}</h3>
              <p className="abp-card-text">{t(`home.features.${card.feature}.description`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="abp-section">
        <div className="abp-section-header">
          <span className="abp-section-tag">{t('aboutPage.tagGuide')}</span>
          <h2 className="abp-section-title">{t('aboutPage.masterTitle')}</h2>
          <p style={{ color: '#888', marginTop: '10px' }}>{t('aboutPage.masterHint')}</p>
        </div>

        <div className="abp-process-map">
          <div className="abp-process-map-grid">
            <div className="abp-map-visual">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`abp-map-node ${activeStep === step.id ? 'active' : ''}`}
                  style={{ top: step.pos.top, left: step.pos.left }}
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <i>{step.icon}</i>
                  <span>{t('aboutPage.stepLabel', { num: String(step.id + 1).padStart(2, '0') })}</span>
                </div>
              ))}
            </div>

            <div className="abp-map-content">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`abp-map-step-card ${activeStep === step.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <h4>{t(`aboutPage.steps.${step.titleKey}.title`)}</h4>
                  <p>{t(`aboutPage.steps.${step.descKey}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="abp-section">
        <div className="abp-section-header">
          <span className="abp-section-tag">{t('aboutPage.tagExcellence')}</span>
          <h2 className="abp-section-title">{t('aboutPage.servicesTitle')}</h2>
        </div>
        <div className="abp-services-list">
          {services.map((key, index) => (
            <div key={key} className="abp-service-item">
              <div className="abp-service-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="abp-service-content">
                <h3>{t(`aboutPage.${key}.title`)}</h3>
                <p>{t(`aboutPage.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProcessSection />

      <section className="abp-section" style={{ background: 'rgba(255,255,255,0.02)', padding: '60px 0' }}>
        <div className="abp-container">
          <div className="abp-section-header" style={{ marginBottom: '40px' }}>
            <span className="abp-section-tag">{t('aboutPage.tagQuickStart')}</span>
            <h2 className="abp-section-title">{t('aboutPage.readyToBook')}</h2>
          </div>
          <BookingGuide />
        </div>
      </section>

      <section className="abp-section" style={{ background: 'rgba(255,255,255,0.01)', padding: '60px 0' }}>
        <div className="abp-container">
          <div className="abp-section-header" style={{ marginBottom: '40px' }}>
            <span className="abp-section-tag">{t('aboutPage.tagManagement')}</span>
            <h2 className="abp-section-title">{t('aboutPage.modifyCancel')}</h2>
          </div>
          <StatusManagementGuide />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

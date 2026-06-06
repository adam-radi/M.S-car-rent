import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { submitContactMessage } from '../api/contactApi';
import contactCar from '../assets/contact_car.png';
import recentFleet from '../assets/recent_fleet.png';
import '../styles/ContactSection.css';

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.09 1.508 5.814L.057 23.999l6.335-1.652A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.213-3.72.97.993-3.623-.235-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const IconBrand = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15.5c1.5-3.4 4.4-5.1 8-5.1 3.5 0 6.4 1.7 8 5.1" />
    <path d="M6.2 15.4l1.5-4.3a2 2 0 0 1 1.9-1.3h4.8a2 2 0 0 1 1.9 1.3l1.5 4.3" />
    <circle cx="8" cy="16.7" r="1.2" />
    <circle cx="16" cy="16.7" r="1.2" />
  </svg>
);

const ContactSection = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.message) {
      try {
        const data = await submitContactMessage(formData);

        if (data.success) {
          setSubmitted(true);
          setFormData({ name: '', email: '', phone: '', message: '' });
          setTimeout(() => setSubmitted(false), 4000);
        } else {
          alert(t('contact.sendFailed', { message: data.message }));
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
        alert(t('contact.sendError'));
      }
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-bg-overlay" />

      <div className="contact-container">
        <div className="contact-main-card">
          <div className="contact-left-form">
            <div className="contact-form-brand">
              <span className="brand-mark">
                <IconBrand />
              </span>
              <span className="brand-name">{t('contact.brand')}</span>
            </div>

            <h3 className="contact-form-heading">{t('contact.heading')}</h3>
            <p className="contact-form-desc">{t('contact.desc')}</p>

            {submitted ? (
              <div className="contact-success-minimal">
                <div className="success-check">✓</div>
                <h3>{t('contact.successTitle')}</h3>
                <p>{t('contact.successDesc')}</p>
              </div>
            ) : (
              <form className="contact-minimal-form" onSubmit={handleSubmit}>
                <div className="minimal-field">
                  <label htmlFor="contact-name">{t('contact.fullName')}</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder={t('contact.namePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="minimal-field">
                  <label htmlFor="contact-email">{t('contact.email')}</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="minimal-field">
                  <label htmlFor="contact-phone">{t('contact.phone')}</label>
                  <input
                    id="contact-phone"
                    type="text"
                    name="phone"
                    placeholder={t('contact.phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="minimal-field">
                  <label htmlFor="contact-message">{t('contact.message')}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="minimal-submit-btn">
                    <IconSend />
                    <span>{t('contact.sendRequest')}</span>
                  </button>

                  <a
                    href="https://wa.me/212676404416"
                    target="_blank"
                    rel="noreferrer"
                    className="minimal-whatsapp-link"
                  >
                    <IconWhatsApp />
                    <span>{t('contact.whatsapp')}</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          <div className="contact-right-image">
            <div className="image-wrapper">
              <img src={contactCar} alt="M.S Car Rental fleet" className="main-contact-img" />

              <div className="image-overlay-card">
                <div className="overlay-thumb">
                  <img src={recentFleet} alt="Recent fleet" />
                </div>

                <div className="overlay-info">
                  <p>{t('contact.recentFleet')}</p>
                  <div className="overlay-icon">
                    <IconArrowRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

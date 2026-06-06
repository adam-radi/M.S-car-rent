import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from 'react-icons/fa';
import '../styles/Footer.css';
import logo from '../assets/logo_transparent.png';

const Footer = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleContactClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-newsletter-band">
        <div className="newsletter-band-inner">
          <div className="newsletter-logo-col">
            <div className="footer-logo-wrap" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <span className="footer-logo-icon"><img src={logo} width={70} alt="M.S Car Logo" /></span>
              <span className="footer-logo-text">
                M.S<span className="footer-logo-accent"> Car</span>
              </span>
            </div>
          </div>

          <div className="newsletter-divider-v" />

          <div className="newsletter-content-col">
            <div className="newsletter-left">
              <div className="newsletter-label-bar" />
              <div>
                <p className="newsletter-heading">{t('footer.newsletter')}</p>
                <p className="newsletter-sub">{t('footer.newsletterSub')}</p>
              </div>
            </div>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                {subscribed ? t('footer.subscribed') : t('footer.subscribeBtn')}
              </button>
            </form>
          </div>

          <div className="newsletter-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
              <polyline points="18 20 12 14 6 20" />
            </svg>
          </div>
        </div>
      </div>

      <div className="footer-main-body">
        <div className="footer-col footer-col-info">
          <p className="footer-col-title-plain">{t('footer.contactInfo')}</p>

          <div className="footer-info-item">
            <FaMapMarkerAlt className="footer-info-icon" />
            <a
              href="https://maps.app.goo.gl/Ck4vwmakGXd5VaST9"
              target="_blank"
              rel="noreferrer"
              className="footer-info-text footer-address-link"
            >
              {t('footer.address')}
            </a>
          </div>

          <div className="footer-info-item">
            <FaPhoneAlt className="footer-info-icon" />
            <a href="tel:0676404416" className="footer-phone-link">0676404416</a>
          </div>

          <div className="footer-info-item">
            <FaEnvelope className="footer-info-icon" />
            <a href="mailto:radi.adam.2006@gmail.com" className="footer-phone-link">radi.adam.2006@gmail.com</a>
          </div>
        </div>

        <div className="footer-col">
          <p className="footer-col-title-plain">{t('footer.pages')}</p>
          <ul className="footer-link-list">
            <li><Link to="/cars">{t('navbar.cars')}</Link></li>
            <li><Link to="/about">{t('navbar.about')}</Link></li>
            <li><Link to="/#contact" onClick={handleContactClick}>{t('navbar.contact')}</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/my-bookings">{t('navbar.myBookings')}</Link></li>
                <li><Link to="/profile">{t('navbar.profile')}</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">{t('navbar.login')}</Link></li>
                <li><Link to="/register">{t('navbar.register')}</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-col-title-plain">{t('footer.support')}</p>
          <ul className="footer-link-list">
            <li><Link to="/cars">{t('footer.bookCar')}</Link></li>
            <li><Link to="/#contact" onClick={handleContactClick}>{t('footer.helpCenter')}</Link></li>
            <li><Link to="/about">{t('footer.whyUs')}</Link></li>
            <li><Link to="/cars">{t('footer.ourRates')}</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-col-socials">
          <p className="footer-col-title-plain">{t('footer.followUs')}</p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="https://wa.me/212676404416" target="_blank" rel="noreferrer" className="social-btn" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>

          <div className="footer-realisation">
            <span className="realisation-label">{t('footer.developedBy')}</span>
            <span className="realisation-name">{t('footer.radiTeam')}</span>
          </div>
        </div>
      </div>

      <div className="footer-stats-bar">
        <div className="footer-stat">
          <span className="stat-num">50<span className="stat-plus">+</span></span>
          <span className="stat-label">{t('footer.vehicles')}</span>
        </div>
        <div className="footer-stat-divider" />
        <div className="footer-stat">
          <span className="stat-num">1K<span className="stat-plus">+</span></span>
          <span className="stat-label">{t('footer.happyClients')}</span>
        </div>
        <div className="footer-stat-divider" />
        <div className="footer-stat">
          <span className="stat-num">24<span className="stat-plus">/7</span></span>
          <span className="stat-label">{t('footer.support247')}</span>
        </div>
        <div className="footer-stat-divider" />
        <div className="footer-stat">
          <span className="stat-num">5<span className="stat-plus">★</span></span>
          <span className="stat-label">{t('footer.avgRating')}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
        <div className="footer-bottom-right">
          <span className="footer-location-tag">{t('footer.locationTag')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

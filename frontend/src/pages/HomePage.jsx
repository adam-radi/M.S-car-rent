import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandCarousel from '../components/BrandCarousel';
import ContactSection from '../components/ContactSection';
import featureSupport from '../assets/feature_support.png';
import AboutUs from '../components/AboutUs';
import Testimonials from '../components/Testimonials';
import OurCarsSection from '../components/OurCarsSection';
import { getCarFilters } from '../api/carApi';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import CarsCarousel from '../components/CarsCarousel';
import { FaShieldAlt, FaCar, FaTags, FaSmile } from 'react-icons/fa';
import recentFleet from '../assets/recent_fleet.png';
import bookingMockup from '../assets/booking_mockup.png';
import contactCar from '../assets/contact_car.png';
import { useFilterLabels } from '../hooks/useFilterLabels';

const HomePage = () => {
  const { t } = useTranslation();
  const {
    pricingLabel,
    formatTransmissionLabel,
    displayMake,
    displayModel,
    pricingOptions,
    ANY_MAKE,
    ANY_MODEL,
    ANY_TRANSMISSION,
    PRICING_ALL,
    PRICING_UNDER,
    PRICING_RANGE,
    PRICING_OVER,
  } = useFilterLabels();
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({ brands: [], models: [], transmissions: [], fuelTypes: [] });
  const [filters, setFilters] = useState({
    make: ANY_MAKE,
    model: ANY_MODEL,
    transmission: ANY_TRANSMISSION,
    pricing: PRICING_ALL
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const detailRef = useRef(null);
  const searchPillRef = useRef(null);
  const navigate = useNavigate();

  const features = useMemo(
    () => [
      {
        id: 'trusted',
        title: t('home.features.trusted.title'),
        description: t('home.features.trusted.description'),
        icon: <FaShieldAlt />,
        className: 'fleet',
        image: featureSupport
      },
      {
        id: 'quality',
        title: t('home.features.quality.title'),
        description: t('home.features.quality.description'),
        icon: <FaCar />,
        className: 'support',
        image: recentFleet
      },
      {
        id: 'pricing',
        title: t('home.features.pricing.title'),
        description: t('home.features.pricing.description'),
        icon: <FaTags />,
        className: 'booking',
        image: bookingMockup
      },
      {
        id: 'satisfaction',
        title: t('home.features.satisfaction.title'),
        description: t('home.features.satisfaction.description'),
        icon: <FaSmile />,
        className: 'locations',
        image: contactCar
      }
    ],
    [t]
  );

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await getCarFilters();
        if (response.success) {
          setAvailableFilters(response.data);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchPillRef.current && !searchPillRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (field) => {
    setActiveDropdown((prev) => (prev === field ? null : field));
  };

  const normalizeString = (v) => (typeof v === 'string' ? v.toLowerCase() : v);

  const handleSelectFilter = (field, value) => {
    setFilters((prev) => {
      const nextFilters = { ...prev, [field]: value };

      // If user changes make, reset model
      if (field === 'make' && normalizeString(prev.make) !== normalizeString(value)) {
        nextFilters.model = ANY_MODEL;
      }

      return nextFilters;
    });
    setActiveDropdown(null);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (endDate && value && value >= endDate) {
      setEndDate('');
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (filters.make !== ANY_MAKE) queryParams.append('brand', filters.make);
    if (filters.model !== ANY_MODEL) queryParams.append('model', filters.model);
    if (filters.transmission !== ANY_TRANSMISSION) queryParams.append('transmission', filters.transmission);

    if (filters.pricing === PRICING_UNDER) queryParams.append('dailyPrice[lte]', 300);
    if (filters.pricing === PRICING_RANGE) {
      queryParams.append('dailyPrice[gte]', 300);
      queryParams.append('dailyPrice[lte]', 600);
    }
    if (filters.pricing === PRICING_OVER) queryParams.append('dailyPrice[gte]', 600);

    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);

    navigate(`/cars?${queryParams.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        setActiveFeature(null);
      }
    };
    if (activeFeature !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFeature]);

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>

          <div className="search-pill-container">
            <div className={`search-pill-shell ${isSearchOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="search-pill-toggle"
                onClick={() => setIsSearchOpen((prev) => !prev)}
              >
                <span>{isSearchOpen ? 'Close' : t('filters.search')}</span>
                <span className="search-pill-toggle-icon">{isSearchOpen ? '-' : '+'}</span>
              </button>

              <div className="search-pill" ref={searchPillRef}>
                <div className="search-pill-panel">
              <div className="search-field" onClick={() => toggleDropdown('make')}>
                <div className="field-main">
                  <span className="field-label">{t('filters.make')}</span>
                  <div className="custom-select-trigger">
                    <span>{displayMake(filters.make)}</span>
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <div
                    className={`custom-dropdown-box ${activeDropdown === 'make' ? 'show' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`dropdown-item ${normalizeString(filters.make) === normalizeString(ANY_MAKE) ? 'active' : ''}`}
                      onClick={() => handleSelectFilter('make', ANY_MAKE)}
                    >
                      {t('filters.anyMakes')}
                    </div>
                    {availableFilters.brands.map((brand) => (
                      <div
                        key={brand}
                        className={`dropdown-item ${normalizeString(filters.make) === normalizeString(brand) ? 'active' : ''}`}
                        onClick={() => handleSelectFilter('make', brand)}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field" onClick={() => toggleDropdown('model')}>
                <div className="field-main">
                  <span className="field-label">{t('filters.model')}</span>
                  <div className="custom-select-trigger">
                    <span>{displayModel(filters.model)}</span>                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <div
                    className={`custom-dropdown-box ${activeDropdown === 'model' ? 'show' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`dropdown-item ${normalizeString(filters.model) === normalizeString(ANY_MODEL) ? 'active' : ''}`}
                      onClick={() => handleSelectFilter('model', ANY_MODEL)}
                    >
                      {t('filters.anyModels')}
                    </div>
                    {availableFilters.models.map((model) => (
                      <div
                        key={model}
                        className={`dropdown-item ${normalizeString(filters.model) === normalizeString(model) ? 'active' : ''}`}
                        onClick={() => handleSelectFilter('model', model)}
                      >
                        {model}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            
              <div className="search-divider"></div>

              <div className="search-field" onClick={() => toggleDropdown('transmission')}>
                <div className="field-main">
                  <span className="field-label">{t('filters.transmission')}</span>
                  <div className="custom-select-trigger">
                    <span>{formatTransmissionLabel(filters.transmission)}</span>
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <div
                    className={`custom-dropdown-box ${activeDropdown === 'transmission' ? 'show' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`dropdown-item ${normalizeString(filters.transmission) === normalizeString(ANY_TRANSMISSION) ? 'active' : ''}`}
                      onClick={() => handleSelectFilter('transmission', ANY_TRANSMISSION)}
                    >
                      {t('filters.anyTransmission')}
                    </div>
                    {availableFilters.transmissions.map((trans) => (
                      <div
                        key={trans}
                        className={`dropdown-item ${normalizeString(filters.transmission) === normalizeString(trans) ? 'active' : ''}`}
                        onClick={() => handleSelectFilter('transmission', trans)}
                      >
                        {formatTransmissionLabel(trans)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field" onClick={() => toggleDropdown('pricing')}>
                <div className="field-main">
                  <span className="field-label">{t('filters.pricing')}</span>
                  <div className="custom-select-trigger">
                    <span>{pricingLabel(filters.pricing)}</span>
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <div
                    className={`custom-dropdown-box ${activeDropdown === 'pricing' ? 'show' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {pricingOptions.map((item) => (
                      <div
                        key={item}
                        className={`dropdown-item ${filters.pricing === item ? 'active' : ''}`}
                        onClick={() => handleSelectFilter('pricing', item)}
                      >
                        {pricingLabel(item)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field search-field-date">
                <div className="field-main">
                  <span className="field-label">{t('filters.checkIn')}</span>
                  <div className="custom-select-trigger date-trigger-wrapper">
                    <input
                      type="date"
                      className="date-input-pill"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field search-field-date">
                <div className="field-main">
                  <span className="field-label">{t('filters.checkOut')}</span>
                  <div className="custom-select-trigger date-trigger-wrapper">
                    <input
                      type="date"
                      className="date-input-pill"
                      value={endDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <div className="field-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-search" onClick={handleSearch}>{t('filters.search')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bottom-content">
          <div className="hero-caption-wrapper">
            <Link to="/cars" className="btn-bottom-booking">{t('hero.bookingNow')}</Link>
          </div>

          <a
            href="https://maps.app.goo.gl/Ck4vwmakGXd5VaST9"
            target="_blank"
            rel="noreferrer"
            className="hero-location-card"
          >
            <div className="location-top">
              <div className="location-icon-box">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
              </div>
              <span className="location-link">{t('hero.viewOnMap')}</span>
            </div>
            <div className="location-details">
              <p>{t('hero.address')}</p>
            </div>
          </a>
        </div>
      </section>
      <div>
        <BrandCarousel />
      </div>

      <OurCarsSection />
      <div className="experience-wrap">
        <section className="features-bento">
          <div className="features-header">
            <h2 className="section-title">
              {t('home.whyTitle')} <span className="text-red">{t('home.whyBrand')}</span>?
            </h2>
            <p className="section-subtitle">{t('home.whySubtitle')}</p>
          </div>

          <div className="bento-grid">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                className={`bento-card ${idx < 2 ? 'card-vertical' : 'card-horizontal'} ${feature.className} ${activeFeature === idx ? 'active' : ''}`}
                onClick={() => setActiveFeature(activeFeature === idx ? null : idx)}
              >
                <img src={feature.image} alt={feature.title} />
                <div className="card-overlay">
                  <span className="card-label">{feature.title}</span>
                  <div className="card-click-hint">{t('home.clickForDetails')}</div>
                </div>
              </div>
            ))}
          </div>

          {activeFeature !== null && (
            <div className="feature-detail-modal-root">
              <div className="feature-detail-blur-bg" onClick={() => setActiveFeature(null)}></div>
              <div className="feature-detail-centered-card" ref={detailRef}>
                <button type="button" className="close-detail-btn" onClick={() => setActiveFeature(null)}>&times;</button>
                <div className="detail-card-content">
                  <div className="detail-header-group">
                    <span className="detail-icon-box">{features[activeFeature].icon}</span>
                    <div className="detail-title-group">
                      <h3>{features[activeFeature].title}</h3>
                      <div className="detail-line-accent"></div>
                    </div>
                  </div>
                  <p className="detail-text-long">{features[activeFeature].description}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <AboutUs />

      <CarsCarousel />
      <Testimonials />

      <ContactSection />
    </div>
  );
};

export default HomePage;

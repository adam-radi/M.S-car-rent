import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCars, getCarFilters, getCarAvailability } from '../api/carApi';
import { useFilterLabels } from '../hooks/useFilterLabels';
import {
  ANY_MAKE,
  ANY_MODEL,
  ANY_TRANSMISSION,
  PRICING_ALL,
  PRICING_UNDER,
  PRICING_RANGE,
  PRICING_OVER,
  ALL_CARS,
  pricingKeyFromUrl,
  appendPricingToParams,
} from '../i18n/filterKeys';
import '../styles/HomePage.css';
import '../styles/OurCarsSection.css';
import '../styles/CarsPage.css';

const CarsPage = () => {
  const { t } = useTranslation();
  const {
    pricingLabel,
    formatTransmissionLabel,
    displayMake,
    displayModel,
    pricingOptions,
  } = useFilterLabels();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({ brands: [], models: [], transmissions: [], fuelTypes: [] });

  // Initialise filters from URL params
  const initialBrand = searchParams.get('brand') || ANY_MAKE;
  const initialModel = searchParams.get('model') || ANY_MODEL;
  const initialTransmission = (searchParams.get('transmission') || '').toLowerCase() || ANY_TRANSMISSION;
  const initialStartDate = searchParams.get('start_date') || '';
  const initialEndDate   = searchParams.get('end_date')   || '';

  const [filters, setFilters] = useState({
    make: initialBrand,
    model: initialModel,
    transmission: initialTransmission,
    pricing: pricingKeyFromUrl(searchParams),
    availability: ALL_CARS
  });

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate,   setEndDate]   = useState(initialEndDate);

  // Track whether the current result set came from the availability endpoint
  const [dateFiltered, setDateFiltered] = useState(!!(initialStartDate && initialEndDate));

  const searchPillRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  // Fetch available car-filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await getCarFilters();
        if (response.success) setAvailableFilters(response.data);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  // Build common params (brand / model / transmission / pricing)
  const buildBaseParams = useCallback(() => {
    const params = {};
    if (filters.make !== ANY_MAKE) params['brand'] = filters.make;
    if (filters.model !== ANY_MODEL) params.model = filters.model;
    if (filters.transmission !== ANY_TRANSMISSION) params.transmission = filters.transmission.toLowerCase();
    if (filters.pricing === PRICING_UNDER) params['dailyPrice[lte]'] = 300;
    if (filters.pricing === PRICING_RANGE) {
      params['dailyPrice[gte]'] = 300;
      params['dailyPrice[lte]'] = 600;
    }
    if (filters.pricing === PRICING_OVER) params['dailyPrice[gte]'] = 600;
    return params;
  }, [filters]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildBaseParams();

      if (startDate && endDate) {
        // Use availability endpoint
        params.start_date = startDate;
        params.end_date   = endDate;
        const res = await getCarAvailability(params);
        if (res.success) {
          setCars(res.data);
          setDateFiltered(true);
        }
      } else {
        // Use normal endpoint
        const res = await getCars(params);
        if (res.success) {
          // Sort: status=available first, others lower
          const sorted = [...res.data].sort((a, b) => {
            if (a.status === 'available' && b.status !== 'available') return -1;
            if (a.status !== 'available' && b.status === 'available') return 1;
            return 0;
          });
          setCars(sorted);
          setDateFiltered(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, buildBaseParams]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchPillRef.current && !searchPillRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.make !== ANY_MAKE) params.set('brand', filters.make);
    if (filters.model !== ANY_MODEL) params.set('model', filters.model);
    if (filters.transmission !== ANY_TRANSMISSION) params.set('transmission', filters.transmission);
    appendPricingToParams(filters.pricing, params);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    setSearchParams(params, { replace: true });
  }, [filters, startDate, endDate, setSearchParams]);

  const toggleDropdown = (field) => {
    setActiveDropdown(prev => (prev === field ? null : field));
  };

  const handleSelectFilter = (field, value) => {
    setFilters(prev => {
      const nextFilters = { ...prev, [field]: value };

      if (field === 'make' && prev.make !== value) {
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

  const handleReset = () => {
    setFilters({ make: ANY_MAKE, model: ANY_MODEL, transmission: ANY_TRANSMISSION, pricing: PRICING_ALL, availability: ALL_CARS });
    setStartDate('');
    setEndDate('');
    setSearchParams({});
  };

  // Helper: is this car unavailable in the selected period?
  const isUnavailable = (car) => {
    if (dateFiltered) return car.availability === 'unavailable';
    return car.status !== 'available';
  };

  // Build booking link with optional pre-filled dates
  const bookingLink = (carId) => {
    if (startDate && endDate) return `/book/${carId}?start_date=${startDate}&end_date=${endDate}`;
    return `/book/${carId}`;
  };

  const getUnavailableLabel = (car) => {
    if (dateFiltered) {
      if (car.reasons?.includes('maintenance')) return t('common.status.maintenance');
      if (car.reasons?.some((r) => r.includes('expired'))) return t('common.status.expiredDocuments');
      return t('common.status.unavailable');
    }
    if (car.status === 'maintenance') return t('common.status.maintenance');
    if (car.status === 'rented') return t('common.status.rented');
    return t('common.status.unavailable');
  };

  const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const getImage = (car) =>
    car.images && car.images.length > 0
      ? (car.images[0].startsWith('http') ? car.images[0] : `${API_URL}${car.images[0].startsWith('/') ? car.images[0] : '/' + car.images[0]}`)
      : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="cars-page-container-premium">
      <div className="cars-page-header-premium">
        <h1 className="our-cars-title">{t('carsPage.title')}</h1>
        <p className="our-cars-subtitle">{t('carsPage.subtitle')}</p>

        <div className="cars-page-search-pill">
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

            {/* Make */}
            <div className="search-field" onClick={() => toggleDropdown('make')}>
              <div className="field-main">
                <span className="field-label">{t('filters.make')}</span>
                <div className="custom-select-trigger">
                  <span>{displayMake(filters.make)}</span>
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className={`custom-dropdown-box ${activeDropdown === 'make' ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className={`dropdown-item ${filters.make === ANY_MAKE ? 'active' : ''}`} onClick={() => handleSelectFilter('make', ANY_MAKE)}>{t('filters.anyMakes')}</div>
                  {availableFilters.brands.map(brand => (
                    <div key={brand} className={`dropdown-item ${filters.make === brand ? 'active' : ''}`} onClick={() => handleSelectFilter('make', brand)}>{brand}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-divider"></div>

            {/* Model */}
            <div className="search-field" onClick={() => toggleDropdown('model')}>
              <div className="field-main">
                <span className="field-label">{t('filters.model')}</span>
                <div className="custom-select-trigger">
                  <span>{displayModel(filters.model)}</span>
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className={`custom-dropdown-box ${activeDropdown === 'model' ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className={`dropdown-item ${filters.model === ANY_MODEL ? 'active' : ''}`} onClick={() => handleSelectFilter('model', ANY_MODEL)}>{t('filters.anyModels')}</div>
                  {availableFilters.models.map(model => (
                    <div key={model} className={`dropdown-item ${filters.model === model ? 'active' : ''}`} onClick={() => handleSelectFilter('model', model)}>{model}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-divider"></div>

            {/* Transmission */}
            <div className="search-field" onClick={() => toggleDropdown('transmission')}>
              <div className="field-main">
                <span className="field-label">{t('filters.transmission')}</span>
                <div className="custom-select-trigger">
                  <span>{formatTransmissionLabel(filters.transmission)}</span>
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className={`custom-dropdown-box ${activeDropdown === 'transmission' ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className={`dropdown-item ${filters.transmission === ANY_TRANSMISSION ? 'active' : ''}`} onClick={() => handleSelectFilter('transmission', ANY_TRANSMISSION)}>{t('filters.anyTransmission')}</div>
                  {availableFilters.transmissions.map(trans => (
                    <div key={trans} className={`dropdown-item ${filters.transmission === trans ? 'active' : ''}`} onClick={() => handleSelectFilter('transmission', trans)}>{formatTransmissionLabel(trans)}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-divider"></div>

            {/* Pricing */}
            <div className="search-field" onClick={() => toggleDropdown('pricing')}>
              <div className="field-main">
                <span className="field-label">{t('filters.pricing')}</span>
                <div className="custom-select-trigger">
                  <span>{pricingLabel(filters.pricing)}</span>
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <div className={`custom-dropdown-box ${activeDropdown === 'pricing' ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                  {pricingOptions.map(item => (
                    <div key={item} className={`dropdown-item ${filters.pricing === item ? 'active' : ''}`} onClick={() => handleSelectFilter('pricing', item)}>{pricingLabel(item)}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="search-divider"></div>

            {/* Check-in date */}
            <div className="search-field search-field-date">
              <div className="field-main">
                <span className="field-label">{t('filters.checkIn')}</span>
                <div className="custom-select-trigger date-trigger-wrapper">
                  <input
                    type="date"
                    className="date-input-pill"
                    value={startDate}
                    min={today}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                  />
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="search-divider"></div>

            {/* Check-out date */}
            <div className="search-field search-field-date">
              <div className="field-main">
                <span className="field-label">{t('filters.checkOut')}</span>
                <div className="custom-select-trigger date-trigger-wrapper">
                  <input
                    type="date"
                    className="date-input-pill"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <div className="field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="btn-search" onClick={handleReset}>{t('common.reset')}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Date filter active banner */}
        {dateFiltered && startDate && endDate && (
          <div className="availability-banner">
            <span className="availability-banner-icon">📅</span>
            <span>
              {t('carsPage.availabilityBanner')}{' '}
              <strong>{new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> → <strong>{new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </span>
            <button type="button" className="availability-banner-clear" onClick={handleReset}>✕ {t('common.clear')}</button>
          </div>
        )}
      </div>

      <div className="cars-page-body-premium">
        {loading ? (
          <div className="section-loader">
            <div className="spinner"></div>
            <p>{t('carsPage.findingCars')}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <h3>{t('carsPage.noCarsTitle')}</h3>
            <p>{t('carsPage.noCarsDesc')}</p>
            <button type="button" className="btn-retry" onClick={handleReset}>{t('common.clearFilters')}</button>
          </div>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => {
              const unavailable = isUnavailable(car);
              const mainImage = getImage(car);

              return (
                <div
                  key={car._id}
                  className={`car-luxury-card ${unavailable ? 'unavailable' : ''}`}
                  onClick={() => navigate(`/cars/${car._id}`)}
                >
                  <div className="card-image-bg" style={{ backgroundImage: `url(${mainImage})` }}>
                    <div className="card-overlay-cars">
                      {/* Unavailability badge */}
                      {unavailable && (
                        <span className="unavailable-badge-cars">{getUnavailableLabel(car)}</span>
                      )}

                      <div className="card-bottom-content">
                        <div className="card-info">
                          <h3 className="car-name-display">{car.brand} {car.model}</h3>
                          <p className="car-price-display">{t('common.dhPerDay', { price: car.dailyPrice })}</p>
                        </div>

                        {unavailable ? (
                          <button
                            className="btn-book-luxury btn-unavailable-luxury"
                            disabled
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{t('common.unavailable')}</span>
                          </button>
                        ) : (
                          <Link
                            to={bookingLink(car._id)}
                            className="btn-book-luxury"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{t('common.bookNow')}</span>
                            <div className="btn-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;

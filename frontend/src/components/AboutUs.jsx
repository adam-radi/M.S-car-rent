import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import featureFleet from '../assets/feature_fleet.png';
import featureSupport from '../assets/feature_support.png';
import featureBooking from '../assets/feature_booking.png';
import featureLocations from '../assets/feature_locations.png';
import ProcessSection from './ProcessSection';
import BookingGuide from './BookingGuide';
import StatusManagementGuide from './StatusManagementGuide';
import RegistrationGuide from './RegistrationGuide';
import '../styles/AboutUs.css';


const getServicesData = (t) => [
  {
    id: 1,
    tabTitle: t('aboutUs.tabs.booking.title'),
    tabSubtitle: t('aboutUs.tabs.booking.subtitle'),
    tabIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mainTitle: 'Instant Booking\nWithout Boundaries',
    mainDesc: 'Skip the paperwork and the waiting lines. Our digital-first approach allows you to reserve your dream vehicle in under a minute directly from your smartphone, with instant verification.',
    btnText: 'Book Now',
    accentValue: '< 1 Min',
    accentText: 'Average time to complete booking',
    image: featureBooking
  },
  {
    id: 2,
    tabTitle: t('aboutUs.tabs.guide.title'),
    tabSubtitle: t('aboutUs.tabs.guide.subtitle'),
    tabIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M4.5 8l7.5 13L19.5 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 8L12 3l7.5 5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3v18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mainTitle: 'How to Reserve\nYour Vehicle',
    mainDesc: 'Follow our simple walkthrough to understand how the booking process works, from selecting dates to instant confirmation.',
    btnText: 'Start Booking',
    accentValue: '24/7',
    accentText: 'Dedicated support for all members',
    image: featureSupport
  },
  {
    id: 3,
    tabTitle: t('aboutUs.tabs.management.title'),
    tabSubtitle: t('aboutUs.tabs.management.subtitle'),
    tabIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 8H9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mainTitle: 'Total Control\nIn Your Hands',
    mainDesc: 'Life is unpredictable. That’s why we give you the power to modify or cancel your reservations directly from your dashboard without any hidden penalties.',
    btnText: 'Manage Now',
    accentValue: '$0',
    accentText: 'Cancellation fees with 72h notice',
    image: featureFleet
  },
  {
    id: 4,
    tabTitle: t('aboutUs.tabs.join.title'),
    tabSubtitle: t('aboutUs.tabs.join.subtitle'),
    tabIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mainTitle: 'Transparent Pricing\nNo Surprises',
    mainDesc: 'What you see is exactly what you pay. We guarantee no hidden refueling fees, unexpected taxes, or mandatory unwanted insurance add-ons when you return the vehicle.',
    btnText: 'View Pricing',
    accentValue: '100%',
    accentText: 'Transparency on all our rates',
    image: featureLocations
  }
];

const AboutUs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const servicesData = useMemo(() => getServicesData(t), [t]);

  return (
    <section className="interactive-services-section">
      {/* Section Header */}
      <div className="services-section-header">
        <span className="services-badge">{t('aboutUs.badge')}</span>
        <h2 className="services-main-heading">
          {t('aboutUs.title')} <span className="text-red">{t('aboutUs.titleAccent')}</span>
        </h2>
      </div>

      {/* Top Bar: 4 Interactive Tabs */}
      <div className="services-tabs-container">
        {servicesData.map((service) => (
          <div 
            key={service.id} 
            className={`service-tab ${activeTab === service.id ? 'active' : ''}`}
            onClick={() => setActiveTab(service.id)}
          >
            <div className="service-tab-icon">
              {service.tabIcon}
            </div>
            <div className="service-tab-content">
              <h4 className="service-tab-title">{service.tabTitle}</h4>
              <p className="service-tab-subtitle">{service.tabSubtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dynamic Content Area */}
      <div className="services-main-area">
        {activeTab === 1 ? (
          <div className="tab-process-content">
            <ProcessSection isEmbedded={true} />
          </div>
        ) : activeTab === 2 ? (
          <div className="tab-process-content">
            <BookingGuide />
          </div>
        ) : activeTab === 3 ? (
          <div className="tab-process-content">
            <StatusManagementGuide />
          </div>
        ) : (
          <div className="tab-process-content">
            <RegistrationGuide />
          </div>
        )}
      </div>

    </section>
  );
};

export default AboutUs;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import assets
import daciaImg from '../assets/dacia.png';
import peugeotImg from '../assets/peugeot.png';
import renaultImg from '../assets/renault.png';
import seatImg from '../assets/siat.png';
import ibizaImg from '../assets/ibiza.png';
import tucsonImg from '../assets/tucson.png';

import '../styles/CarsCarousel.css';

const CARS_DATA = [
  
  {
    id: 2,
    name: 'Peugeot 208 GT',
    image: peugeotImg,
  },
  {
    id: 3,
    name: 'Renault Clio',
    image: renaultImg,
  },
  {
    id: 4,
    name: 'Seat Leon',
    image: seatImg,
  },
  // Replicating for carousel effect if needed, but Swiper handles loop
  {
    id: 5,
    name: 'Dacia Sandero',
    image: daciaImg,
  },
  {
    id: 6,
    name: 'Seat Ibiza',
    image: ibizaImg,
  },
  {
    id: 7,
    name: 'Hyundai Tucson',
    image: tucsonImg,
  },
 
];

const CarsCarousel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCarClick = (modelName) => {
    navigate(`/cars?model=${encodeURIComponent(modelName)}`);
  };

  return (
    <section className="cars-carousel-section">
      <div className="container">
        <div className="cars-carousel-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '2.5rem', fontWeight: '800', color: '#1a202c', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('carsCarousel.title')} <span style={{ color: '#e50914' }}>{t('carsCarousel.titleAccent')}</span>
          </h2>
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          loop={true}
          className="cars-swiper"
        >
          {CARS_DATA.map((car) => (
            <SwiperSlide key={car.id}>
              <div 
                className="car-carousel-card" 
                onClick={() => handleCarClick(car.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="car-image-wrapper">
                  <img src={car.image} alt={car.name} />
                </div>
                <div className="car-info-wrapper">
                  <h3 className="car-model-name">{car.name}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="carousel-navigation-controls">
          <button className="swiper-button-prev-custom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="swiper-button-next-custom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarsCarousel;

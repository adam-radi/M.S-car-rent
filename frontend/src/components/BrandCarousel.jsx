import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BrandCarousel.css';

const BRANDS = [
  { name: 'Tesla', slug: 'tesla' },
  { name: 'Mercedes', slug: 'mercedes' },
  { name: 'Porsche', slug: 'porsche' },
  { name: 'Ferrari', slug: 'ferrari' },
  { name: 'Audi', slug: 'audi' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Peugeot', slug: 'peugeot' },
  { name: 'Renault', slug: 'renault' },
  { name: 'Seat', slug: 'seat' },
  { name: 'Dacia', slug: 'dacia' },
  { name: 'hyundai', slug: 'hyundai' },
];

const BrandCarousel = () => {
  const navigate = useNavigate();
  const [failedImages, setFailedImages] = useState(new Set());

  const handleBrandClick = (brandName) => {
    navigate(`/cars?brand=${brandName}`);
  };

  const handleImageError = (brandSlug) => {
    setFailedImages(prev => new Set(prev).add(brandSlug));
  };

  const doubleBrands = [...BRANDS, ...BRANDS];

  return (
    <div className="brand-carousel-pin-wrap">
      <section className="brand-carousel-section">
        <div className="carousel-container">
          <div className="carousel-track">
            {doubleBrands.map((brand, index) => {
              const hasFailed = failedImages.has(brand.slug);
              return (
                <div
                  key={`${brand.slug}-${index}`}
                  className="brand-item"
                  onClick={() => handleBrandClick(brand.name)}
                  title={`View all ${brand.name} cars`}
                >
                  <div className="brand-logo-container">
                    {hasFailed ? (
                      <span className="brand-text-fallback">{brand.name}</span>
                    ) : (
                      <img 
                        src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${brand.slug}.svg`} 
                        alt={brand.name}
                        className="brand-svg-logo"
                        onError={() => handleImageError(brand.slug)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandCarousel;

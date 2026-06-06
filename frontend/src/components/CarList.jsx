import React from 'react';
import CarCard from './CarCard';
import '../styles/CarStyles.css';

const CarList = ({ cars, loading }) => {
  if (loading) {
    return (
      <div className="car-list-loading">
        <div className="spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="car-list-empty">
        <div className="empty-icon">🚗</div>
        <h3>No cars found</h3>
        <p>Try adjusting your search filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="car-list-grid">
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  );
};

export default CarList;

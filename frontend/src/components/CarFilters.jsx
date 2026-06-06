import React, { useState } from 'react';
import '../styles/CarStyles.css';

const CarFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: '',
    transmission: '',
    fuelType: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleApply = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleClear = () => {
    const cleared = { brand: '', transmission: '', fuelType: '', minPrice: '', maxPrice: '' };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="car-filters">
      <h3>Refine Your Search</h3>
      <form onSubmit={handleApply}>
        <div className="filter-group">
          <label>Brand</label>
          <input 
            type="text" 
            name="brand" 
            value={filters.brand} 
            onChange={handleChange} 
            placeholder="e.g. Toyota" 
          />
        </div>
        
        <div className="filter-group">
          <label>Transmission</label>
          <select name="transmission" value={filters.transmission} onChange={handleChange}>
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Fuel Type</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange}>
            <option value="">Any</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        
        <div className="filter-group price-range">
          <label>Daily Price Range</label>
          <div className="price-inputs">
            <input 
              type="number" 
              name="minPrice" 
              value={filters.minPrice} 
              onChange={handleChange} 
              placeholder="Min" 
            />
            <span> - </span>
            <input 
              type="number" 
              name="maxPrice" 
              value={filters.maxPrice} 
              onChange={handleChange} 
              placeholder="Max" 
            />
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="button" className="btn-clear" onClick={handleClear}>Clear</button>
          <button type="submit" className="btn-apply">Apply Filters</button>
        </div>
      </form>
    </div>
  );
};

export default CarFilters;

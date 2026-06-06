import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, onClear }) => {
  const brands = ['BMW', 'Mercedes', 'Audi', 'Tesla', 'Toyota', 'Ford', 'Volkswagen'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentBrands = Array.isArray(filters.brand) ? filters.brand : [];
      const newBrands = checked 
        ? [...currentBrands, value] 
        : currentBrands.filter(b => b !== value);
      onFilterChange('brand', newBrands);
    } else {
      onFilterChange(name, value);
    }
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-group">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <input 
            type="number" 
            name="dailyPrice[gte]" 
            placeholder="Min" 
            value={filters['dailyPrice[gte]']} 
            onChange={handleChange} 
          />
          <span>-</span>
          <input 
            type="number" 
            name="dailyPrice[lte]" 
            placeholder="Max" 
            value={filters['dailyPrice[lte]']} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="filter-group">
        <h3>Brands</h3>
        <div className="checkbox-list">
          {brands.map(brand => (
            <label key={brand} className="checkbox-label">
              <input 
                type="checkbox" 
                value={brand} 
                checked={Array.isArray(filters.brand) && filters.brand.includes(brand)}
                onChange={handleChange}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Transmission</h3>
        <select name="transmission" value={filters.transmission} onChange={handleChange}>
          <option value="">All Types</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <button className="btn-clear" onClick={onClear}>Clear Filters</button>
    </aside>
  );
};

export default FilterSidebar;

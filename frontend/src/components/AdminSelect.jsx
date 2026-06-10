import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/AdminSelect.css';

/**
 * AdminSelect – Reusable styled dropdown matching the search-pill dropdown style.
 * Props:
 *  - name: field name (for onChange)
 *  - value: current selected value
 *  - onChange: function(name, value)
 *  - options: array of { value, label }
 *  - disabled: boolean
 *  - placeholder: fallback text when no value
 *  - className: extra class on root wrapper
 */
const AdminSelect = ({ name, value, onChange, options = [], disabled = false, placeholder = 'Select...', className = '' }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left,
        top: rect.bottom,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    } else {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const isValueEqual = (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase() === b.toLowerCase();
    }
    return a === b;
  };

  const selectedOption = options.find((o) => isValueEqual(o.value, value));
  const selectedLabel = selectedOption?.label || placeholder;

  const handleSelect = (optionValue) => {
    onChange(name, optionValue);
    setOpen(false);
  };

  const dropdownMenu = open && coords ? createPortal(
    <div 
      className="admin-dropdown-box" 
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${coords.top + 6}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        zIndex: 999999,
        margin: 0
      }}
    >
      {options.length > 0 ? (
        options.map(opt => (
          <div
            key={opt.value}
            className={`admin-dropdown-item ${isValueEqual(opt.value, value) ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleSelect(opt.value); }}
          >
            {opt.label}
          </div>
        ))
      ) : (
        <div className="admin-select-empty">No results found</div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={wrapperRef}
      className={`admin-select-wrapper ${disabled ? 'disabled' : ''} ${className}`}
      onClick={() => !disabled && setOpen(prev => !prev)}
    >
      {/* Trigger */}
      <div className="admin-select-trigger">
        <span className={`admin-select-value ${!value ? 'placeholder' : ''}`}>
          {selectedLabel}
        </span>
        <span className={`admin-select-arrow ${open ? 'open' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {dropdownMenu}
    </div>
  );
};

export default AdminSelect;

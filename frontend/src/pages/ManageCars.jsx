import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCars, createCar, updateCar, deleteCar } from '../api/carApi';
import ImageUpload from '../components/ImageUpload';
import AdminSelect from '../components/AdminSelect';
import { FaPlus, FaEdit, FaTrash, FaCar, FaGasPump, FaCogs, FaTimes, FaSearch } from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import '../styles/ManageCars.css';

const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const CAR_BRANDS = {
  'Mercedes-Benz': ['C-Class','A-Class', 'E-Class', 'S-Class', 'GLE', 'GLS', 'G-Wagon', 'AMG GT'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X5', 'X7', 'M4', 'M8'],
  'Audi': ['A4', 'A6', 'A8', 'Q7', 'Q8', 'RS6', 'R8'],
  'Porsche': ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
  'Range Rover': ['Sport', 'Vogue', 'Velar', 'Evoque'],
  'Tesla': ['Model S', 'Model 3', 'Model X', 'Model Y'],
  'Ferrari': ['488', 'F8', 'SF90', 'Roma', 'Purosangue'],
  'Lamborghini': ['Urus', 'Huracan', 'Aventador'],
  'Bentley': ['Continental GT', 'Bentayga', 'Flying Spur'],
  'Rolls-Royce': ['Phantom', 'Cullinan', 'Ghost']
};

const ManageCars = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    dailyPrice: '',
    fuelType: 'gasoline',
    transmission: 'automatic',
    seats: 5,
    mileage: 0,
    status: 'available',
    description: '',
    images: [],
    isFeatured: false,
    vignetteBlocking: false
  });

  const fetchCars = useCallback(async () => {
    try {
      const res = await getCars({ limit: 100 });
      if (res.success) setCars(res.data || []);
    } catch (err) {
      setError(t('admin.manageCars.alerts.failedLoadCars'));
    } finally {
      setLoading(false);
    }
  }, [t]);


  
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'brand') {
        return { ...prev, [name]: value, model: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const setImages = (updater) => {
    if (typeof updater === 'function') {
      setFormData(prev => ({ ...prev, images: updater(prev.images) }));
    } else {
      setFormData(prev => ({ ...prev, images: updater }));
    }
  };

  const handleOpenModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        brand: car.brand,
        model: car.model,
        year: car.year,
        licensePlate: car.licensePlate,
        dailyPrice: car.dailyPrice,
        fuelType: car.fuelType || 'gasoline',
        transmission: car.transmission || 'automatic',
        seats: car.seats || 5,
        mileage: car.mileage || 0,
        status: car.status || 'available',
        description: car.description || '',
        images: car.images || [],
        isFeatured: car.isFeatured || false,
        vignetteBlocking: car.vignetteBlocking || false
      });
    } else {
      setEditingCar(null);
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        dailyPrice: '',
        fuelType: 'gasoline',
        transmission: 'automatic',
        seats: 5,
        mileage: 0,
        status: 'available',
        description: '',
        images: [],
        isFeatured: false,
        vignetteBlocking: false
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Car Data:', formData);
    
    if (formData.images.length === 0) {
      if (!window.confirm(t('admin.manageCars.alerts.noImagesConfirm'))) {
      }
    }

    try {
      let res;
      if (editingCar) {
        res = await updateCar(editingCar._id, formData);
      } else {
        res = await createCar(formData);
      }
      
      if (res.success) {
        setShowModal(false);
        fetchCars();
      } else {
        alert(res.message || t('admin.manageCars.alerts.operationFailed'));
      }
    } catch (err) {
      console.error('Submission Error:', err);
      alert(err.response?.data?.message || t('admin.manageCars.alerts.errorSavingCar'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.manageCars.alerts.deleteConfirm'))) {
      try {
        await deleteCar(id);
        fetchCars();
      } catch (err) {
        alert(t('admin.manageCars.alerts.errorDeletingCar'));
      }
    }
  };

  if (loading) return <div className="admin-loading-container"><div className="loader"></div><p>{t('admin.manageCars.loading')}</p></div>;

  const filteredCars = Array.isArray(cars) ? cars.filter(car => {
    const matchesSearch = String(car.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         String(car.model || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  return (
    <div className="manage-cars-container admin-page-padding">
      <div className="manage-cars-header">
        <div className="header-title">
          <h1>{t('admin.manageCars.title')}</h1>
          <p>{t('admin.manageCars.subtitle')}</p>
        </div>
        <button className="add-vehicle-btn" onClick={() => handleOpenModal()}>
          <FaPlus /> {t('admin.manageCars.buttons.addVehicle')}
        </button>
      </div>

      <div className="admin-controls-row">
        <div className="search-bar-admin">
          <FaSearch className="search-icon-small" />
          <input 
            type="text" 
            placeholder={t('admin.manageCars.searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="spacer"></div>

        <div className="filter-group-admin">
          <label>{t('admin.manageCars.filters.status')}</label>
          <AdminSelect
            name="statusFilter"
            value={statusFilter}
            onChange={(name, val) => setStatusFilter(val)}
            options={[
              { value: 'all', label: t('admin.manageCars.filters.allFleet') },
              { value: 'available', label: t('admin.status.available') },
              { value: 'rented', label: t('admin.status.rented') },
              { value: 'maintenance', label: t('admin.status.maintenance') },
              { value: 'retired', label: t('admin.status.retired') },
            ]}
            className="filter-admin-select"
          />
        </div>
      </div>

      {error && <div className="alert-message error">{error}</div>}

      <div className="fleet-grid">
        {filteredCars.map(car => (
          <div 
            key={car._id} 
            className="vehicle-card-admin"
            onClick={() => navigate(`/cars/${car._id}`)}
          >
            <div className="card-image-section">
              <img src={car.images?.[0] ? `${API_URL}${car.images[0]}` : '/placeholder-car.jpg'} alt={`${car.brand} ${car.model}`} />
              <div className={`status-tag ${car.status}`}>{car.status}</div>
              <div className="card-quick-actions">
                <button 
                  className="mini-action-btn edit" 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(car); }} 
                >
                  <FaEdit />
                </button>
                <button 
                  className="mini-action-btn delete" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(car._id); }} 
                >
                  <FaTrash />
                </button>
                <button 
                  className="mini-action-btn health" 
                  onClick={(e) => { e.stopPropagation(); navigate(`/admin/fleet-health?carId=${car._id}`); }} 
                  title="Vehicle Health"
                >
                  <FiActivity />
                </button>
              </div>
            </div>
            <div className="card-details-section">
              <div className="vehicle-main-info">
                <h3>{car.brand} {car.model}</h3>
                <span className="plate-pill">{car.licensePlate}</span>
              </div>
              <div className="vehicle-sub-info">
                <span>{car.year}</span>
                <span className="dot">•</span>
                <span>{car.dailyPrice} $/day</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box-car">
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle"><FaCar /></div>
                <div>
                  <h2>{editingCar ? t('admin.manageCars.modal.titleEdit') : t('admin.manageCars.modal.titleNew')}</h2>
                  <p>{editingCar ? t('admin.manageCars.modal.subtitleEdit') : t('admin.manageCars.modal.subtitleNew')}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="car-registration-form">
              <div className="form-layout-main">
                <div className="form-column">
                  <h3 className="section-subtitle"><FaCar /> Basic Details</h3>
                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.brand')}</label>
                      <AdminSelect
                        name="brand"
                        value={formData.brand}
                        onChange={(name, val) => setFormData(prev => ({ ...prev, brand: val, model: '' }))}
                        placeholder={t('admin.manageCars.modal.placeholders.brand')}
                        options={Object.keys(CAR_BRANDS).map(b => ({ value: b, label: b }))}
                      />
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.model')}</label>
                      <AdminSelect
                        name="model"
                        value={formData.model}
                        onChange={(name, val) => setFormData(prev => ({ ...prev, model: val }))}
                        placeholder={t('admin.manageCars.modal.placeholders.model')}
                        disabled={!formData.brand}
                        options={formData.brand && Array.isArray(CAR_BRANDS[formData.brand]) ? CAR_BRANDS[formData.brand].map(m => ({ value: m, label: m })) : []}
                      />
                    </div>
                  </div>

                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.year')}</label>
                      <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="clean-input" />
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.licensePlate')}</label>
                      <input name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} placeholder={t('admin.manageCars.modal.placeholders.licensePlate')} required className="clean-input" />
                    </div>
                  </div>

                  <h3 className="section-subtitle"><FaCogs /> Specifications</h3>
                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.dailyPrice')}</label>
                      <div className="input-with-symbol">
                        <span className="symbol">$</span>
                        <input type="number" name="dailyPrice" value={formData.dailyPrice} onChange={handleInputChange} required className="clean-input" />
                      </div>
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.mileage')}</label>
                      <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="clean-input" />
                    </div>
                  </div>

                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.transmission')}</label>
                      <AdminSelect
                        name="transmission"
                        value={formData.transmission}
                        onChange={(name, val) => setFormData(prev => ({ ...prev, transmission: val }))}
                        options={[
                          { value: 'automatic', label: t('admin.manageCars.modal.options.automatic') },
                          { value: 'manual', label: t('admin.manageCars.modal.options.manual') },
                        ]}
                      />
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageCars.modal.fields.fuelType')}</label>
                      <AdminSelect
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={(name, val) => setFormData(prev => ({ ...prev, fuelType: val }))}
                        options={[
                          { value: 'gasoline', label: t('admin.manageCars.modal.options.gasoline') },
                          { value: 'diesel', label: t('admin.manageCars.modal.options.diesel') },
                          { value: 'electric', label: t('admin.manageCars.modal.options.electric') },
                          { value: 'hybrid', label: t('admin.manageCars.modal.options.hybrid') },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Additional features or notes..." className="clean-input"></textarea>
                  </div>
                </div>

                <div className="form-column">
                  <h3 className="section-subtitle"><FaGasPump /> Visuals & Status</h3>
                  <div className="image-upload-wrapper">
                    <ImageUpload images={formData.images} setImages={setImages} />
                  </div>

                  <div className="status-selection-box">
                    <label>{t('admin.manageCars.modal.fields.availabilityStatus')}</label>
                    <div className="status-options-grid">
                      {['available', 'rented', 'maintenance', 'retired'].map(s => (
                        <button 
                          key={s}
                          type="button"
                          className={`status-opt-btn ${formData.status === s ? 'active' : ''}`}
                          onClick={() => setFormData({...formData, status: s})}
                        >
                          {t(`admin.status.${s}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="feature-toggle-card">
                    <div className="toggle-info">
                      <strong>{t('admin.manageCars.modal.features.promoteFeatured.title')}</strong>
                      <p>{t('admin.manageCars.modal.features.promoteFeatured.description')}</p>
                    </div>
                    <label className="ios-toggle">
                      <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="feature-toggle-card">
                    <div className="toggle-info">
                      <strong>{t('admin.manageCars.modal.features.blockIfVignetteExpired.title')}</strong>
                      <p>{t('admin.manageCars.modal.features.blockIfVignetteExpired.description')}</p>
                    </div>
                    <label className="ios-toggle">
                      <input type="checkbox" checked={formData.vignetteBlocking} onChange={(e) => setFormData({...formData, vignetteBlocking: e.target.checked})} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer-glass">
                <button type="button" className="btn-cancel-flat" onClick={() => setShowModal(false)}>{t('admin.common.cancel')}</button>
                <button type="submit" className="btn-save-glow">{editingCar ? t('admin.manageCars.modal.buttons.updateVehicle') : t('admin.manageCars.modal.buttons.saveVehicle')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;

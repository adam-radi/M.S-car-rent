import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCarDocuments, addCarDocument, updateCarDocument } from '../api/carDocumentApi';
import { getCars } from '../api/carApi';
import AdminSelect from '../components/AdminSelect';
import { FaFileMedical, FaTimes, FaFileUpload, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import '../styles/ManageCarDocuments.css';

const ManageCarDocuments = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCarId, setFilterCarId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    carId: '',
    type: 'insurance',
    startDate: '',
    endDate: '',
    notes: '',
    isBlocking: true,
    document: null
  });

  const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, carRes] = await Promise.all([
        getCarDocuments(), 
        getCars({ limit: 100, isDeleted: false }) 
      ]);
      if (docRes.success) setDocuments(docRes.data);
      if (carRes.success) setCars(carRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.carId || !formData.type || !formData.endDate) {
      alert(t('admin.manageCarDocuments.alerts.selectRequiredFields'));
      return;
    }

    const data = new FormData();
    data.append('carId', formData.carId);
    data.append('type', formData.type);
    data.append('startDate', formData.startDate);
    data.append('endDate', formData.endDate);
    data.append('notes', formData.notes);
    data.append('isBlocking', formData.isBlocking);
    if (formData.document) {
      data.append('document', formData.document);
    }

    try {
      const res = await addCarDocument(data);
      if (res.success) {
        setShowModal(false);
        setFormData({ carId: '', type: 'insurance', startDate: '', endDate: '', notes: '', document: null });
        fetchData();
      }
    } catch (err) {
      alert(t('admin.manageCarDocuments.alerts.submitFailed'));
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateCarDocument(id, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert(t('admin.manageCarDocuments.alerts.updateStatusFailed'));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCar = filterCarId === 'all' || doc.car?._id === filterCarId;
    const carName = `${doc.car?.brand} ${doc.car?.model}`.toLowerCase();
    const plate = doc.car?.licensePlate?.toLowerCase() || '';
    const matchesSearch = carName.includes(searchQuery.toLowerCase()) || plate.includes(searchQuery.toLowerCase());
    return matchesCar && matchesSearch;
  });

  const getStatusBadge = (doc) => {
    const isExpired = doc.status === 'expired';
    const isSoon = !isExpired && doc.endDate && new Date(doc.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (isExpired) return <span className="health-badge expired"><FaExclamationTriangle /> {t('admin.manageCarDocuments.status.expired')}</span>;
    if (isSoon) return <span className="health-badge warning"><FaExclamationTriangle /> {t('admin.manageCarDocuments.status.expiringSoon')}</span>;
    return <span className="health-badge valid"><FaCheckCircle /> {t('admin.manageCarDocuments.status.valid')}</span>;
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="manage-documents admin-page-padding">
      <div className="manage-header">
        <div>
          <h1>{t('admin.manageCarDocuments.title')}</h1>
          <p>{t('admin.manageCarDocuments.subtitle')}</p>
        </div>
        <button className="btn-add-doc" onClick={() => setShowModal(true)}>
          <FaFileUpload /> {t('admin.manageCarDocuments.buttons.uploadDocument')}
        </button>
      </div>

      <div className="fleet-filters-row">
        <div className="filter-item">
          <label>{t('admin.manageCarDocuments.filters.filterByCar')}</label>
          <AdminSelect 
            value={filterCarId}
            onChange={(name, val) => setFilterCarId(val)}
            options={[
              { value: 'all', label: t('admin.manageCarDocuments.filters.allVehicles') },
              ...cars.map(c => ({ value: c._id, label: `${c.brand} ${c.model}` }))
            ]}
          />
        </div>
        <div className="search-item">
          <div className="search-pill-manage">
            <div className="field-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('admin.manageCarDocuments.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.manageCarDocuments.tableHeaders.vehicle')}</th>
              <th>{t('admin.manageCarDocuments.tableHeaders.documentType')}</th>
              <th>{t('admin.manageCarDocuments.tableHeaders.period')}</th>
              <th>{t('admin.manageCarDocuments.tableHeaders.status')}</th>
              <th>{t('admin.manageCarDocuments.tableHeaders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr key={doc._id}>
                <td>
                  <strong>{doc.car?.brand} {doc.car?.model}</strong>
                  <div className="license-sub">{doc.car?.licensePlate}</div>
                </td>
                <td>
                  <span className="doc-type-badge">{t(`admin.manageCarDocuments.documentType.${doc.type}`)}</span>
                </td>
                <td>
                  <div className="date-range">
                    {doc.startDate && new Date(doc.startDate).toLocaleDateString()} 
                    {doc.endDate && ` → ${new Date(doc.endDate).toLocaleDateString()}`}
                  </div>
                </td>
                <td>{getStatusBadge(doc)}</td>
                <td className="actions-cell">
                  <div className="action-stack">
                    {doc.fileUrl && (
                      <a href={`${API_URL}/${doc.fileUrl}`} target="_blank" rel="noreferrer" className="action-icon-btn view" title={t('admin.manageCarDocuments.viewDocument')}>
                        <FaEye />
                      </a>
                    )}
                    <select 
                      className="mini-status-select"
                      value={doc.status}
                      onChange={(e) => handleUpdateStatus(doc._id, e.target.value)}
                    >
                      <option value="valid">{t('admin.manageCarDocuments.status.valid')}</option>
                      <option value="expired">{t('admin.manageCarDocuments.status.expired')}</option>
                      <option value="deleted">{t('admin.manageCarDocuments.actions.delete')}</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop abm-backdrop">
          <div className="modal-box abm-box" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle"><FaFileMedical /></div>
                <div>
                  <h2>{t('admin.manageCarDocuments.modal.title')}</h2>
                  <p>{t('admin.manageCarDocuments.modal.description')}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="car-registration-form">
              <div className="abm-form-body" style={{ padding: '1.5rem 2.5rem 180px 2.5rem' }}>
                <div className="abm-section">
                  <div className="input-field">
                    <label>{t('admin.manageCarDocuments.modal.selectVehicle')}</label>
                    <AdminSelect 
                      name="carId"
                      value={formData.carId} 
                      onChange={(name, val) => setFormData({...formData, carId: val})}
                      placeholder={t('admin.manageCarDocuments.modal.selectVehiclePlaceholder')}
                      options={cars.map(car => ({
                        value: car._id,
                        label: `${car.brand} ${car.model} (${car.licensePlate})`
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>{t('admin.manageCarDocuments.modal.documentType')}</label>
                    <AdminSelect 
                      name="type"
                      value={formData.type} 
                      onChange={(name, val) => setFormData({...formData, type: val})}
                      options={[
                        { value: 'insurance', label: t('admin.manageCarDocuments.documentType.insurance') },
                        { value: 'technical_control', label: t('admin.manageCarDocuments.documentType.technical_control') },
                        { value: 'vignette', label: t('admin.manageCarDocuments.documentType.vignette') },
                        { value: 'carte_grise', label: t('admin.manageCarDocuments.documentType.carte_grise') }
                      ]}
                    />
                  </div>
                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageCarDocuments.modal.startDate')}</label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="clean-input" />
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageCarDocuments.modal.endDate')}</label>
                      <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="clean-input" />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>{t('admin.manageCarDocuments.modal.uploadDocument')}</label>
                    <input type="file" onChange={handleFileChange} className="clean-input" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="input-field">
                    <label>{t('admin.manageCarDocuments.modal.notesOptional')}</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" className="clean-input"></textarea>
                  </div>
                  <div className="feature-toggle-card">
                    <div className="toggle-info">
                      <strong>{t('admin.manageCarDocuments.modal.blockAvailabilityTitle')}</strong>
                      <p>{t('admin.manageCarDocuments.modal.blockAvailabilityDescription')}</p>
                    </div>
                    <label className="ios-toggle">
                      <input type="checkbox" checked={formData.isBlocking} onChange={(e) => setFormData({...formData, isBlocking: e.target.checked})} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer-glass">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel-flat">{t('admin.common.cancel')}</button>
                <button type="submit" className="btn-save-glow">{t('admin.manageCarDocuments.modal.submitButton')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCarDocuments;

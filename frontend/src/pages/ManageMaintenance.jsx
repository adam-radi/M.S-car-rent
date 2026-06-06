import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllMaintenance, createMaintenance, updateMaintenanceStatus } from '../api/maintenanceApi';
import { getCars } from '../api/carApi';
import AdminSelect from '../components/AdminSelect';
import { FaTools, FaTimes, FaWrench } from 'react-icons/fa';
import '../styles/ManageMaintenance.css';

const ManageMaintenance = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    carId: '',
    type: 'inspection',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    cost: '',
    performedBy: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([getAllMaintenance(), getCars({ limit: 100 })]);
      if (mRes.success) setRecords(mRes.data);
      if (cRes.success) setCars(cRes.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createMaintenance(formData);
      if (res.success) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || t('admin.manageMaintenance.alerts.createFailed'));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMaintenanceStatus(id, { status });
      fetchData();
    } catch (err) {
      alert(t('admin.manageMaintenance.alerts.statusUpdateFailed'));
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="manage-maintenance admin-page-padding">
      <div className="manage-header">
        <h1>{t('admin.manageMaintenance.title')}</h1>
        <button className="btn-add-service" onClick={() => setShowModal(true)}>
          <FaTools /> {t('admin.manageMaintenance.buttons.scheduleService')}
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.manageMaintenance.tableHeaders.car')}</th>
              <th>{t('admin.manageMaintenance.tableHeaders.serviceType')}</th>
              <th>{t('admin.manageMaintenance.tableHeaders.status')}</th>
              <th>{t('admin.manageMaintenance.tableHeaders.period')}</th>
              <th>{t('admin.manageMaintenance.tableHeaders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record._id}>
                <td>
                  <strong>{record.car?.brand} {record.car?.model}</strong>
                  <div className="license-sub">{record.car?.licensePlate}</div>
                </td>
                <td>
                  <span className="type-badge">{record.type.replace('_', ' ')}</span>
                  <p className="desc-sub">{record.description}</p>
                </td>
                <td>
                  <span className={`status-pill ${record.status}`}>{t(`admin.manageMaintenance.status.${record.status}`)}</span>
                </td>
                <td>
                  <div className="date-range-table">
                    {new Date(record.startDate).toLocaleDateString()}
                    {record.endDate && <div className="date-arrow"> → {new Date(record.endDate).toLocaleDateString()}</div>}
                  </div>
                </td>
                <td>
                  <AdminSelect 
                    name="status"
                    value={record.status} 
                    onChange={(name, val) => handleStatusChange(record._id, val)}
                    className="row-status-select"
                    options={[
                      { value: 'scheduled', label: t('admin.manageMaintenance.status.scheduled') },
                      { value: 'in_progress', label: t('admin.manageMaintenance.status.inProgress') },
                      { value: 'done', label: t('admin.manageMaintenance.status.done') },
                      { value: 'cancelled', label: t('admin.manageMaintenance.status.cancelled') }
                    ]}
                  />
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
                <div className="icon-circle"><FaWrench /></div>
                <div>
                  <h2>{t('admin.manageMaintenance.modal.title')}</h2>
                  <p>{t('admin.manageMaintenance.modal.subtitle')}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="car-registration-form">
              <div className="abm-form-body" style={{ padding: '1.5rem 2.5rem' }}>
                <div className="abm-section">
                  <div className="input-field">
                    <label>{t('admin.manageMaintenance.modal.fields.car')}</label>
                    <AdminSelect 
                      name="carId"
                      value={formData.carId} 
                      onChange={(name, val) => setFormData({...formData, carId: val})}
                      placeholder={t('admin.manageMaintenance.modal.placeholders.selectCar')}
                      options={cars.map(car => ({
                        value: car._id,
                        label: `${car.brand} ${car.model} (${car.licensePlate})`
                      }))}
                    />
                  </div>
                  <div className="input-field">
                    <label>{t('admin.manageMaintenance.modal.fields.type')}</label>
                    <AdminSelect 
                      name="type"
                      value={formData.type} 
                      onChange={(name, val) => setFormData({...formData, type: val})}
                      options={[
                        { value: 'oil_change', label: t('admin.manageMaintenance.modal.options.oilChange') },
                        { value: 'tire_change', label: t('admin.manageMaintenance.modal.options.tireChange') },
                        { value: 'inspection', label: t('admin.manageMaintenance.modal.options.inspection') },
                        { value: 'repair', label: t('admin.manageMaintenance.modal.options.repair') },
                        { value: 'other', label: t('admin.manageMaintenance.modal.options.other') }
                      ]}
                    />
                  </div>
                  <div className="input-group-grid">
                    <div className="input-field">
                      <label>{t('admin.manageMaintenance.modal.fields.startDate')}</label>
                      <input 
                        type="date" 
                        name="startDate" 
                        value={formData.startDate} 
                        onChange={handleInputChange} 
                        required 
                        className="clean-input"
                      />
                    </div>
                    <div className="input-field">
                      <label>{t('admin.manageMaintenance.modal.fields.endDate')}</label>
                      <input 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        onChange={handleInputChange} 
                        required 
                        className="clean-input"
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>{t('admin.manageMaintenance.modal.fields.description')}</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      required 
                      rows="3"
                      className="clean-input"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer-glass">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel-flat">{t('admin.common.cancel')}</button>
                <button type="submit" className="btn-save-glow">{t('admin.manageMaintenance.buttons.schedule')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMaintenance;

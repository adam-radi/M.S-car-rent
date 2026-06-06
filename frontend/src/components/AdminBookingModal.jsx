import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers } from '../api/authApi';
import { useCars } from '../hooks/useCars';
import { createBooking } from '../api/bookingApi';
import AdminSelect from './AdminSelect';
import BookingCalendar from './BookingCalendar';
import { FaTimes, FaUser, FaCar, FaCalendarAlt, FaUserPlus, FaSearch } from 'react-icons/fa';
import './AdminBookingModal.css';

const AdminBookingModal = ({ onClose, onSuccess, initialGuestInfo = null }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { cars, fetchCars } = useCars();
  const [clientMode, setClientMode] = useState('guest'); // 'guest' | 'account'

  // Guest info fields
  const [guestInfo, setGuestInfo] = useState({ fullName: '', cin: '', phone: '', email: '' });

  // Account mode
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Common booking fields
  const [carId, setCarId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Main Office');
  const [notes, setNotes] = useState('');
  const [manualDiscount, setManualDiscount] = useState(0);

  const [showCalendar, setShowCalendar] = useState(false);

  // Price preview
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      if (res.success) setUsers(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCars();
  }, [fetchUsers, fetchCars]);

  useEffect(() => {
    if (!initialGuestInfo) return;

    setClientMode('guest');
    setSelectedUserId('');
    setGuestInfo((prev) => ({
      ...prev,
      ...initialGuestInfo,
      cin: initialGuestInfo.cin ? initialGuestInfo.cin.toUpperCase() : prev.cin
    }));
  }, [initialGuestInfo]);

  // Price preview calculation
  useEffect(() => {
    if (!carId || !startDate || !endDate) { setPreview(null); return; }
    const car = cars.find(c => c._id === carId);
    if (!car) { setPreview(null); return; }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) { setPreview(null); return; }
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = car.dailyPrice * totalDays;
    const carDiscount = (car.discountThreshold && totalDays >= car.discountThreshold) ? car.discountPercent : 0;
    const totalDiscount = Math.min(carDiscount + Number(manualDiscount), 100);
    const finalPrice = basePrice * (1 - totalDiscount / 100);
    setPreview({ totalDays, basePrice, carDiscount, manualDiscount: Number(manualDiscount), totalDiscount, finalPrice });
  }, [carId, startDate, endDate, manualDiscount, cars]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (clientMode === 'guest') {
      if (!guestInfo.fullName || !guestInfo.cin || !guestInfo.phone) {
        setError(t('admin.bookingModal.errors.guestFieldsRequired'));
        return;
      }
    } else {
      if (!selectedUserId) {
        setError(t('admin.bookingModal.errors.selectCustomerAccount'));
        return;
      }
    }

    if (!carId || !startDate || !endDate || !pickupLocation) {
      setError(t('admin.bookingModal.errors.fillRequiredFields'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        carId,
        startDate,
        endDate,
        pickupLocation,
        notes,
        manualDiscount: Number(manualDiscount),
        ...(clientMode === 'account'
          ? { customerId: selectedUserId }
          : { guestInfo })
      };
      const res = await createBooking(payload);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || t('admin.bookingModal.errors.creationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.role === 'customer' &&
    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
     u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const availableCars = cars.filter(c => c.status !== 'retired');

  return (
    <div className="modal-backdrop abm-backdrop">
      <div className="modal-box-book abm-box">

        {/* ── Header ── */}
        <div className="modal-head">
          <div className="modal-title-group">
            <div className="icon-circle"><FaCalendarAlt /></div>
            <div>
              <h2>{t('admin.bookingModal.title')}</h2>
              <p>{t('admin.bookingModal.subtitle')}</p>
            </div>
          </div>
          <button className="close-btn-circle" onClick={onClose} type="button"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="car-registration-form">
          <div className="abm-form-body">

            {/* ── Client Mode Toggle ── */}
            <div className="abm-mode-tabs">
              <button
                type="button"
                className={`abm-mode-tab ${clientMode === 'guest' ? 'active' : ''}`}
                onClick={() => { setClientMode('guest'); setSelectedUserId(''); }}
              >
                <FaUserPlus /> {t('admin.bookingModal.guestTab')}
              </button>
              <button
                type="button"
                className={`abm-mode-tab ${clientMode === 'account' ? 'active' : ''}`}
                onClick={() => { setClientMode('account'); setGuestInfo({ fullName: '', cin: '', phone: '', email: '' }); }}
              >
                <FaUser /> {t('admin.bookingModal.accountTab')}
              </button>
            </div>

            {/* ── Guest Mode ── */}
            {clientMode === 'guest' && (
              <div className="abm-section">
                <h3 className="section-subtitle"><FaUser /> {t('admin.bookingModal.guestSectionTitle')}</h3>
                <div className="input-group-grid">
                  <div className="input-field">
                    <label>{t('admin.bookingModal.labels.fullName')}</label>
                    <input className="clean-input" placeholder={t('admin.bookingModal.placeholders.fullName')} required value={guestInfo.fullName} onChange={e => setGuestInfo(p => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div className="input-field">
                    <label>{t('admin.bookingModal.labels.cin')}</label>
                    <input className="clean-input" placeholder={t('admin.bookingModal.placeholders.cin')} required value={guestInfo.cin} onChange={e => setGuestInfo(p => ({ ...p, cin: e.target.value.toUpperCase() }))} />
                  </div>
                </div>
                <div className="input-group-grid">
                  <div className="input-field">
                    <label>{t('admin.bookingModal.labels.phone')}</label>
                    <input className="clean-input" placeholder={t('admin.bookingModal.placeholders.phone')} type="tel" required value={guestInfo.phone} onChange={e => setGuestInfo(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="input-field">
                    <label>{t('admin.bookingModal.labels.emailOptional')}</label>
                    <input className="clean-input" placeholder={t('admin.bookingModal.placeholders.email')} type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Account Mode ── */}
            {clientMode === 'account' && (
              <div className="abm-section">
                <h3 className="section-subtitle"><FaSearch /> {t('admin.bookingModal.accountSectionTitle')}</h3>
                <div className="input-field">
                  <label>{t('admin.bookingModal.labels.search')}</label>
                  <input type="text" placeholder={t('admin.bookingModal.placeholders.search')} className="clean-input" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </div>
                <div className="input-field">
                  <label>{t('admin.bookingModal.labels.selectCustomer')}</label>
                  <div className="abm-user-list">
                    {filteredUsers.length === 0
                      ? <div className="abm-empty">{t('admin.bookingModal.noCustomersFound')}</div>
                      : filteredUsers.map(user => (
                        <div
                          key={user._id}
                          className={`abm-user-item ${selectedUserId === user._id ? 'selected' : ''}`}
                          onClick={() => setSelectedUserId(user._id)}
                        >
                          <div className="abm-user-avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                            <span>{user.email}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── Vehicle & Dates ── */}
            <div className="abm-section">
              <h3 className="section-subtitle"><FaCar /> Vehicle & Rental Period</h3>

              <div className="input-field">
                <label>{t('admin.bookingModal.labels.vehicle')}</label>
                <AdminSelect
                  name="carId"
                  value={carId}
                  onChange={(name, val) => setCarId(val)}
                  placeholder={t('admin.bookingModal.placeholders.vehicle')}
                  options={availableCars.map(car => ({
                    value: car._id,
                    label: `${car.brand} ${car.model} (${car.year}) — ${car.dailyPrice} DH/day [${t(`admin.status.${car.status}`)}]`
                  }))}
                />
              </div>

              <div className="calendar-section" style={{marginBottom: '10px'}}>
                <label style={{fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '0.6rem'}}>{t('admin.bookingModal.labels.selectDates')}</label>
                <div 
                  className={`calendar-trigger ${startDate ? 'selected' : ''}`}
                  onClick={() => {
                    if (!carId) {
                      setError(t('admin.bookingModal.errors.selectVehicleFirst'));
                      return;
                    }
                    setShowCalendar(true);
                  }}
                >
                  {startDate && endDate 
                    ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                    : t('admin.bookingModal.placeholders.selectDates')}
                  <span className="calendar-icon">📅</span>
                </div>
                
                <div className={`calendar-modal-overlay ${showCalendar ? 'active' : ''}`} onClick={() => setShowCalendar(false)}>
                  <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="close-calendar" onClick={() => setShowCalendar(false)}>&times;</button>
                    {showCalendar && carId && (
                      <BookingCalendar 
                        carId={carId} 
                        onDateSelect={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                          if (start && end) {
                            setTimeout(() => setShowCalendar(false), 300);
                          }
                        }} 
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="input-field">
                <label>{t('admin.bookingModal.labels.pickupLocation')}</label>
                <input type="text" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} className="clean-input" placeholder={t('admin.bookingModal.placeholders.pickupLocation')} required />
              </div>

              <div className="input-group-grid">
                <div className="input-field">
                  <label>{t('admin.bookingModal.labels.discount')}</label>
                  <input type="number" min="0" max="100" value={manualDiscount} onChange={e => setManualDiscount(e.target.value)} className="clean-input" />
                </div>
                <div className="input-field">
                  <label>{t('admin.bookingModal.labels.notes')}</label>
                  <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="clean-input" placeholder={t('admin.bookingModal.placeholders.notes')} />
                </div>
              </div>

              {/* Price Preview */}
              {preview && (
                <div className="abm-price-preview">
                  <div className="abm-price-row">
                    <span>Duration</span>
                    <span>{preview.totalDays} day{preview.totalDays > 1 ? 's' : ''}</span>
                  </div>
                  <div className="abm-price-row">
                    <span>{t('admin.bookingModal.preview.basePrice')}</span>
                    <span>{preview.basePrice.toFixed(2)} DH</span>
                  </div>
                  {preview.totalDiscount > 0 && (
                    <div className="abm-price-row discount">
                      <span>{t('admin.bookingModal.preview.discount', { percent: preview.totalDiscount })}</span>
                      <span>-{(preview.basePrice - preview.finalPrice).toFixed(2)} DH</span>
                    </div>
                  )}
                  <div className="abm-price-row total">
                    <span>{t('admin.bookingModal.preview.total')}</span>
                    <span>{preview.finalPrice.toFixed(2)} DH</span>
                  </div>
                </div>
              )}
            </div>

            {error && <div className="abm-error">{error}</div>}
          </div>

          {/* ── Footer ── */}
          <div className="modal-footer-glass">
            <button type="button" className="btn-cancel-flat" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save-glow" disabled={loading}>
              {loading ? t('admin.bookingModal.buttons.processing') : t('admin.bookingModal.buttons.createBooking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBookingModal;

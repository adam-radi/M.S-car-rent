import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllBookings, updateBookingStatus, downloadInvoice } from '../api/bookingApi';
import AdminBookingModal from '../components/AdminBookingModal';
import AdminSelect from '../components/AdminSelect';

import '../styles/ManageBookings.css';
import '../styles/ManageBookings_Extra.css';

import { FaSearch, FaPlus, FaFileInvoice, FaArrowRight } from 'react-icons/fa';


const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#744210', bg: '#fefcbf' },
  { value: 'confirmed', label: 'Confirmed', color: '#22543d', bg: '#c6f6d5' },
  { value: 'active', label: 'Active', color: '#2a4365', bg: '#bee3f8' },
  { value: 'completed', label: 'Completed', color: '#2d3748', bg: '#e2e8f0' },
  { value: 'cancelled', label: 'Cancelled', color: '#742a2a', bg: '#fed7d7' },
  { value: 'rejected', label: 'Rejected', color: '#742a2a', bg: '#fed7d7' }
];

const ManageBookings = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingBooking, setEditingBooking] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    employeeNotes: '',
    manualDiscount: 0,
    paymentStatus: 'unpaid'
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createGuestPrefill, setCreateGuestPrefill] = useState(null);

  const statusOptions = STATUS_OPTIONS.map((option) => ({
    ...option,
    label: t(`admin.bookingStatus.${option.value}`),
  }));

  const paymentStatusOptions = [
    { value: 'unpaid', label: t('admin.paymentStatus.unpaid') },
    { value: 'partial', label: t('admin.paymentStatus.partial') },
    { value: 'paid', label: t('admin.paymentStatus.paid') },
  ];

  const filterOptions = [
    { value: 'all', label: t('admin.manageBookings.filterAll') },
    ...statusOptions,
  ];

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getAllBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (!bookings.length) return;

    const params = new URLSearchParams(location.search);
    const bookingId = params.get('bookingId');
    const action = params.get('action');
    const create = params.get('create');
    const cin = params.get('cin');
    const phone = params.get('phone');

    if (create === '1') {
      setCreateGuestPrefill({
        fullName: '',
        cin: (cin || '').toUpperCase(),
        phone: phone || '',
        email: ''
      });
      setShowCreateModal(true);
    }

    if (!bookingId) return;

    const targetBooking = bookings.find((booking) => booking._id === bookingId);
    if (!targetBooking) return;

    setSearchTerm(bookingId);
    openUpdateModal(targetBooking, action === 'cancel' ? 'cancelled' : targetBooking.status);
  }, [bookings, location.search]);

  const openUpdateModal = (booking, newStatus) => {
    setEditingBooking(booking);
    setUpdateForm({
      status: newStatus,
      employeeNotes: booking.employeeNotes || '',
      manualDiscount: booking.manualDiscount || 0,
      paymentStatus: booking.paymentStatus || 'unpaid'
    });
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await updateBookingStatus(editingBooking._id, updateForm);
      if (res.success) {
        setBookings(prev => 
          prev.map(b => b._id === editingBooking._id ? { ...b, ...res.data } : b)
        );
        setEditingBooking(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const blob = await downloadInvoice(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert(t('admin.manageBookings.alerts.downloadInvoiceFailed'));
    }
  };


  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === 'all' || b.status === filter;
    
    const searchStr = searchTerm.toLowerCase();
    const customerName = `${b.customer?.firstName || b.guestInfo?.fullName || 'Guest'} ${b.customer?.lastName || ''}`.toLowerCase();
    const customerEmail = b.customer?.email?.toLowerCase() || '';
    const carName = `${b.car?.brand} ${b.car?.model}`.toLowerCase();
    const bookingId = b._id?.toLowerCase() || '';
    const guestCin = b.guestInfo?.cin?.toLowerCase() || '';
    
    const matchesSearch = !searchTerm || 
      customerName.includes(searchStr) || 
      customerEmail.includes(searchStr) || 
      carName.includes(searchStr) ||
      bookingId.includes(searchStr) ||
      guestCin.includes(searchStr);

    return matchesStatus && matchesSearch;
  });


  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="manage-bookings admin-page-padding">
      <div className="manage-header">
        <div className="header-left">
          <h1>{t('admin.manageBookings.title')}</h1>
          <p>{t('admin.manageBookings.subtitle')}</p>
        </div>
        
        <div className="header-right">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder={t('admin.manageBookings.searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group-admin">
            <label>{t('admin.manageBookings.filterLabel')}</label>
            <AdminSelect
              name="filter"
              value={filter}
              onChange={(name, val) => setFilter(val)}
              options={filterOptions}
              className="filter-admin-select"
            />
          </div>

          <button className="btn-new-booking-glass" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> {t('admin.manageBookings.buttons.directEntry')}
          </button>
        </div>
      </div>


      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.manageBookings.tableHeaders.customer')}</th>
              <th>{t('admin.manageBookings.tableHeaders.vehicle')}</th>
              <th>{t('admin.manageBookings.tableHeaders.dates')}</th>
              <th>{t('admin.manageBookings.tableHeaders.total')}</th>
              <th>{t('admin.manageBookings.tableHeaders.status')}</th>
              <th>{t('admin.manageBookings.tableHeaders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <div className="customer-info">
                    <strong>{booking.customer ? `${booking.customer?.firstName} ${booking.customer?.lastName}` : (booking.guestInfo?.fullName || t('admin.manageBookings.guestClient'))}</strong>
                    <span>{booking.customer?.email || booking.guestInfo?.email || booking.guestInfo?.cin || t('admin.manageBookings.noEmail')}</span>
                  </div>
                </td>
                <td>{booking.car?.brand} {booking.car?.model}</td>
                <td>
                  <div className="date-cell">
                    {formatDate(booking.startDate)}
                    <FaArrowRight className="arrow-icon" />
                    {formatDate(booking.endDate)}
                  </div>
                </td>
                <td className="price-text">${booking.finalPrice?.toFixed(2)}</td>
                <td>
                  <span 
                    className="status-pill"
                    style={{ 
                      backgroundColor: STATUS_OPTIONS.find(s => s.value === booking.status)?.bg,
                      color: STATUS_OPTIONS.find(s => s.value === booking.status)?.color
                    }}
                  >
                    {t(`admin.bookingStatus.${booking.status}`)}
                  </span>
                </td>
                <td className="actions">
                  <AdminSelect
                    name="status"
                    value={booking.status}
                    onChange={(name, val) => openUpdateModal(booking, val)}
                    options={statusOptions}
                    className="row-status-select"
                  />
                  {booking.status === 'completed' && (
                    <button 
                      className="btn-invoice" 
                      onClick={() => handleDownloadInvoice(booking._id)}
                      title={t('admin.manageBookings.downloadInvoiceTitle')}
                    >
                      <FaFileInvoice />
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="no-data">{t('admin.manageBookings.emptyState')}</div>
        )}
      </div>

      {editingBooking && (
        <div className="modal-backdrop abm-backdrop">
          <div className="modal-box abm-box" style={{ maxWidth: '500px' }}>
            <div className="modal-head">
              <div className="modal-title-group">
                <div>
                  <h2>{t('admin.manageBookings.modal.title', { bookingCode: editingBooking._id.slice(-6) })}</h2>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setEditingBooking(null)}>&times;</button>
            </div>
            <div className="abm-form-body" style={{ padding: '1.5rem 2.5rem' }}>
              <div className="abm-section">
                <div className="input-field">
                  <label>{t('admin.manageBookings.modal.fields.status')}</label>
                  <AdminSelect
                    name="status"
                    value={updateForm.status}
                    onChange={(name, val) => setUpdateForm({...updateForm, status: val})}
                    options={statusOptions}
                  />
                </div>

                <div className="input-field">
                  <label>{t('admin.manageBookings.modal.fields.manualDiscount')}</label>
                  <input 
                    type="number" 
                    className="clean-input"
                    value={updateForm.manualDiscount} 
                    onChange={(e) => setUpdateForm({...updateForm, manualDiscount: e.target.value})}
                    min="0"
                    max="100"
                  />
                  <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '4px' }}>{t('admin.manageBookings.modal.hint.manualDiscount')}</small>
                </div>

                <div className="input-field">
                  <label>{t('admin.manageBookings.modal.fields.paymentStatus')}</label>
                  <AdminSelect
                    name="paymentStatus"
                    value={updateForm.paymentStatus}
                    onChange={(name, val) => setUpdateForm({...updateForm, paymentStatus: val})}
                    options={paymentStatusOptions}
                  />
                </div>

                <div className="input-field">
                  <label>{t('admin.manageBookings.modal.fields.notes')}</label>
                  <textarea 
                    className="clean-input"
                    value={updateForm.employeeNotes} 
                    onChange={(e) => setUpdateForm({...updateForm, employeeNotes: e.target.value})}
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer-glass">
              <button className="btn-cancel-flat" onClick={() => setEditingBooking(null)}>{t('admin.common.cancel')}</button>
              <button className="btn-save-glow" onClick={handleStatusUpdate}>{t('admin.manageBookings.modal.buttons.confirmChanges')}</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <AdminBookingModal 
          onClose={() => setShowCreateModal(false)}
          initialGuestInfo={createGuestPrefill}
          onSuccess={(newBooking) => {
            setBookings([newBooking, ...bookings]);
            setShowCreateModal(false);
            setCreateGuestPrefill(null);
          }}
        />
      )}
    </div>
  );
};


export default ManageBookings;

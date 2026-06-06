import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { 
  FiUser, 
  FiShield, 
  FiCheckCircle, 
  FiXCircle, 
  FiPercent, 
  FiX
} from 'react-icons/fi';
import './ManageUsers.css';

const ManageUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Discount Modal States
  const [editingUser, setEditingUser] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);

  // User Details Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('customer');
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Filter State
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'customer', 'employee', 'admin'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/api/auth/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = async (userToUpdate, value) => {
    try {
      const res = await axiosInstance.patch(`/api/auth/users/${userToUpdate._id}/discount`, {
        personalDiscount: Number(value)
      });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userToUpdate._id ? { ...u, personalDiscount: Number(value) } : u));
        setEditingUser(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating discount');
    }
  };

  const handleUpdateUserDetails = async () => {
    try {
      setIsSavingDetails(true);
      const res = await axiosInstance.patch(`/api/auth/users/${selectedUser._id}`, {
        role: editRole,
        isActive: editIsActive
      });
      if (res.data.success) {
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: editRole, isActive: editIsActive } : u));
        setSelectedUser(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user details');
    } finally {
      setIsSavingDetails(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  // Calculate counts dynamically
  const totalCount = users.length;
  const customerCount = users.filter(u => u.role === 'customer').length;
  const employeeCount = users.filter(u => u.role === 'employee').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Filter users based on tab
  const filteredUsers = users.filter(u => {
    if (selectedTab === 'all') return true;
    return u.role === selectedTab;
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t('admin.manageUsers.notSpecified');
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setEditRole(user.role || 'customer');
    setEditIsActive(user.isActive !== undefined ? user.isActive : true);
  };

  return (
    <div className="manage-users admin-page-padding">
      <div className="manage-header">
        <div>
          <h1>{t('admin.manageUsers.title')}</h1>
          <p>{t('admin.manageUsers.subtitle')}</p>
        </div>
      </div>

      {/* Modern Role Filter Tabs */}
      <div className="user-tabs-container">
        <button 
          className={`user-tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          {t('admin.manageUsers.tabs.all')} <span>{totalCount}</span>
        </button>
        <button 
          className={`user-tab-btn ${selectedTab === 'customer' ? 'active' : ''}`}
          onClick={() => setSelectedTab('customer')}
        >
          {t('admin.manageUsers.tabs.customers')} <span>{customerCount}</span>
        </button>
        <button 
          className={`user-tab-btn ${selectedTab === 'employee' ? 'active' : ''}`}
          onClick={() => setSelectedTab('employee')}
        >
          {t('admin.manageUsers.tabs.employees')} <span>{employeeCount}</span>
        </button>
        <button 
          className={`user-tab-btn ${selectedTab === 'admin' ? 'active' : ''}`}
          onClick={() => setSelectedTab('admin')}
        >
          {t('admin.manageUsers.tabs.admins')} <span>{adminCount}</span>
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.manageUsers.tableHeaders.user')}</th>
              <th>{t('admin.manageUsers.tableHeaders.email')}</th>
              <th>{t('admin.manageUsers.tableHeaders.phone')}</th>
              <th>{t('admin.manageUsers.tableHeaders.role')}</th>
              <th>{t('admin.manageUsers.tableHeaders.status')}</th>
              <th>{t('admin.manageUsers.tableHeaders.discount')}</th>
              <th>{t('admin.manageUsers.tableHeaders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr 
                key={user._id} 
                className="user-row-clickable"
                onClick={() => openDetailsModal(user)}
              >
                <td>
                  <div className="user-profile-cell">
                    <div className="user-avatar-small">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <strong className="user-fullname">{user.firstName} {user.lastName}</strong>
                      <span className="user-joined">Inscrit le {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </td>
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`user-role-badge role-${user.role}`}>
                    <FiShield className="role-icon" />
                    {user.role === 'admin' ? 'Admin' : user.role === 'employee' ? 'Employé' : 'Client'}
                  </span>
                </td>
                <td>
                  <span className={`user-status-pill ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? (
                      <>
                        <FiCheckCircle className="status-icon" /> {t('admin.manageUsers.status.active')}
                      </>
                    ) : (
                      <>
                        <FiXCircle className="status-icon" /> {t('admin.manageUsers.status.inactive')}
                      </>
                    )}
                  </span>
                </td>
                <td>
                  <span className={`discount-pill ${user.personalDiscount > 0 ? 'active' : ''}`}>
                    {user.personalDiscount || 0}%
                  </span>
                </td>
                <td>
                  <div className="action-buttons-group" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn-edit-discount" 
                      onClick={() => {
                        setEditingUser(user);
                        setDiscountValue(user.personalDiscount || 0);
                      }}
                    >
                      {t('admin.manageUsers.buttons.setDiscount')}
                    </button>
                    <button 
                      className="btn-view-details"
                      onClick={() => openDetailsModal(user)}
                    >
                      {t('admin.manageUsers.buttons.viewDetails')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="no-data">{t('admin.manageUsers.emptyState')}</div>
        )}
      </div>

      {/* Set Loyalty Discount Modal (Simple style b7al Booking Details) */}
      {editingUser && (
        <div className="modal-backdrop abm-backdrop" onClick={() => setEditingUser(null)}>
          <div className="modal-box crm-modal-box" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <FiPercent />
                </div>
                <div>
                  <h2>{t('admin.manageUsers.discountModal.title')}</h2>
                  <p>{t('admin.manageUsers.discountModal.subtitle', { name: `${editingUser.firstName} ${editingUser.lastName}` })}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setEditingUser(null)}>
                <FiX />
              </button>
            </div>
            
            <div className="crm-modal-body">
              <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Pourcentage de remise (%)
                </label>
                <input 
                  type="number" 
                  className="clean-input"
                  value={discountValue} 
                  onChange={(e) => setDiscountValue(e.target.value)}
                  min="0"
                  max="100"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 16px', borderRadius: '12px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            
            <div className="modal-footer-glass" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2.5rem' }}>
              <button className="btn-cancel-flat" onClick={() => setEditingUser(null)}>Annuler</button>
              <button 
                className="btn-save-glow" 
                style={{ backgroundColor: '#10b981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
                onClick={() => handleUpdateDiscount(editingUser, discountValue)}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal (Simple style b7al Booking Details) */}
      {selectedUser && (
        <div className="modal-backdrop abm-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-box crm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <FiUser />
                </div>
                <div>
                  <h2>{t('admin.manageUsers.detailsModal.title')}</h2>
                  <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setSelectedUser(null)}>
                <FiX />
              </button>
            </div>

            <div className="crm-modal-body">
              <div className="crm-detail-grid" style={{ marginBottom: '2rem' }}>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.email')}</span>
                  <strong>{selectedUser.email || '-'}</strong>
                </div>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.phone')}</span>
                  <strong>{selectedUser.phone || '-'}</strong>
                </div>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.cin')}</span>
                  <strong>{selectedUser.cin || '-'}</strong>
                </div>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.license')}</span>
                  <strong>{selectedUser.licenseNumber || '-'}</strong>
                </div>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.memberSince')}</span>
                  <strong>{formatDate(selectedUser.createdAt)}</strong>
                </div>
                <div>
                  <span>{t('admin.manageUsers.detailsModal.loyaltyDiscount')}</span>
                  <strong>{selectedUser.personalDiscount ? `${selectedUser.personalDiscount}%` : '0%'}</strong>
                </div>
              </div>

              <div className="crm-notes-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display: 'block', marginBottom: '1.2rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Administration des Droits
                </span>
                
                {/* Role Dropdown */}
                <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold' }}>{t('admin.manageUsers.detailsModal.roleLabel')}</label>
                  <select 
                    className="clean-input" 
                    value={editRole} 
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="customer">{t('admin.manageUsers.roles.customer')}</option>
                    <option value="employee">{t('admin.manageUsers.roles.employee')}</option>
                    <option value="admin">{t('admin.manageUsers.roles.admin')}</option>
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="input-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold' }}>{t('admin.manageUsers.detailsModal.statusLabel')}</label>
                  <select 
                    className="clean-input" 
                    value={editIsActive ? 'active' : 'inactive'} 
                    onChange={(e) => setEditIsActive(e.target.value === 'active')}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}
                  >
                    <option value="active">{t('admin.manageUsers.detailsModal.statusActive')}</option>
                    <option value="inactive">{t('admin.manageUsers.detailsModal.statusInactive')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer-glass" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2.5rem' }}>
              <button className="btn-cancel-flat" onClick={() => setSelectedUser(null)}>Annuler</button>
              <button 
                className="btn-save-glow" 
                onClick={handleUpdateUserDetails}
                disabled={isSavingDetails}
                style={{ backgroundColor: '#10b981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
              >
                {isSavingDetails ? t('admin.manageUsers.detailsModal.saving') : t('admin.manageUsers.detailsModal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;

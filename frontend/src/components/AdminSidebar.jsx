import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGrid, FiCalendar, FiUsers, FiTool, FiShield, FiMail, FiActivity, FiSearch } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';
// import logo from '../assets/logo_transparent.png';
import { useAuth } from '../hooks/useAuth';

const AdminSidebar = ({ isOpen = false, onNavigate }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        {/* <div className="logo-wrapper-sidebar">
          <img src={logo} alt="M.S Car Logo" className="sidebar-logo-img" />
        </div>
        <h2>M.S ADMIN</h2> */}
      </div>
      
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiGrid className="icon" /> <span>{t('admin.sidebar.dashboard')}</span>
        </NavLink>
        <NavLink
          to="/admin/cars"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FaCarSide className="icon" /> <span>{t('admin.sidebar.fleet')}</span>
        </NavLink>
        <NavLink
          to="/admin/bookings"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiCalendar className="icon" /> <span>{t('admin.sidebar.bookings')}</span>
        </NavLink>
        <NavLink
          to="/admin/clients"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiSearch className="icon" /> <span>{t('admin.sidebar.clients')}</span>
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            onClick={onNavigate}
          >
            <FiUsers className="icon" /> <span>{t('admin.sidebar.users')}</span>
          </NavLink>
        )}
        <NavLink
          to="/admin/maintenance"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiTool className="icon" /> <span>{t('admin.sidebar.maintenance')}</span>
        </NavLink>
        <NavLink
          to="/admin/fleet-health"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiActivity className="icon" /> <span>{t('admin.sidebar.fleetHealth')}</span>
        </NavLink>
        <NavLink
          to="/admin/documents"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiShield className="icon" /> <span>{t('admin.sidebar.verification')}</span>
        </NavLink>
        
        <NavLink
          to="/admin/messages"
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          onClick={onNavigate}
        >
          <FiMail className="icon" /> <span>{t('admin.sidebar.messages')}</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <p>{t('admin.sidebar.systemOnline')}</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

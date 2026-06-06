import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navbar.css';

import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = role === 'admin' || role === 'employee';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleNavClick}>
          <div className="logo-wrapper">
            <img src={logo} alt="M.S Car Logo" className="logo-image" />
          </div>
          <span className="brand-name">M.S Cars</span>
        </Link>


        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links-center">
            
            <Link 
              to="/cars" 
              className={`nav-link ${isActive('/cars') ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              {t('navbar.cars')}
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              {t('navbar.about')}
            </Link>
            <a 
              href="/#contact" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                if (window.location.pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 500);
                }
              }}
            >
              
              {t('navbar.contact')}
            </a>
            {isAuthenticated && !isAdmin && (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  {t('navbar.myBookings')}
                </Link>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  {t('navbar.profile')}
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <div className="admin-nav-group">
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  {t('navbar.dashboard')}
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-auth-right">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="user-section">
                <NotificationBell />
                <span className="user-name">
                  {t('navbar.hiUser', { name: user?.firstName || t('navbar.userFallback') })}
                </span>
                <button className="btn-logout" onClick={handleLogout}>{t('navbar.logout')}</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login" onClick={handleNavClick}>{t('navbar.login')}</Link>
                <Link to="/register" className="btn-register" onClick={handleNavClick}>{t('navbar.register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

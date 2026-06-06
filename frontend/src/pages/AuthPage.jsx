import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { loginUser, registerUser } from '../api/authApi';
import loginBg from '../assets/login.png';
import registerBg from '../assets/register.png'; // Using this as a placeholder for register bg
import logoTransparent from '../assets/logo_transparent.png';
import { FiMail, FiLock, FiUser, FiPhone, FiCreditCard, FiHash, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/Auth.css';

const AuthPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegisterRoute = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterRoute);
  const [animating, setAnimating] = useState(false);

  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', cin: '', licenseNumber: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const shouldBeRegister = location.pathname === '/register';
    if (shouldBeRegister !== isRegister) {
      triggerSwitch(shouldBeRegister ? 'to-register' : 'to-login', false);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const triggerSwitch = (dir, updateRoute = true) => {
    if (animating) return;
    setError(null);
    setAnimating(true);

    setTimeout(() => {
      const goRegister = dir === 'to-register';
      setIsRegister(goRegister);
      if (updateRoute) {
        navigate(goRegister ? '/register' : '/login', { replace: true });
      }
      setAnimating(false);
    }, 500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(loginData);
      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(registerData);
      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegChange = (e) => {
    setRegisterData({ ...registerData, [e.target.id]: e.target.value });
  };

  return (
    <div className="auth-page">
      {/* ── Full-Page Background Layers ── */}
      <div
        className={`auth-bg-layer ${!isRegister ? 'active' : ''}`}
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div
        className={`auth-bg-layer-register ${isRegister ? 'active' : ''}`}
        style={{ backgroundImage: `url(${registerBg})` }}
      />

      {/* Overlay to ensure readability */}
      <div className="auth-global-overlay" />

      <div className="auth-split-wrapper">
        {/* ── Left Side: Brand Info ── */}
        <div className="auth-info-side">
          <div className="auth-info-content">
            <div className="auth-info-badge">
              <span>{isRegister ? t('auth.badgeRegister') : t('auth.badgeLogin')}</span>
            </div>
            <div className='auth-info-body'>
              <h1>
                {isRegister ? (
                  <>
                    {t('auth.headlineRegister1')} <br />
                    <span className="highlight-text">{t('auth.headlineRegister2')}</span>
                  </>
                ) : (
                  <>
                    {t('auth.headlineLogin1')} <br />
                    <span className="highlight-text">{t('auth.headlineLogin2')}</span>
                  </>
                )}
              </h1>
              <p>
                {isRegister ? t('auth.infoRegister') : t('auth.infoLogin')}
              </p>



              <div className="auth-bg-dots">
                <span className={`dot ${!isRegister ? 'active' : ''}`} />
                <span className={`dot ${isRegister ? 'active' : ''}`} />
                <span className="dot" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Form ── */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            {/* Logo - Moved outside the panel to sit on top */}
            <div className="auth-logo">
              <img src={logoTransparent} alt="Rent Car" />
            </div>

            <div className={`auth-form-panel ${animating ? 'is-flipping' : ''}`}>
              {error && <div className="auth-error-msg">{error}</div>}

              {!isRegister ? (
                /* ── LOGIN FORM ── */
                <div className="auth-inner">
                  <h2>{t('auth.welcomeBack')}</h2>
                  <p className="auth-subtitle">{t('auth.signInSubtitle')}</p>

                  <form onSubmit={handleLoginSubmit} className="auth-form">
                    <div className="auth-field">
                      <label>{t('auth.phoneNumber')}</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon"><FiPhone size={16} /></span>
                        <input
                          type="tel"
                          id="login-phone"
                          value={loginData.phone}
                          onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                          placeholder={t('auth.phonePlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label>{t('auth.password')}</label>
                      <div className="auth-input-wrap">
                        <span className="auth-input-icon"><FiLock size={16} /></span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="login-password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-options">
                      <label className="auth-remember">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <span>{t('auth.rememberMe')}</span>
                      </label>
                      <button type="button" className="auth-forgot">{t('auth.forgotPassword')}</button>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                      {loading ? t('auth.signingIn') : t('auth.signIn')}
                    </button>
                  </form>

                  <p className="auth-switch-text">
                    {t('auth.noAccount')}{' '}
                    <button onClick={() => triggerSwitch('to-register')} className="auth-switch-link">
                      {t('auth.signUp')}
                    </button>
                  </p>

                  {/* ── Brand Icons Footer ── */}
                  <div className="auth-card-footer">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg" alt="mercedes" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg" alt="audi" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg" alt="bmw" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg" alt="tesla" />
                  </div>
                </div>
              ) : (
                /* ── REGISTER FORM ── */
                <div className="auth-inner register-inner">
                  <h2>{t('auth.createAccount')}</h2>
                  <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

                  <form onSubmit={handleRegisterSubmit} className="auth-form">
                    <div className="auth-row">
                      <div className="auth-field">
                        <label>{t('auth.firstName')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiUser size={16} /></span>
                          <input type="text" id="firstName" value={registerData.firstName} onChange={handleRegChange} placeholder={t('auth.firstNamePlaceholder')} required />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label>{t('auth.lastName')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiUser size={16} /></span>
                          <input type="text" id="lastName" value={registerData.lastName} onChange={handleRegChange} placeholder={t('auth.lastNamePlaceholder')} required />
                        </div>
                      </div>
                    </div>

                    <div className="auth-row">
                      <div className="auth-field">
                        <label>{t('auth.email')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiMail size={16} /></span>
                          <input type="email" id="email" value={registerData.email} onChange={handleRegChange} placeholder={t('auth.emailPlaceholder')} />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label>{t('auth.phoneNumber')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiPhone size={16} /></span>
                          <input type="tel" id="phone" value={registerData.phone} onChange={handleRegChange} placeholder={t('auth.phonePlaceholder')} required />
                        </div>
                      </div>
                    </div>

                    <div className="auth-row">
                      <div className="auth-field">
                        <label>{t('auth.cin')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiCreditCard size={16} /></span>
                          <input type="text" id="cin" value={registerData.cin} onChange={handleRegChange} placeholder={t('auth.cinPlaceholder')} />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label>{t('auth.licenseNumber')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiHash size={16} /></span>
                          <input type="text" id="licenseNumber" value={registerData.licenseNumber} onChange={handleRegChange} placeholder={t('auth.licensePlaceholder')} />
                        </div>
                      </div>
                    </div>

                    <div className="auth-row">
                      <div className="auth-field">
                        <label>{t('auth.password')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiLock size={16} /></span>
                          <input type="password" id="password" value={registerData.password} onChange={handleRegChange} placeholder={t('auth.passwordPlaceholder')} required />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label>{t('auth.confirmPassword')}</label>
                        <div className="auth-input-wrap">
                          <span className="auth-input-icon"><FiLock size={16} /></span>
                          <input type="password" id="confirmPassword" value={registerData.confirmPassword} onChange={handleRegChange} placeholder={t('auth.confirmPasswordPlaceholder')} required />
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                      {loading ? t('auth.creatingAccount') : t('auth.signUpSubmit')}
                    </button>
                  </form>

                  <p className="auth-switch-text">
                    {t('auth.haveAccount')}{' '}
                    <button onClick={() => triggerSwitch('to-login')} className="auth-switch-link">
                      {t('auth.loginLink')}
                    </button>
                  </p>

                  <div className="auth-card-footer">
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg" alt="mercedes" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/audi.svg" alt="audi" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg" alt="bmw" />
                    <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg" alt="tesla" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

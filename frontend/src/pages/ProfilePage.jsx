import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getMyDocuments, uploadDocument } from '../api/documentApi';
import { updatePassword } from '../api/authApi';
import { FaTimes, FaLock, FaKey } from 'react-icons/fa';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await getMyDocuments();
      if (res.success) setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError(t('profile.selectFile'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'drivers_license');

    try {
      const res = await uploadDocument(formData);
      if (res.success) {
        setSuccess(t('profile.uploadSuccess'));
        setFile(null);
        fetchDocs();
      }
    } catch (err) {
      setError(err.response?.data?.message || t('profile.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('profile.passwordFieldsRequired') || 'All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('profile.passwordMismatch') || 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(t('profile.passwordTooShort') || 'Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePassword({
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.success) {
        setPasswordSuccess(t('profile.passwordChangeSuccess') || 'Password changed successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 1500);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || t('profile.passwordChangeError') || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Ice Particles Effect */}
      <div className="ice-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="ice-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`
            }}
          />
        ))}
      </div>

      <div className="profile-header">
        <h1>{t('profile.title')}</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section card">
          <h2>{t('profile.personalInfo')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('profile.fullName')}</label>
              <p>{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="info-item">
              <label>{t('profile.email')}</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>{t('profile.phone')}</label>
              <p>{user?.phoneNumber || user?.phone || t('profile.notProvided')}</p>
            </div>
            <div className="info-item">
              <label>{t('profile.memberSince')}</label>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section card">
          <h2>{t('profile.licenseSection')}</h2>
          <p className="section-hint">{t('profile.licenseHint')}</p>

          <div className="document-list">
            {documents.map((doc) => (
              <div key={doc._id} className={`document-item ${doc.status}`}>
                <div className="doc-icon">📇</div>
                <div className="doc-info">
                  <span className="doc-name">{doc.type.replace('_', ' ').toUpperCase()}</span>
                  <span className="doc-date">
                    {t('profile.uploadedOn', { date: new Date(doc.createdAt).toLocaleDateString() })}
                  </span>
                </div>
                <span className={`doc-status ${doc.status}`}>
                  {t(`profile.docStatus.${doc.status}`, { defaultValue: doc.status })}
                </span>
              </div>
            ))}
          </div>

          <form className="upload-form" onSubmit={handleUpload}>
            <h3>{t('profile.uploadNew')}</h3>
            {error && <div className="alert error">{error}</div>}
            {success && <div className="alert success">{success}</div>}
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
              <button type="submit" disabled={uploading || !file}>
                {uploading ? t('profile.uploading') : t('profile.uploadLicense')}
              </button>
            </div>
            <small>{t('profile.formatsHint')}</small>
          </form>

          <button className="btn-change-password-trigger" onClick={() => setShowPasswordModal(true)}>
            <FaLock /> {t('profile.changePassword')}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle"><FaKey /></div>
                <div>
                  <h2>{t('profile.changePassword')}</h2>
                  <p>{t('profile.securePassword') || 'Update your password to keep your account secure'}</p>
                </div>
              </div>
              <button className="close-btn-circle" onClick={() => setShowPasswordModal(false)} type="button"><FaTimes /></button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-modal-form">
              <div className="form-body">
                {passwordError && <div className="alert error">{passwordError}</div>}
                {passwordSuccess && <div className="alert success">{passwordSuccess}</div>}

                <div className="input-field">
                  <label>{t('profile.currentPassword')}</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder={t('profile.enterCurrentPassword')}
                    disabled={passwordLoading}
                    className="clean-input"
                  />
                </div>

                <div className="input-field">
                  <label>{t('profile.newPassword')}</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder={t('profile.enterNewPassword')}
                    disabled={passwordLoading}
                    className="clean-input"
                  />
                </div>

                <div className="input-field">
                  <label>{t('profile.confirmNewPassword')}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder={t('profile.confirmNewPassword')}
                    disabled={passwordLoading}
                    className="clean-input"
                  />
                </div>
              </div>

              <div className="modal-footer-glass">
                <button type="button" className="btn-cancel-flat" onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>
                  {t('profile.cancel')}
                </button>
                <button type="submit" className="btn-save-glow" disabled={passwordLoading}>
                  {passwordLoading ? t('profile.updating') : t('profile.updatePassword')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

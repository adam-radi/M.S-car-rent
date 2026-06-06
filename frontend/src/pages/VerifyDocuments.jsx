import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllDocuments, updateDocumentStatus } from '../api/documentApi';
import { FaTimes } from 'react-icons/fa';
import '../styles/VerifyDocuments.css';

const VerifyDocuments = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await getAllDocuments();
      if (res.success) setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await updateDocumentStatus(id, { status, notes });
      if (res.success) {
        setDocuments(prev => prev.map(d => d._id === id ? { ...d, status, notes } : d));
        setSelectedDoc(null);
        setNotes('');
      }
    } catch (err) {
      alert(t('admin.verifyDocuments.alerts.updateFailed'));
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="verify-documents admin-page-padding">
      <header className="manage-header">
        <h1>{t('admin.verifyDocuments.title')}</h1>
        <p>{t('admin.verifyDocuments.subtitle')}</p>
      </header>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.verifyDocuments.tableHeaders.user')}</th>
              <th>{t('admin.verifyDocuments.tableHeaders.documentType')}</th>
              <th>{t('admin.verifyDocuments.tableHeaders.status')}</th>
              <th>{t('admin.verifyDocuments.tableHeaders.uploaded')}</th>
              <th>{t('admin.verifyDocuments.tableHeaders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc._id}>
                <td>
                  <strong>{doc.user?.firstName} {doc.user?.lastName}</strong>
                  <div className="sub-text">{doc.user?.email}</div>
                </td>
                <td>{t(`admin.verifyDocuments.documentType.${doc.type}`)}</td>
                <td>
                  <span className={`status-pill ${doc.status}`}>{t(`admin.verifyDocuments.status.${doc.status}`)}</span>
                </td>
                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-view" onClick={() => setSelectedDoc(doc)}>{t('admin.verifyDocuments.buttons.review')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{t('admin.verifyDocuments.reviewTitle', { name: selectedDoc.user?.firstName })}</h2>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}><FaTimes /></button>
            </div>

            <div className="review-layout">
              <div className="document-preview">
                {selectedDoc.fileUrl.endsWith('.pdf') ? (
                  <embed src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/${selectedDoc.fileUrl}`} width="100%" height="500px" type="application/pdf" />
                ) : (
                  <img src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/${selectedDoc.fileUrl}`} alt={t('admin.verifyDocuments.documentPreviewAlt')} />
                )}
              </div>

              <div className="review-actions-panel">
                <div className="user-summary">
                  <h3>{t('admin.verifyDocuments.userDetails')}</h3>
                  <p><strong>{t('admin.verifyDocuments.labels.name')}:</strong> {selectedDoc.user?.firstName} {selectedDoc.user?.lastName}</p>
                  <p><strong>{t('admin.verifyDocuments.labels.phone')}:</strong> {selectedDoc.user?.phoneNumber || t('admin.verifyDocuments.noPhone')}</p>
                </div>

                <div className="notes-section">
                  <label>{t('admin.verifyDocuments.labels.verificationNotes')}</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder={t('admin.verifyDocuments.placeholders.notes')}
                    rows="4"
                  ></textarea>
                </div>

                <div className="action-buttons">
                  <button className="btn-approve" onClick={() => handleAction(selectedDoc._id, 'verified')}>
                    {t('admin.verifyDocuments.buttons.approve')}
                  </button>
                  <button className="btn-reject" onClick={() => handleAction(selectedDoc._id, 'rejected')}>
                    {t('admin.verifyDocuments.buttons.reject')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyDocuments;

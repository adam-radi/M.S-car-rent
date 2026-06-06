import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactMessages } from '../api/contactApi';
import axiosInstance from '../api/axiosInstance';
import { FaEnvelopeOpen } from 'react-icons/fa';
import '../styles/ManageMessages.css';

const ManageMessages = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/api/contact/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm(t('admin.manageMessages.confirmDelete'))) return;
    try {
      await axiosInstance.delete(`/api/contact/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner"></div></div>;

  return (
    <div className="manage-messages admin-page-padding">
      <div className="manage-header">
        <h1>{t('admin.manageMessages.title')}</h1>
        <p>{t('admin.manageMessages.subtitle')}</p>
      </div>

      <div className="messages-layout">
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">{t('admin.manageMessages.emptyState')}</div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg._id} 
                className={`message-item ${msg.read ? 'read' : 'unread'} ${selectedMessage?._id === msg._id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.read) handleMarkAsRead(msg._id);
                }}
              >
                <div className="msg-header">
                  <span className="msg-name">{msg.name}</span>
                  <span className="msg-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="msg-subject">{msg.email}</div>
                <p className="msg-preview">{msg.message.substring(0, 60)}...</p>
                {!msg.read && <span className="unread-dot"></span>}
              </div>
            ))
          )}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <div className="detail-content">
              <div className="detail-header">
                <div>
                  <h2>{selectedMessage.name}</h2>
                  <p>{selectedMessage.email} • {selectedMessage.phone || t('admin.manageMessages.noPhone')}</p>
                </div>
                <div className="detail-actions">
                  <button className="btn-delete" onClick={() => handleDeleteMessage(selectedMessage._id)}>{t('admin.manageMessages.buttons.delete')}</button>
                </div>
              </div>
              <div className="detail-body">
                <div className="msg-meta">
                  <span>{t('admin.manageMessages.sentOn')} {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>
                <div className="msg-content">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="detail-footer">
                <a href={`mailto:${selectedMessage.email}`} className="btn-reply">{t('admin.manageMessages.buttons.reply')}</a>
                {selectedMessage.phone && (
                   <a href={`https://wa.me/${selectedMessage.phone.replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="btn-whatsapp">{t('admin.manageMessages.buttons.whatsapp')}</a>
                )}
              </div>
            </div>
          ) : (
            <div className="detail-placeholder">
              <div className="icon"><FaEnvelopeOpen /></div>
              <p>{t('admin.manageMessages.placeholder')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;

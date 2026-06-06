import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notificationApi';
import { FaBell } from 'react-icons/fa';
import '../styles/NotificationBell.css';

const NotificationBell = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifTitle = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return t('notifications.bookingUpdate');
      case 'booking_cancelled':
        return t('notifications.bookingCancelled');
      case 'booking_request':
        return t('notifications.newBookingRequest');
      case 'maintenance_due':
        return t('notifications.maintenanceAlert');
      default:
        return t('notifications.defaultTitle');
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifs();
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button type="button" className="bell-button" onClick={handleToggle}>
        <FaBell className="bell-icon" />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllRead}>{t('notifications.markAllRead')}</button>
            )}
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifs">{t('notifications.empty')}</div>
            ) : (
              notifications.map((notif) => {
                let displayMessage = notif.message;
                try {
                  if (typeof notif.message === 'string' && notif.message.startsWith('{')) {
                    const parsed = JSON.parse(notif.message);
                    displayMessage = parsed.message || notif.message;
                  }
                } catch (e) {
                  /* ignore */
                }

                const title = getNotifTitle(notif.type);

                if (typeof displayMessage === 'string') {
                  if (displayMessage.match(/car (\{.*_id.*\}|[a-f0-9]{24})/i)) {
                    const matchStatus = displayMessage.match(/updated to (\w+)/);
                    const statusStr = matchStatus ? matchStatus[1] : 'updated';
                    displayMessage = t('notifications.statusUpdated', { status: statusStr });
                  }
                  if (displayMessage.match(/Booking #[a-f0-9]{24}/i)) {
                    displayMessage = displayMessage.replace(/#[a-f0-9]{24}/i, 'Booking ');
                  }
                }

                const words = title ? title.split(' ') : ['N', 'A'];
                const initials = words.slice(0, 2).map((w) => w?.[0] || '').join('').toUpperCase();

                return (
                  <div
                    key={notif._id}
                    className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
                    onClick={() => !notif.isRead && handleMarkRead(notif._id)}
                  >
                    <div className="notif-avatar">{initials || '🔔'}</div>
                    <div className="notif-content">
                      <div className="notif-content-header">
                        <span className="notif-title">{title}</span>
                        <span className="notif-time">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="notif-message">{displayMessage}</p>
                    </div>
                    {!notif.isRead && <span className="unread-dot"></span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

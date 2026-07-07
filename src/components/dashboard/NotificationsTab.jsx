import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../utils/axios';

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/auth/notifications');
        if (res.data.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/auth/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api.put('/auth/notifications/read-all');
      if (res.data.success) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        const res = await api.delete('/auth/notifications/clear-all');
        if (res.data.success) {
          setNotifications([]);
        }
      } catch (err) {
        console.error('Error clearing notifications:', err);
      }
    }
  };

  if (loading) return <div className="text-slate-400">Loading notifications...</div>;

  if (notifications.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
        <p className="text-slate-400">You are all caught up.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white">Notifications</h3>
        {notifications.length > 0 && (
          <div className="flex gap-3">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-secondary hover:text-white transition-colors"
            >
              Mark all as read
            </button>
            <button 
              onClick={handleClearAll}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border ${notif.is_read ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-secondary/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'}`}>
            <div className="flex justify-between items-start">
              <h4 className={`font-bold ${notif.is_read ? 'text-slate-300' : 'text-white'}`}>{notif.title}</h4>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{new Date(notif.created_at).toLocaleDateString()}</span>
                {!notif.is_read && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="w-2 h-2 rounded-full bg-secondary"
                    title="Mark as read"
                  ></button>
                )}
              </div>
            </div>
            <p className={`text-sm mt-1 ${notif.is_read ? 'text-slate-500' : 'text-slate-300'}`}>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;

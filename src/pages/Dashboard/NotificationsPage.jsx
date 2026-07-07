import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const NotificationsPage = ({ isAdmin = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/admin/notifications' : '/notifications';
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('token');
      const res = await api.get(`${endpoint}?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const endpoint = isAdmin ? `/admin/notifications/${id}/read` : `/notifications/${id}/read`;
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('token');
      await api.put(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      const endpoint = isAdmin ? '/admin/notifications/clear-all' : '/notifications/clear-all';
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('token');
      await api.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const content = (
    <>
      <div className="flex justify-between items-center mb-6">
        {isAdmin ? (
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">View system alerts and updates.</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Notification Center</h1>
              <p className="mt-1 text-slate-400">Stay updated with your latest alerts and account activities.</p>
            </div>
          </div>
        )}
        
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
          <p className="text-slate-400">No new notifications to display.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex gap-4 p-5 rounded-2xl border transition-all ${!notif.is_read ? 'bg-slate-800/40 border-secondary/30 shadow-md' : 'bg-slate-900/50 border-slate-800'}`}
            >
              <div className="flex-shrink-0 mt-1">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(notif.priority)} ${!notif.is_read ? 'shadow-[0_0_8px_rgba(var(--color-secondary),0.5)]' : 'opacity-50'}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                      {notif.category}
                    </span>
                    <h4 className={`text-lg mb-1 ${!notif.is_read ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{notif.message}</p>
                
                <div className="flex gap-4 mt-4">
                  {notif.action_url && (
                    <button 
                      onClick={() => navigate(notif.action_url)}
                      className="text-sm font-medium text-secondary hover:text-emerald-400 transition-colors flex items-center gap-1"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {!notif.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  if (isAdmin) {
    return <div className="max-w-6xl mx-auto">{content}</div>;
  }

  return (
    <div className="bg-slate-950 text-slate-300 font-sans min-h-screen pb-20 pt-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </main>
    </div>
  );
};

export default NotificationsPage;

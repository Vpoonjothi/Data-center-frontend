import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const NotificationBell = ({ isAdmin = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getApiConfig = () => {
    const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchNotifications = async () => {
    try {
      const endpoint = isAdmin ? '/admin/notifications' : '/notifications';
      const res = await api.get(`${endpoint}?limit=20`, getApiConfig());
      if (res.data?.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      const endpoint = isAdmin ? `/admin/notifications/${id}/read` : `/notifications/${id}/read`;
      await api.put(endpoint, {}, getApiConfig());
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const endpoint = isAdmin ? '/admin/notifications/read-all' : '/notifications/read-all';
      await api.put(endpoint, {}, getApiConfig());
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  const handleClearAll = async () => {
    setShowClearConfirm(false);
    try {
      const endpoint = isAdmin ? '/admin/notifications/clear-all' : '/notifications/clear-all';
      await api.delete(endpoint, getApiConfig());
      fetchNotifications();
    } catch (error) {
      console.error('Failed to clear notifications', error);
    }
  };

  const handleNotificationClick = async (notif, e) => {
    e.stopPropagation();
    if (!notif.is_read) {
      const endpoint = isAdmin ? `/admin/notifications/${notif.id}/read` : `/notifications/${notif.id}/read`;
      await api.put(endpoint, {}, getApiConfig()).catch(() => {});
      fetchNotifications();
    }
    setSelectedNotif(notif);
    setIsOpen(false);
  };

  const handleActionClick = (url, e) => {
    e.stopPropagation();
    setIsOpen(false);
    navigate(url);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white transition-colors focus:outline-none flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#0B1220]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[70px] left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-3 w-auto sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 sm:origin-top-right"
          >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-white">Notifications</h3>
              <div className="flex gap-3 text-xs">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-secondary hover:text-emerald-400 font-medium">
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={() => setShowClearConfirm(true)} className="text-slate-400 hover:text-red-400">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-300 font-medium">You're all caught up!</p>
                  <p className="text-slate-500 text-sm mt-1">No new notifications right now.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={(e) => handleNotificationClick(notif, e)}
                      className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer relative ${!notif.is_read ? 'bg-slate-800/20' : ''}`}
                    >
                      {!notif.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r"></div>
                      )}
                      
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notif.priority)}`}></div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{notif.category}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{getTimeAgo(notif.created_at)}</span>
                      </div>
                      
                      <h4 className={`text-sm mb-1 ${!notif.is_read ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {notif.message}
                      </p>

                      {!notif.is_read && (
                        <div className="mt-2 text-right">
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="text-[10px] font-medium text-slate-400 hover:text-white transition-colors px-2 py-1 bg-slate-800 rounded"
                          >
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center">
              <span className="text-xs text-slate-500">Scroll for more notifications</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNotif && (
          <div className="fixed top-20 right-4 z-[100] flex flex-col pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-[350px] relative pointer-events-auto"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedNotif(null); }}
                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2 mb-3 pr-8">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${getPriorityColor(selectedNotif.priority)}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedNotif.category}
                </span>
                <span className="text-[10px] text-slate-500 ml-auto font-medium">
                  {new Date(selectedNotif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <h3 className="text-sm font-bold text-white mb-2 leading-tight">{selectedNotif.title}</h3>
              
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedNotif.message}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Clear all notifications?</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Are you sure you want to permanently clear all your notifications? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-500/20"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

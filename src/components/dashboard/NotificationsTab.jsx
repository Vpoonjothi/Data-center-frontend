import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/auth/notifications');
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
      <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border ${notif.is_read ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-secondary/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'}`}>
            <div className="flex justify-between items-start">
              <h4 className={`font-bold ${notif.is_read ? 'text-slate-300' : 'text-white'}`}>{notif.title}</h4>
              <span className="text-xs text-slate-500">{new Date(notif.created_at).toLocaleDateString()}</span>
            </div>
            <p className={`text-sm mt-1 ${notif.is_read ? 'text-slate-500' : 'text-slate-300'}`}>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;

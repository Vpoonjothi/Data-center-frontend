import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../utils/axios';

const TimelineTab = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get('/auth/timeline');
        if (res.data.success) {
          setTimeline(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching timeline:', err);
        setError('Failed to load timeline events.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading timeline...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (timeline.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Timeline Events</h3>
        <p className="text-slate-400">Your customer lifecycle events will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Customer Timeline</h3>
      <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
        {timeline.map((event, idx) => (
          <div key={event.id} className="relative">
            <div className="absolute -left-[35px] top-1 w-4 h-4 bg-secondary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
              <span className="text-xs text-slate-500 font-mono mb-2 block">
                {new Date(event.created_at).toLocaleString()}
              </span>
              <h4 className="text-lg font-bold text-white mb-1">{event.event_title}</h4>
              <p className="text-slate-400 text-sm">{event.event_description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineTab;

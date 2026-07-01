import React from 'react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { label: 'Our Services', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Solutions', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { label: 'Data Centers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Contact Sales', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onActionClick && onActionClick(action.label)}
          className="relative flex items-center justify-start gap-3 p-3.5 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl hover:border-secondary/50 hover:bg-white hover:shadow-[0_4px_20px_-5px_rgba(37,99,235,0.15)] transition-all duration-300 focus:outline-none text-left group hover:-translate-y-0.5 overflow-hidden"
        >
          {/* Inner hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

          <div className="text-slate-400 group-hover:text-accent transition-colors duration-300 bg-slate-50 group-hover:bg-emerald-50 p-2 rounded-xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
            </svg>
          </div>
          <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;

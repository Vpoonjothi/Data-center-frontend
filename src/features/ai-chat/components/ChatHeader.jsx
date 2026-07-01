import React from 'react';

const ChatHeader = ({ onClose, onToggleExpand, isExpanded }) => {
  return (
    <div className="relative bg-transparent p-5 sm:rounded-t-[32px] flex items-center justify-between border-b border-slate-800 shrink-0 overflow-hidden">
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Animated Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
            <svg className="w-5 h-5 text-secondary drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          {/* Online Indicator */}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
        </div>
        
        <div>
          <h3 className="font-heading font-medium text-white text-[15px] tracking-wide">Greenleaf Copilot</h3>
          <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">Infrastructure Expert</span>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10">
        <button 
          onClick={onToggleExpand}
          className="text-slate-400 hover:text-white transition-all p-2 rounded-full hover:bg-white/10 hidden sm:block"
          aria-label={isExpanded ? "Minimize Chat" : "Expand Chat"}
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20V12h8M5 12h4m6 0h4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-all p-2 rounded-full hover:bg-white/10"
          aria-label="Close Chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

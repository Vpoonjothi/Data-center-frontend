import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  return (
    <>
      {/* The main chat window */}
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* The floating action button */}
      <div className="fixed z-50 bottom-4 right-4 sm:bottom-8 sm:right-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={toggleChat}
            className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] hover:shadow-[0_10px_50px_-10px_rgba(6,182,212,1)] border border-white/20 transition-all duration-300 focus:outline-none overflow-hidden group bg-slate-900"
            aria-label="Toggle AI Copilot"
          >
            {/* Animated Gradient Orb Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_#166E18_0%,_#0f172a_70%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Inner rotating gradient for copilot effect */}
            <motion.div 
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_#166E18_180deg,_transparent_360deg)] opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {isOpen ? (
              <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}

            {/* Premium Unread Badge */}
            {!isOpen && hasUnread && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
              </span>
            )}
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default ChatWidget;

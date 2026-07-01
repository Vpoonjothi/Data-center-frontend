import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ type, text }) => {
  if (type === 'SYSTEM_MESSAGE') {
    return (
      <div className="flex justify-center my-4">
        <span className="bg-slate-200/50 text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full tracking-wide">
          {text}
        </span>
      </div>
    );
  }

  const isUser = type === 'USER_MESSAGE';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar for Bot */}
        {!isUser && (
          <div className="w-8 h-8 rounded-[10px] bg-slate-900 flex-shrink-0 flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)] border border-slate-700/50">
            <svg className="w-4 h-4 text-secondary drop-shadow-[0_0_5px_rgba(37,99,235,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}

        {/* The Bubble */}
        <div 
          className={`px-4 py-3.5 text-[14.5px] leading-relaxed shadow-sm ${
            isUser 
              ? 'bg-gradient-to-r from-accent via-secondary to-secondary text-white rounded-2xl rounded-br-sm shadow-[0_4px_15px_-3px_rgba(37,99,235,0.4)]' 
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-bl-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]'
          }`}
        >
          {text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;

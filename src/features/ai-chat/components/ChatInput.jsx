import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    if (onSendMessage) onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-transparent p-4 shrink-0 pb-6 relative z-20">
      <div className="relative flex items-center shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] rounded-[20px] bg-white border border-slate-200/60 p-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Copilot..."
          className="w-full bg-transparent text-slate-800 rounded-[16px] pl-4 pr-12 py-3 text-[14.5px] focus:outline-none resize-none h-[48px] max-h-[120px] placeholder:text-slate-400"
          rows={1}
          maxLength={500}
        />
        
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className={`absolute right-2 p-2 rounded-[12px] transition-all duration-300 flex items-center justify-center
            ${text.trim() ? 'bg-gradient-to-r from-accent to-accent text-white shadow-md shadow-secondary/30 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400'}`}
          aria-label="Send Message"
        >
          <svg className="w-5 h-5 ml-0.5 transform -translate-y-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-[10px] font-medium text-slate-500 tracking-wide uppercase">Greenleaf Copilot AI</span>
      </div>
    </div>
  );
};

export default ChatInput;

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import QuickActions from './QuickActions';
import LeadCaptureForm from './LeadCaptureForm';

const ChatBody = ({ messages = [], isTyping = false, onSendMessage }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 scroll-smooth" ref={scrollRef}>
      
      {/* Welcome State - Show only if no messages exist (mocked out here) */}
      {messages.length === 0 && (
        <div className="text-left mb-8 mt-2 bg-white/60 backdrop-blur-sm p-6 rounded-[24px] shadow-sm border border-slate-200/50 relative overflow-hidden">
          {/* Subtle background glow inside the card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent rounded-[14px] flex items-center justify-center mb-5 shadow-inner relative z-10">
             <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
          </div>
          <h4 className="font-heading font-bold text-2xl text-slate-900 leading-tight mb-2 relative z-10">
            Good afternoon.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-500">How can I help you scale today?</span>
          </h4>
          <p className="text-[14.5px] text-slate-500 leading-relaxed mt-3 relative z-10">
            I'm your dedicated AI infrastructure expert. Ask me about our facilities, services, or request a custom architecture quote.
          </p>
        </div>
      )}

      <QuickActions onActionClick={onSendMessage} />

      <div className="space-y-4 my-6">
        {messages.map((msg) => {
          if (msg.type === 'LEAD_FORM') {
            return (
              <div key={msg.id} className="flex flex-col gap-2">
                {msg.text && <MessageBubble type="BOT_MESSAGE" text={msg.text} />}
                <LeadCaptureForm />
              </div>
            );
          }
          return <MessageBubble key={msg.id} type={msg.type} text={msg.text} />;
        })}
      </div>

      {isTyping && <TypingIndicator />}

      <SuggestedQuestions onQuestionClick={onSendMessage} />

    </div>
  );
};

export default ChatBody;

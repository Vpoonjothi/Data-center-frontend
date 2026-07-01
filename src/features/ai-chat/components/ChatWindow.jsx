import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import { useChatbot } from '../hooks/useChatbot';

const ChatWindow = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, isTyping, sendMessage } = useChatbot();

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed z-50 flex flex-col bg-slate-900/95 overflow-hidden shadow-[0_30px_100px_-15px_rgba(0,0,0,0.6)] border border-slate-700/50
                     bottom-0 right-0 w-full h-[100dvh] rounded-none backdrop-blur-2xl transition-all duration-300 ease-in-out
                     ${isExpanded 
                        ? 'sm:rounded-[32px] sm:bottom-8 sm:right-8 sm:w-[calc(100vw-64px)] sm:h-[calc(100vh-64px)] sm:max-w-[1200px]' 
                        : 'sm:rounded-[32px] sm:bottom-28 sm:right-8 sm:w-[420px] sm:h-[700px] sm:max-h-[calc(100vh-140px)]'}`}
        >
          <ChatHeader onClose={onClose} onToggleExpand={toggleExpand} isExpanded={isExpanded} />
          
          <ChatBody messages={messages} isTyping={isTyping} onSendMessage={sendMessage} />
          
          <ChatInput onSendMessage={sendMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;

import { useState } from 'react';
import { generateBotResponse } from '../services/chatbotService';

export const useChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'BOT_MESSAGE', text: 'Hello! I am the Greenleaf AI Assistant. How can I help you architect your infrastructure today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), type: 'USER_MESSAGE', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Generate Bot Response
    try {
      const botMsg = await generateBotResponse(text);
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'BOT_MESSAGE', 
        text: 'I encountered an error processing your request.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage
  };
};

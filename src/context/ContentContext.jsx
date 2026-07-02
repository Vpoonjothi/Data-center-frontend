import React, { createContext, useState, useEffect } from 'react';
import { getContentBlocks } from '../services/api';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getContentBlocks();
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch CMS content', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getContent = (key, fallback) => {
    return content[key]?.value || fallback;
  };

  return (
    <ContentContext.Provider value={{ content, getContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

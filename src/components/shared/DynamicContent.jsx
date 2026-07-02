import React, { useContext } from 'react';
import { ContentContext } from '../../context/ContentContext';

const DynamicContent = ({ contentKey, fallback, type = 'text', className = '' }) => {
  const { content, loading } = useContext(ContentContext);

  if (loading) {
    return <span className={`animate-pulse bg-gray-700 rounded ${className}`}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
  }

  const block = content[contentKey];
  const value = block ? block.value : fallback;
  const renderType = block ? block.type : type;

  if (renderType === 'html') {
    return <div className={className} dangerouslySetInnerHTML={{ __html: value }} />;
  }

  if (renderType === 'image_url') {
    return <img src={value} alt={contentKey} className={className} />;
  }

  return <span className={className}>{value}</span>;
};

export default DynamicContent;

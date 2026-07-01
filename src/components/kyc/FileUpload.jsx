import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ label, name, accept, description, onChange, isRequired, currentFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!currentFile) {
      setPreview(null);
      return;
    }

    if (currentFile.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(currentFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (currentFile.type === 'application/pdf') {
      setPreview('pdf');
    }
  }, [currentFile]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }
    
    // Check if it matches accept string roughly
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if (!isImage && !isPdf) {
      alert('Invalid file format.');
      return;
    }

    onChange(name, file);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onChange(name, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="bg-[#020817] p-5 rounded-2xl border border-gray-800 transition-colors duration-300 hover:border-gray-700">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <label className="block text-sm font-bold text-white mb-1">
            {label} {isRequired && <span className="text-secondary">*</span>}
          </label>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {currentFile && (
          <button 
            type="button" 
            onClick={handleRemove}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove File"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!currentFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
              dragActive ? 'border-secondary bg-secondary/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              name={name}
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
            <div className="w-12 h-12 mb-3 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-medium text-center">
              Drag & drop your file here, or <span className="text-secondary">browse</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-secondary/30 bg-secondary/5"
          >
            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center border border-gray-800">
              {preview === 'pdf' ? (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentFile.name}</p>
              <p className="text-xs text-gray-500">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
              {/* Progress bar visual indicator (fake for now as real upload happens later) */}
              <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-secondary w-full"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;

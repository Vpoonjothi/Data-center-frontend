import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#020817] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-secondary transition-colors"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-[100] mt-1 bg-[#0a1128] border border-gray-700 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                  value === opt.value ? 'text-secondary bg-secondary/10 font-medium' : 'text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DateFilter = ({ filter, setFilter, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (newType) => {
    let initialValue = '';
    if (newType === 'range') initialValue = { start: '', end: '' };
    const newFilter = { type: newType, value: initialValue };
    setFilter(newFilter);
    if (onFilterChange) onFilterChange();
    if (newType === 'all') setIsOpen(false);
  };

  const handleValueChange = (e) => {
    const newValue = e.target ? e.target.value : e; // handle both inputs and CustomSelect
    const newFilter = { ...filter, value: newValue };
    setFilter(newFilter);
    if (onFilterChange) onFilterChange();
  };

  const handleRangeChange = (field, val) => {
    const newValue = { ...(filter.value || { start: '', end: '' }), [field]: val };
    const newFilter = { ...filter, value: newValue };
    setFilter(newFilter);
    if (onFilterChange) onFilterChange();
  };

  const handleMonthYearChange = (field, val) => {
    const currentYear = new Date().getFullYear();
    let [y, m] = (filter.value && typeof filter.value === 'string' && filter.value.includes('-')) 
      ? filter.value.split('-') 
      : [currentYear.toString(), '01'];
      
    if (field === 'year') y = val;
    if (field === 'month') m = val;
    
    const newValue = `${y}-${m}`;
    const newFilter = { ...filter, value: newValue };
    setFilter(newFilter);
    if (onFilterChange) onFilterChange();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const filterTypeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'range', label: 'Date Range' },
    { value: 'month', label: 'By Month' },
    { value: 'year', label: 'By Year' },
  ];

  const yearOptions = years.map(y => ({ value: y.toString(), label: y.toString() }));

  const monthOptions = [
    { value: '01', label: 'Jan (01)' },
    { value: '02', label: 'Feb (02)' },
    { value: '03', label: 'Mar (03)' },
    { value: '04', label: 'Apr (04)' },
    { value: '05', label: 'May (05)' },
    { value: '06', label: 'Jun (06)' },
    { value: '07', label: 'Jul (07)' },
    { value: '08', label: 'Aug (08)' },
    { value: '09', label: 'Sep (09)' },
    { value: '10', label: 'Oct (10)' },
    { value: '11', label: 'Nov (11)' },
    { value: '12', label: 'Dec (12)' },
  ];

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors border flex items-center justify-center ${
          filter.type !== 'all' || isOpen
            ? 'bg-secondary/10 border-secondary text-secondary'
            : 'bg-[#020817] border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
        }`}
        title="Filter by Date"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[280px] bg-[#0a1128] border border-gray-700 rounded-xl shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] p-4 origin-top-right z-50 max-w-[calc(100vw-2rem)]"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Filter Type</label>
                <CustomSelect 
                  value={filter.type}
                  options={filterTypeOptions}
                  onChange={handleTypeChange}
                  placeholder="Select filter..."
                />
              </div>

              {filter.type === 'range' && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">From Date</label>
                    <input 
                      type="date" 
                      value={filter.value?.start || ''}
                      onChange={(e) => handleRangeChange('start', e.target.value)}
                      className="w-full bg-[#020817] border border-gray-700 text-sm rounded-lg px-3 py-2.5 text-gray-200 focus:outline-none focus:border-secondary transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">To Date</label>
                    <input 
                      type="date" 
                      min={filter.value?.start || ''}
                      value={filter.value?.end || ''}
                      onChange={(e) => handleRangeChange('end', e.target.value)}
                      className="w-full bg-[#020817] border border-gray-700 text-sm rounded-lg px-3 py-2.5 text-gray-200 focus:outline-none focus:border-secondary transition-colors [color-scheme:dark]"
                    />
                  </div>
                </motion.div>
              )}

              {filter.type === 'month' && (() => {
                const [y, m] = (filter.value && typeof filter.value === 'string' && filter.value.includes('-')) 
                  ? filter.value.split('-') 
                  : ['', ''];
                
                return (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="flex gap-3">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Month</label>
                      <CustomSelect 
                        value={m}
                        options={monthOptions}
                        onChange={(val) => handleMonthYearChange('month', val)}
                        placeholder="Month"
                      />
                    </div>
                    <div className="space-y-1 flex-[0.8]">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Year</label>
                      <CustomSelect 
                        value={y}
                        options={yearOptions}
                        onChange={(val) => handleMonthYearChange('year', val)}
                        placeholder="Year"
                      />
                    </div>
                  </motion.div>
                );
              })()}

              {filter.type === 'year' && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Select Year</label>
                  <CustomSelect 
                    value={filter.value}
                    options={yearOptions}
                    onChange={handleValueChange}
                    placeholder="Choose a year..."
                  />
                </motion.div>
              )}
            </div>
            
            <div className="mt-5 flex justify-end">
               <button onClick={() => setIsOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors py-1.5 px-4 bg-gray-800/50 hover:bg-gray-700 rounded-lg">Done</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const applyDateFilter = (dateString, filter) => {
  if (!filter || filter.type === 'all' || !filter.value) return true;
  if (!dateString) return false;
  
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;

  try {
    const yearStr = d.getFullYear().toString();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    
    if (filter.type === 'range') {
      const { start, end } = filter.value || {};
      if (start && end) return dateStr >= start && dateStr <= end;
      if (start) return dateStr >= start;
      if (end) return dateStr <= end;
      return true;
    }
    
    if (filter.type === 'month') {
      return `${yearStr}-${monthStr}` === filter.value;
    }
    
    if (filter.type === 'year') {
      return yearStr === filter.value;
    }
  } catch (err) {
    console.error("Date filter error:", err);
    return false;
  }
  
  return true;
};

export default DateFilter;

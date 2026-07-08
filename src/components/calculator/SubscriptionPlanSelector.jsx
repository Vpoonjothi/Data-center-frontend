import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_OPTIONS = [
  { id: '1m', label: 'Monthly', desc: 'Recurring monthly billing', value: 1, unit: 'Months', type: 'Monthly' },
  { id: '3m', label: 'Quarterly', desc: '3-month subscription', value: 3, unit: 'Months', type: 'Quarterly' },
  { id: '6m', label: 'Semi-Annual', desc: '6-month subscription', value: 6, unit: 'Months', type: 'Semi-Annual' },
  { id: '12m', label: 'Annual', desc: '12-month subscription', value: 12, unit: 'Months', type: 'Annual' },
  { id: 'custom', label: 'Custom Contract', desc: 'Custom enterprise agreement', type: 'Custom' }
];

const SubscriptionPlanSelector = ({ onChange }) => {
  const [selectedId, setSelectedId] = useState('1m');
  const [customValue, setCustomValue] = useState(18);
  const [customUnit, setCustomUnit] = useState('Months');

  useEffect(() => {
    let multiplier = 1;
    let type = '';
    let value = 1;
    let unit = 'Months';

    if (selectedId === 'custom') {
      multiplier = customUnit === 'Years' ? customValue * 12 : customValue;
      type = 'Custom';
      value = customValue;
      unit = customUnit;
    } else {
      const opt = DURATION_OPTIONS.find(o => o.id === selectedId);
      multiplier = opt.value;
      type = opt.type;
      value = opt.value;
      unit = opt.unit;
    }

    onChange({
      duration_type: type,
      duration_value: value,
      duration_unit: unit,
      durationMultiplier: multiplier
    });
  }, [selectedId, customValue, customUnit, onChange]);

  const [isOpen, setIsOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const selectedOption = DURATION_OPTIONS.find(o => o.id === selectedId) || DURATION_OPTIONS[0];

  return (
    <div className="mb-10 animate-fadeIn">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Subscription Plan</h3>
      
      <div className="relative mb-4 z-20">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full relative overflow-hidden backdrop-blur-xl text-left rounded-xl px-5 py-4 flex justify-between items-center transition-all duration-300 border ${
            isOpen 
              ? 'bg-secondary/10 border-secondary shadow-[0_0_30px_rgba(26,128,29,0.3)]' 
              : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
          }`}
        >
          {isOpen && (
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none animate-pulse"></div>
          )}
          <div className="relative z-10">
            <div className="font-bold text-emerald-400 text-lg mb-1 drop-shadow-md">{selectedOption.label}</div>
            <div className="text-xs text-gray-300">{selectedOption.desc}</div>
          </div>
          <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(26,128,29,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 bg-[#0a1128]/70 backdrop-blur-2xl border border-secondary/30 rounded-xl shadow-[0_15px_50px_rgba(26,128,29,0.15)] overflow-hidden z-50 ring-1 ring-white/10"
            >
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedId(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-5 py-4 border-b border-white/5 last:border-0 transition-all duration-300 group flex items-center justify-between relative overflow-hidden ${
                      selectedId === opt.id ? 'bg-secondary/15' : 'hover:bg-white/10'
                    }`}
                  >
                    {selectedId === opt.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary shadow-[0_0_10px_rgba(26,128,29,1)]"></div>
                    )}
                    <div className="relative z-10">
                      <div className={`font-bold text-base mb-1 transition-colors ${selectedId === opt.id ? 'text-emerald-400 drop-shadow-md' : 'text-gray-300 group-hover:text-white'}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-400">{opt.desc}</div>
                    </div>
                    {selectedId === opt.id && (
                      <div className="relative z-10 w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(26,128,29,0.4)]">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedId === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-end shadow-xl">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest">Duration Value</label>
                <input
                  type="number"
                  min="1"
                  value={customValue}
                  onChange={(e) => setCustomValue(parseInt(e.target.value) || 1)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-lg rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300"
                />
              </div>
              <div className="flex-1 w-full relative">
                <label className="block text-[10px] font-bold text-emerald-400/80 mb-2 uppercase tracking-widest">Unit</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-lg rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 flex justify-between items-center"
                  >
                    <span>{customUnit}</span>
                    <span className="text-emerald-500/50">
                      <svg className={`w-5 h-5 transition-transform duration-300 ${unitDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence>
                    {unitDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl ring-1 ring-black/50"
                      >
                        {['Months', 'Years'].map(unit => (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => {
                              setCustomUnit(unit);
                              setUnitDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors ${customUnit === unit ? 'text-emerald-400 font-bold bg-white/5' : 'text-gray-300 font-medium'}`}
                          >
                            {unit}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="hidden sm:block flex-1">
                {/* Spacer for layout */}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total contract duration: {customUnit === 'Years' ? customValue * 12 : customValue} Months.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlanSelector;

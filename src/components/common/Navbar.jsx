import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { MAIN_NAVIGATION } from '../../constants/navigation';
import { COMPANY_INFO } from '../../constants/companyInfo';

const DesktopDropdown = ({ item, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  // If item has no submenu, render a simple link
  if (!item.submenu) {
    return (
      <Link
        to={item.path}
        className={`px-4 py-2 text-sm font-medium transition-all relative ${
          isActive ? 'text-[#1A801D]' : 'text-gray-300 hover:text-white'
        }`}
      >
        {item.name}
        {isActive && (
          <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#1A801D] rounded-t-full"></div>
        )}
      </Link>
    );
  }

  // Mega Menu / Dropdown Link
  return (
    <div
      className="relative px-2 py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-all ${
          isActive || isHovered ? 'text-[#1A801D]' : 'text-gray-300 hover:text-white'
        }`}
      >
        {item.name}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-[#0a1128]/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden py-2 z-50"
          >
            {item.submenu.map((subItem) => (
              <Link
                key={subItem.name}
                to={subItem.path}
                className="block px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#1e293b]/50 transition-colors"
              >
                {subItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isActive && !isHovered && (
        <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#1A801D] rounded-t-full"></div>
      )}
    </div>
  );
};

const MobileMenuItem = ({ item, isActive, setIsOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!item.submenu) {
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`block px-3 py-2.5 rounded-md text-base font-medium ${
          isActive ? 'bg-emerald-900/30 text-[#1A801D]' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
          isActive ? 'bg-emerald-900/30 text-[#1A801D]' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {item.name}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 overflow-hidden"
          >
            <div className="py-1 border-l border-gray-700 ml-3 pl-3 space-y-1">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.name}
                  to={subItem.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="w-full bg-[#020817]/95 backdrop-blur-md transition-all relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1A801D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-white leading-none block">
                  {COMPANY_INFO.shortName}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#1A801D] font-bold uppercase block mt-0.5">
                  Agencies
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex items-center justify-center space-x-1 flex-1">
            {MAIN_NAVIGATION.map((item) => {
              // Exact match for home, startsWith for others
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              
              return (
                <DesktopDropdown key={item.name} item={item} isActive={isActive} />
              );
            })}
          </div>

          {/* Desktop Action Button (Right) */}
          <div className="hidden lg:flex items-center pl-4">
            <Link
              to={user ? '/dashboard/enquiries' : '/login'}
              className="bg-[#166E18] hover:bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-secondary/20"
            >
              Get a Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 bg-slate-900/50 rounded-lg border border-gray-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#020817] border-b border-gray-800 overflow-y-auto max-h-[calc(100vh-100px)]"
          >
            <div className="px-4 py-4 space-y-2">
              {MAIN_NAVIGATION.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);
                
                return (
                  <MobileMenuItem
                    key={item.name}
                    item={item}
                    isActive={isActive}
                    setIsOpen={setIsOpen}
                  />
                );
              })}
              
              
              <div className="pt-4 mt-4 border-t border-gray-800 space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      My Profile & Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                
                <Link
                  to={user ? '/dashboard/enquiries' : '/login'}
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center w-full bg-[#166E18] hover:bg-accent text-white px-6 py-3.5 rounded-lg text-base font-medium transition-colors shadow-lg shadow-secondary/20 mt-4"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

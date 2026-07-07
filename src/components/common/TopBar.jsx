import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { AuthContext } from '../../context/AuthContext';
import { COMPANY_INFO } from '../../constants/companyInfo';

const TopBar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="bg-[#020817] text-gray-400 text-xs py-2 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href={`mailto:${COMPANY_INFO.contact.sales}`} className="flex items-center text-white hover:text-[#1A801D] transition-colors">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {COMPANY_INFO.contact.sales}
            </a>
          </div>

          {/* Right Side: Auth Links */}
          <div className="flex items-center space-x-4 font-medium">
            {user ? (
              <>
                <NotificationBell isAdmin={false} />
                <span className="text-gray-700 mx-2">|</span>
                <Link to="/dashboard" className="hover:text-[#1A801D] transition-colors">
                  Profile
                </Link>
                <span className="text-gray-700 ml-4 mr-2">|</span>
                <button onClick={logout} className="hover:text-red-400 transition-colors cursor-pointer">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" state={{ from: location }} className="hover:text-[#1A801D] transition-colors">
                  Login
                </Link>
                <span className="text-gray-700">|</span>
                <Link to="/signup" className="hover:text-[#1A801D] transition-colors">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { admin, logout } = useContext(AdminAuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(!!window.deferredPrompt);

  useEffect(() => {
    const handlePromptReady = () => setCanInstall(true);
    window.addEventListener('pwa-prompt-ready', handlePromptReady);

    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!window.deferredPrompt) return;
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      window.deferredPrompt = null;
      setCanInstall(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Quotes', path: '/admin/quotes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Verifications', path: '/admin/verifications', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { name: 'Services', path: '/admin/services', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { name: 'Payments', path: '/admin/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Enquiries', path: '/admin/enquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Compliance', path: '/admin/compliance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Offers', path: '/admin/offers', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Enterprise Specs', path: '/admin/enterprise-settings', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
    { name: 'AI Server Specs', path: '/admin/ai-settings', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Colocation Specs', path: '/admin/colocation-settings', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1128] border-r border-gray-800 flex flex-col hidden md:flex fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1A801D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-heading font-bold text-white leading-none block flex items-center">
                Greenleaf <span className="text-gray-400 font-normal text-sm ml-2">Admin</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#1A801D] font-bold uppercase block mt-0.5">
                Agencies
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-secondary/10 text-secondary' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative">
        {/* Topbar */}
        <header className="h-16 bg-[#0a1128]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white hidden sm:block">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary border-2 border-[#0a1128] rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-800 mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{admin?.name || 'Administrator'}</div>
                <div className="text-xs text-gray-400 capitalize">{admin?.role || 'Admin'}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm border border-secondary/30">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating 3D App Block PWA Install Button */}
        <AnimatePresence>
          {canInstall && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-10 right-10 z-50"
              style={{ perspective: 1000 }}
            >
              <motion.button
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleInstallClick}
                className="relative w-16 h-16 rounded-[1.25rem] group cursor-pointer shadow-[0_15px_35px_-10px_rgba(26,128,29,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(26,128,29,0.8)] transition-shadow duration-500"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div 
                  className="absolute inset-0 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front Side: The Leaf App Icon */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#0F4A11] via-[#1A801D] to-[#2EAA32] rounded-[1.25rem] border-t border-white/40 border-b border-black/30 flex items-center justify-center overflow-hidden" 
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Inner glass glare for 3D realism */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
                    
                    <svg className="w-8 h-8 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                    </svg>
                  </div>
                  
                  {/* Back Side: Dark Neon Install CTA */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-[#020817] rounded-[1.25rem] border border-secondary flex flex-col items-center justify-center [transform:rotateY(180deg)] overflow-hidden" 
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Glowing pulse on the back */}
                    <div className="absolute inset-0 bg-secondary/30 animate-pulse rounded-[1.25rem]"></div>
                    <svg className="w-5 h-5 text-[#2EAA32] mb-0.5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-white font-extrabold text-[10px] uppercase tracking-wider relative z-10">
                      Install
                    </span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminLayout;

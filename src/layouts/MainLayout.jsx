import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '../components/common/TopBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GlobalSecurityIcon from '../components/shared/GlobalSecurityIcon';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <div className="sticky top-0 z-50 flex flex-col">
          <TopBar />
          <Navbar />
        </div>
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <GlobalSecurityIcon />
    </div>
  );
};

export default MainLayout;

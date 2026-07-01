import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-sectionBg px-4">
      <div className="text-center">
        <h1 className="text-9xl font-heading font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-heading font-bold text-primary mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button>Return to Homepage</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

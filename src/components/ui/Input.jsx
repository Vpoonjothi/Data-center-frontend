import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-sectionBg border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-colors ${
          error ? 'border-red-500 focus:ring-red-500/50' : 'focus:border-secondary'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

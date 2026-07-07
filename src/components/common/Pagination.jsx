import React from 'react';

const Pagination = ({ currentPage, totalPages: initialTotalPages, onPageChange }) => {
  const totalPages = Math.max(1, initialTotalPages);

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-[#0a1128] mt-auto">
      <div className="text-sm text-gray-400">
        Page <span className="font-medium text-white">{currentPage}</span> of <span className="font-medium text-white">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#020817] text-gray-300 border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#020817] text-gray-300 border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

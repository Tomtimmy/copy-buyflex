import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const pagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
  if (totalPages > pagesToShow && endPage - startPage + 1 < pagesToShow) {
    startPage = endPage - pagesToShow + 1;
  }
  startPage = Math.max(1, startPage);


  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4 text-xs sm:text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        &laquo;
      </button>

      {startPage > 1 && (
        <>
            <button onClick={() => onPageChange(1)} className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">1</button>
            {startPage > 2 && <span className="px-2 sm:px-3 py-1 text-gray-400">...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${
            currentPage === number
              ? 'bg-green-500 text-white font-bold'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
            {endPage < totalPages - 1 && <span className="px-2 sm:px-3 py-1 text-gray-400">...</span>}
            <button onClick={() => onPageChange(totalPages)} className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
      >
        &raquo;
      </button>
    </nav>
  );
};

import React from 'react';
import {
  BsChevronLeft,
  BsChevronRight,
} from 'react-icons/bs';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
  const totalPage = Math.ceil(totalItem / parPage);

  // No pagination if no data or only one page
  if (totalItem === 0 || totalPage <= 1) return null;

  const visiblePageCount = showItem > 6 ? 5 : showItem;

  let startPage = Math.max(1, pageNumber - Math.floor(visiblePageCount / 2));
  let endPage = startPage + visiblePageCount - 1;

  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - visiblePageCount + 1);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      setPageNumber(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 border
            ${pageNumber === i
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400'}
          `}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
      {/* Prev */}
      {pageNumber > 1 && (
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 border bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 border-gray-300"
        >
          <BsChevronLeft />
        </button>
      )}

      {/* Page Numbers */}
      {renderPageNumbers()}

      {/* Next */}
      {pageNumber < totalPage && (
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 border bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 border-gray-300"
        >
          <BsChevronRight />
        </button>
      )}
    </div>
  );
};

export default Pagination;

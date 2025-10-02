"use client";
import React from "react";

export default function Pagination({ allProps, totalPages }) {
  const { currentPage, itemPerPage, filtered, setCurrentPage } = allProps;


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); 
      
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(
        <li key={page} className={page === currentPage ? "active" : ""}>
          <button
            onClick={() => handlePageChange(page)}
            className="pagination-item text-button"
          >
            {page}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <li>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`pagination-item text-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
          disabled={currentPage === 1}
        >
          <i className="icon-arrLeft" />
        </button>
      </li>
      {renderPageNumbers()}
      <li>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`pagination-item text-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          <i className="icon-arrRight" />
        </button>
      </li>
    </>
  );
}
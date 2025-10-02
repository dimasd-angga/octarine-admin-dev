"use client";
import React from "react";
import Link from "next/link";

export default function Pagination({ currentPage, totalPages }) {
  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return (
        <li key={page} className={page === currentPage ? "active" : ""}>
          <Link
            href={`/blog?page=${page}`}
            className="pagination-item text-button"
            scroll={false} // Prevent scrolling to top
          >
            {page}
          </Link>
        </li>
      );
    });
  };

  return (
    <>
      <li>
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className={`pagination-item text-button ${
            currentPage === 1 ? "disabled" : ""
          }`}
          scroll={false}
        >
          <i className="icon-arrLeft" />
        </Link>
      </li>
      {renderPageNumbers()}
      <li>
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className={`pagination-item text-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          scroll={false}
        >
          <i className="icon-arrRight" />
        </Link>
      </li>
    </>
  );
}

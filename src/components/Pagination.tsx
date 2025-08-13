import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  entityType: "users" | "businessUnits" | "activeDirectory";
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  entityType,
}: PaginationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    setIsLoading(true);
    try {
      await onPageChange(newPage);
    } finally {
      setIsLoading(false);
    }
  };

  const getShowingText = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    switch (entityType) {
      case "users":
        return `Showing users ${start}-${end} of ${totalItems}`;
      case "businessUnits":
        return `Showing business units ${start}-${end} of ${totalItems}`;
      case "activeDirectory":
        return `Showing directory entries ${start}-${end} of ${totalItems}`;
      default:
        return `Showing ${start}-${end} of ${totalItems} items`;
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
          currentPage === 1
            ? "z-10 bg-primary-600/[0.70] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            : "text-gray-200 ring-1 ring-inset ring-gray-700 hover:bg-gray-400 focus:z-20 focus:outline-offset-0"
        }`}
        disabled={isLoading}
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (currentPage > maxVisiblePages - 2) {
      pages.push(
        <span
          key="ellipsis-start"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-700 focus:outline-offset-0"
        >
          ...
        </span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
              currentPage === i
                ? "z-10 bg-primary-600/[0.70] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                : "text-gray-200 ring-1 ring-inset ring-gray-700 hover:bg-gray-400  focus:z-20 focus:outline-offset-0"
            }`}
            disabled={isLoading}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - (maxVisiblePages - 2)) {
      pages.push(
        <span
          key="ellipsis-end"
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-700 focus:outline-offset-0"
        >
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentPage === totalPages
              ? "z-10 bg-primary-600/[0.70] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              : "text-gray-200 ring-1 ring-inset ring-gray-700 hover:bg-gray-400  focus:z-20 focus:outline-offset-0"
          }`}
          disabled={isLoading}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between shadow/[0.1] rounded-b-2xl border-gray-700 px-4 py-3 sm:px-6">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="relative inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">{getShowingText()}</p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-700 hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
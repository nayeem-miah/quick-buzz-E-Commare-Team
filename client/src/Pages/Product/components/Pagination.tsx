import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalProducts,
  pageNumbers,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row">
      <p className="text-sm text-gray-500">
        Total results: <span className="font-semibold text-gray-900">{totalProducts}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pageNumbers.map((pageNumber, index) => {
          const previous = pageNumbers[index - 1];
          const hasGap = previous && pageNumber - previous > 1;

          return (
            <React.Fragment key={pageNumber}>
              {hasGap && <span className="px-1 text-sm text-gray-400">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${currentPage === pageNumber ? 'border-orange-400 bg-orange-400 text-gray-950' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50'}`}
              >
                {pageNumber}
              </button>
            </React.Fragment>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <span className="ml-0 text-sm text-gray-500 sm:ml-2">Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;

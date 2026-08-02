import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>> | ((page: number) => void);
  size: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
  size,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show page 1
      pageNumbers.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) {
        end = 3;
      }
      if (page >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pageNumbers.push("...");
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-xs">
      <p className="text-gray-400 text-center sm:text-left">
        Showing <span className="font-bold text-gray-700">{(page - 1) * size + 1}</span> to{" "}
        <span className="font-bold text-gray-700">{Math.min(page * size, totalItems)}</span> of{" "}
        <span className="font-bold text-gray-700">{totalItems}</span> items
      </p>

      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 font-bold transition duration-200"
        >
          Previous
        </button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1.5">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-bold">
                  ...
                </span>
              );
            }
            return (
              <button
                type="button"
                key={p}
                onClick={() => setPage(p as number)}
                className={`w-9 h-9 rounded-xl font-bold transition duration-200 ${
                  page === p
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Mobile Page Status Indicator */}
        <span className="sm:hidden text-gray-500 font-bold px-2">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 font-bold transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

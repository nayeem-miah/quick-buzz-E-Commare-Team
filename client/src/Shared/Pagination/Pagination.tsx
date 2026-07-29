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

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-white">
      <p className="text-xs text-gray-500 hidden sm:block">
        Showing <span className="font-semibold text-gray-955">{(page - 1) * size + 1}</span> to{" "}
        <span className="font-semibold text-gray-955">{Math.min(page * size, totalItems)}</span> of{" "}
        <span className="font-semibold text-gray-955">{totalItems}</span> items
      </p>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <button
          className={`flex items-center justify-center px-4 py-2 text-xs font-semibold transition-colors rounded-xl border 
          ${
            page <= 1
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200"
          }`}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <div className="flex items-center justify-center px-4 py-2 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100 rounded-xl sm:hidden">
          {page} / {totalPages}
        </div>

        <button
          className={`flex items-center justify-center px-4 py-2 text-xs font-semibold transition-colors rounded-xl border
          ${
            page >= totalPages
              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200"
          }`}
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

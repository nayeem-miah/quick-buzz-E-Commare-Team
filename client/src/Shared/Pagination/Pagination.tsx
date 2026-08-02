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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-xs">
      <p className="text-gray-400">
        Showing <span className="font-bold text-gray-700">{(page - 1) * size + 1}</span> to{" "}
        <span className="font-bold text-gray-700">{Math.min(page * size, totalItems)}</span> of{" "}
        <span className="font-bold text-gray-700">{totalItems}</span> items
      </p>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-40 font-bold transition duration-200"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setPage(p)}
            className={`w-9 h-9 rounded-xl font-bold transition duration-200 ${
              page === p
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
            }`}
          >
            {p}
          </button>
        ))}

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

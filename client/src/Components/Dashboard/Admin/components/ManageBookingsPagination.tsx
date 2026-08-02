import React from "react";

interface ManageBookingsPaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export const ManageBookingsPagination: React.FC<ManageBookingsPaginationProps> = ({
  page,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalPages}</span>
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={isLoading || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          disabled={isLoading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

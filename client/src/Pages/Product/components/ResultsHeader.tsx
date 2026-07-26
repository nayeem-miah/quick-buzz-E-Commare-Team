import { Filter } from 'lucide-react';
import SortDropdown from './SortDropdown';

interface ResultsHeaderProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  visibleProducts: number;
  sortBy: string;
  sortOptions: string[];
  onSortChange: (value: string) => void;
  onOpenFilters: () => void;
}

const ResultsHeader = ({
  currentPage,
  totalPages,
  totalProducts,
  visibleProducts,
  sortBy,
  sortOptions,
  onSortChange,
  onOpenFilters,
}: ResultsHeaderProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-gray-950">
          Showing {visibleProducts ? 1 : 0}-{visibleProducts} of {totalProducts} products
        </p>
        <p className="text-xs text-gray-500">Page {currentPage} of {totalPages} - {visibleProducts} results match your view</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onOpenFilters} className="btn btn-sm border-orange-200 bg-white text-gray-700 hover:bg-orange-50 lg:hidden">
          <Filter className="h-4 w-4" /> Filters
        </button>
        <SortDropdown value={sortBy} options={sortOptions} onChange={onSortChange} />
      </div>
    </div>
  );
};

export default ResultsHeader;

import React from "react";
import { Search } from "lucide-react";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";

interface HostListingsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onFilterChange: () => void;
}

export const HostListingsFilters: React.FC<HostListingsFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="space-y-1.5 sm:col-span-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Search Product
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title, brand, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onFilterChange();
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Filter by Status
        </label>
        <CustomDropdown
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            onFilterChange();
          }}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "approve", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
          ]}
          className="w-full"
          buttonClassName="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-700 bg-white flex justify-between items-center cursor-pointer"
        />
      </div>
    </div>
  );
};

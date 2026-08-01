import React from "react";
import { Search } from "lucide-react";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";
import CustomDatePicker from "../../../../Shared/DatePicker/CustomDatePicker";

interface HostOrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

export const HostOrdersFilters: React.FC<HostOrdersFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Search Order
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending (COD)" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          className="w-full"
          buttonClassName="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-700 bg-white flex justify-between items-center cursor-pointer"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Filter by Date
        </label>
        <CustomDatePicker
          value={dateFilter}
          onChange={setDateFilter}
          placeholder="Pick a date..."
        />
      </div>
    </div>
  );
};

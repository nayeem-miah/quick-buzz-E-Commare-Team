import React from "react";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";
import { ApprovalStatus } from "../../../../constants/enums";

interface ManageBookingsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categoryOptions: { value: string; label: string }[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const ManageBookingsFilters: React.FC<ManageBookingsFiltersProps> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by title or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm"
        />
      </div>

      <div className="flex w-full md:w-auto items-center gap-3">
        <CustomDropdown
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
        />

        <CustomDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: ApprovalStatus.APPROVED, label: "Approved" },
            { value: ApprovalStatus.PENDING, label: "Pending" },
            { value: ApprovalStatus.REJECTED, label: "Rejected" },
          ]}
        />
      </div>
    </div>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const HostListingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track your submitted store products
        </p>
      </div>
      <Link to="/dashboard/host-add-product" className="self-start sm:self-auto">
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-px flex-shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </Link>
    </div>
  );
};

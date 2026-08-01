import React from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ManageBookingsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Products</h1>
        <p className="text-sm text-gray-500 mt-1">View, approve, and manage all platform products.</p>
      </div>
      <button
        onClick={() => navigate('/dashboard/host-add-product')}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-orange-500/30 self-start md:self-auto flex-shrink-0"
      >
        <FiPlus size={16} /> Add New Product
      </button>
    </div>
  );
};

import React from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const ManageBookingsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Products</h1>
        <p className="text-gray-500 mt-1 text-sm">View, approve, and manage all platform products.</p>
      </div>
      <button
        onClick={() => navigate('/dashboard/host-add-product')}
        className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition-all duration-300"
      >
        <FiPlus size={18} /> Add New Product
      </button>
    </div>
  );
};

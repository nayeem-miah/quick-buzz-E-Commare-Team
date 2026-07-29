import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../../../../types/listing.type";

interface ManageBookingsTableProps {
  products: Listing[];
  onStatusChange: (product: Listing, status: string) => void;
  onDetailsClick: (listing: Listing) => void;
  onDelete: (id: string | number) => void;
}

export const ManageBookingsTable: React.FC<ManageBookingsTableProps> = ({
  products,
  onStatusChange,
  onDetailsClick,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
            <th className="py-4 px-6 font-semibold rounded-tl-2xl">Product</th>
            <th className="py-4 px-6 font-semibold">Category</th>
            <th className="py-4 px-6 font-semibold">Price</th>
            <th className="py-4 px-6 font-semibold">Status</th>
            <th className="py-4 px-6 font-semibold text-right rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {products.map((listing: Listing) => (
            <tr
              key={listing._id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    <img src={listing?.productImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {listing?.productTitle?.slice(0, 30)}
                      {listing?.productTitle && listing.productTitle.length > 30 ? "..." : ""}
                    </p>
                    <p className="text-xs text-gray-500">{listing?.brandName}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-600">{listing?.category}</td>
              <td className="py-4 px-6 font-bold text-gray-900">৳{listing?.price?.toLocaleString()}</td>
              <td className="py-4 px-6">
                {listing?.adminIsApproved === ApprovalStatus.APPROVED ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                    Approved
                  </span>
                ) : listing?.adminIsApproved === ApprovalStatus.REJECTED ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                    Rejected
                  </span>
                ) : (
                  <button
                    onClick={() => onStatusChange(listing, ApprovalStatus.APPROVED)}
                    className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 shadow-sm rounded-full transition-all duration-300 hover:bg-orange-100"
                  >
                    Approve
                  </button>
                )}
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onDetailsClick(listing)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/update-product/${listing._id}`)}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(listing?._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

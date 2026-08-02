import { Edit, Eye, Send, Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../MyAddedProduct";

interface HostListingsTableProps {
  listings: Listing[];
  onSelectBooking: (listing: Listing) => void;
  onDelete: (id: string) => void;
  onPublish?: (listing: Listing) => void;
}

export const HostListingsTable: React.FC<HostListingsTableProps> = ({
  listings,
  onSelectBooking,
  onDelete,
  onPublish,
}) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
            <th className="py-4 px-6 text-left">Product</th>
            <th className="py-4 px-6 text-left">Category</th>
            <th className="py-4 px-6 text-right">Price</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing: Listing, idx: number) => (
            <tr
              key={listing._id}
              className={`border-b border-gray-50 hover:bg-orange-50/20 transition duration-150 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <td className="py-5 px-6">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.productImage}
                    alt={listing.productTitle}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {listing.productTitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Brand:{" "}
                      <span className="font-semibold text-gray-600">
                        {listing.brandName || "No Brand"}
                      </span>
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-5 px-6 text-sm text-gray-600 font-medium">
                {listing.category}
              </td>
              <td className="py-5 px-6 text-sm font-bold text-gray-900 text-right">
                ৳{listing.price?.toLocaleString()}
              </td>
              <td className="py-5 px-6 text-center">
                <span
                  className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                    listing.adminIsApproved === ApprovalStatus.APPROVED
                      ? "bg-green-50 text-green-700 border-green-200"
                      : listing.adminIsApproved === ApprovalStatus.PENDING
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : listing.adminIsApproved === ApprovalStatus.DRAFT
                      ? "bg-gray-50 text-gray-700 border-gray-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {listing.adminIsApproved === ApprovalStatus.APPROVED
                    ? "Approved"
                    : listing.adminIsApproved === ApprovalStatus.PENDING
                    ? "Pending"
                    : listing.adminIsApproved === ApprovalStatus.DRAFT
                    ? "Draft"
                    : "Rejected"}
                </span>
              </td>
              <td className="py-5 px-6">
                <div className="flex items-center justify-center gap-2">
                  {listing.adminIsApproved === ApprovalStatus.DRAFT && onPublish && (
                    <button
                      type="button"
                      onClick={() => onPublish(listing)}
                      className="p-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition duration-200"
                      title="Publish Product"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectBooking(listing)}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition duration-200"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/dashboard/update-product/${listing._id}`}
                    className="p-2 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition duration-200"
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(listing._id)}
                    className="p-2 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition duration-200"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
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

import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../MyAddedProduct";

interface HostListingsCardsProps {
  listings: Listing[];
  onSelectBooking: (listing: Listing) => void;
  onDelete: (id: string) => void;
}

export const HostListingsCards: React.FC<HostListingsCardsProps> = ({
  listings,
  onSelectBooking,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {listings.map((listing: Listing) => (
        <div
          key={listing._id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
        >
          {/* Card Header */}
          <div className="p-5 border-b border-gray-50 flex gap-3 items-start">
            <img
              src={listing.productImage}
              alt={listing.productTitle}
              className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 leading-snug line-clamp-2">
                {listing.productTitle}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Brand:{" "}
                <span className="font-semibold text-gray-600">
                  {listing.brandName || "No Brand"}
                </span>
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 grid grid-cols-2 gap-3 text-xs bg-gray-50/40">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Category
              </p>
              <p className="font-semibold text-gray-700 mt-0.5">{listing.category}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Price
              </p>
              <p className="font-black text-orange-500 mt-0.5">
                ৳{listing.price?.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 pt-1 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Status
              </span>
              <span
                className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${
                  listing.adminIsApproved === ApprovalStatus.APPROVED
                    ? "bg-green-50 text-green-700 border-green-200"
                    : listing.adminIsApproved === ApprovalStatus.PENDING
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {listing.adminIsApproved === ApprovalStatus.APPROVED
                  ? "Approved"
                  : listing.adminIsApproved === ApprovalStatus.PENDING
                  ? "Pending"
                  : "Rejected"}
              </span>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-white">
            <button
              type="button"
              onClick={() => onSelectBooking(listing)}
              className="flex-1 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
            <Link
              to={`/dashboard/update-product/${listing._id}`}
              className="flex-1 py-2 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              onClick={() => onDelete(listing._id)}
              className="flex-1 py-2 rounded-xl border border-red-100 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

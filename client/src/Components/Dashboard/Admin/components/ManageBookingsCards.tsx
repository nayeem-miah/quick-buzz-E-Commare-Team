import React from "react";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../../../../types/listing.type";

interface ManageBookingsCardsProps {
  products: Listing[];
  onStatusChange: (product: Listing, status: string) => void;
  onDetailsClick: (listing: Listing) => void;
  onDelete: (id: string | number) => void;
}

export const ManageBookingsCards: React.FC<ManageBookingsCardsProps> = ({
  products,
  onStatusChange,
  onDetailsClick,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden flex flex-col gap-4 p-4">
      {products.map((listing: Listing) => (
        <div key={listing._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
              <img src={listing?.productImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 line-clamp-2">{listing?.productTitle}</h4>
              <p className="text-sm text-gray-500">{listing?.brandName}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">৳{listing?.price}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div>
              {listing?.adminIsApproved === ApprovalStatus.APPROVED ? (
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-600">
                  Approved
                </span>
              ) : (
                <button
                  onClick={() => onStatusChange(listing, ApprovalStatus.APPROVED)}
                  className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-md"
                >
                  Approve
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onDetailsClick(listing)} className="p-2 bg-gray-50 text-gray-500 rounded-lg">
                <FiEye size={16} />
              </button>
              <button
                onClick={() => navigate(`/dashboard/update-product/${listing._id}`)}
                className="p-2 bg-gray-50 text-gray-500 rounded-lg"
              >
                <FiEdit size={16} />
              </button>
              <button onClick={() => onDelete(listing?._id)} className="p-2 bg-gray-50 text-red-500 rounded-lg">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

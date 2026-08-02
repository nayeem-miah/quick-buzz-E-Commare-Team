import React from "react";
import { FiCheck, FiInfo, FiMapPin, FiPhone, FiTrash2, FiX } from "react-icons/fi";

interface SellerDetails {
  sellerName: string;
  sellerEmail: string;
  sellerPhoto: string;
  imageUrl: string;
  mobile: number;
  reason: string;
  other: string;
  address: string;
  _id: number;
  adminIsApproved: string;
  decline?: string;
}

interface SellerRequestsCardsProps {
  sellers: SellerDetails[];
  onDetailsClick: (seller: SellerDetails) => void;
  onApprove: (seller: SellerDetails) => void;
  onDecline: (seller: SellerDetails) => void;
  onDelete: (id: string) => void;
}

export const SellerRequestsCards: React.FC<SellerRequestsCardsProps> = ({
  sellers,
  onDetailsClick,
  onApprove,
  onDecline,
  onDelete,
}) => {
  return (
    <div className="md:hidden flex flex-col p-4 gap-4 bg-gray-50/50 min-h-[480px]">
      {sellers.map((seller: SellerDetails, id: number) => {
        const isApproved = seller.adminIsApproved === "Approved";
        const isDeclined = seller.adminIsApproved === "Declined" || (seller.decline ? seller.decline.trim().length > 0 : false);
        const isPending = !isApproved && !isDeclined;

        return (
          <div
            key={seller._id || id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3.5 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  src={seller.sellerPhoto || "https://i.ibb.co/311H3rd/default-avatar.png"}
                  alt={seller.sellerName}
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{seller.sellerName}</p>
                  <p className="text-xs text-gray-500">{seller.sellerEmail}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-650">
              <div className="flex items-center gap-1.5">
                <FiPhone className="text-gray-400" />
                <span>{seller.mobile || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-gray-400" />
                <span className="truncate max-w-[250px]">{seller.address || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-1">
              {isApproved ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-55/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Approved
                </div>
              ) : isDeclined ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50/50 px-2.5 py-1 rounded-full border border-rose-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Declined
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onDetailsClick(seller)}
                  className="p-2 text-gray-500 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100"
                  title="View Details"
                >
                  <FiInfo />
                </button>
                {isPending && (
                  <>
                    <button
                      onClick={() => onApprove(seller)}
                      className="p-2 text-gray-500 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100"
                      title="Approve Seller"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => onDecline(seller)}
                      className="p-2 text-gray-500 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-lg transition-colors border border-gray-100"
                      title="Decline Seller"
                    >
                      <FiX />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(String(seller._id))}
                  className="p-2 text-gray-505 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-lg transition-colors border border-gray-100"
                  title="Delete Application"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

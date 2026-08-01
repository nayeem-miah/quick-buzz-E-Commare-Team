import React from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiMail, FiMapPin, FiPhone, FiX } from "react-icons/fi";

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

interface SellerRequestDetailsModalProps {
  seller: SellerDetails;
  onClose: () => void;
  onApprove: (seller: SellerDetails) => void;
  onDecline: (seller: SellerDetails) => void;
}

export const SellerRequestDetailsModal: React.FC<SellerRequestDetailsModalProps> = ({
  seller,
  onClose,
  onApprove,
  onDecline,
}) => {
  const isApproved = seller.adminIsApproved === "Approved";
  const isDeclined = seller.adminIsApproved === "Declined" || (seller.decline ? seller.decline.trim().length > 0 : false);
  const isPending = !isApproved && !isDeclined;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] animate-scaleIn flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h3 className="text-lg font-bold text-gray-950">
            Seller Request Details
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NID/Document Image Section */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">National ID Card / Trade License</p>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
              {seller.imageUrl ? (
                <img
                  src={seller.imageUrl}
                  alt="NID Document"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <span className="text-xs text-gray-400">Document image not uploaded</span>
              )}
            </div>
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">
                Why become a seller?
              </p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {seller.reason || "No statement provided."}
              </p>
            </div>
          </div>

          {/* Details Info Section */}
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
              <img
                className="h-11 w-11 rounded-full object-cover border border-gray-200"
                src={seller.sellerPhoto || "https://i.ibb.co/311H3rd/default-avatar.png"}
                alt={seller.sellerName}
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{seller.sellerName}</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 border ${
                    isApproved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : isDeclined
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                  }`}
                >
                  {isApproved ? "Approved" : isDeclined ? "Declined" : "Pending Approval"}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="font-semibold text-gray-750 flex items-center gap-1.5 mt-0.5">
                  <FiMail className="text-gray-400" />
                  {seller.sellerEmail || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile Number</p>
                <p className="font-semibold text-gray-750 flex items-center gap-1.5 mt-0.5">
                  <FiPhone className="text-gray-400" />
                  {seller.mobile || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Business Address</p>
                <p className="font-semibold text-gray-750 flex items-center gap-1.5 mt-0.5">
                  <FiMapPin className="text-gray-400" />
                  {seller.address || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Additional Information</p>
                <p className="font-medium text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-1 max-h-24 overflow-y-auto">
                  {seller.other || "No additional information provided."}
                </p>
              </div>

              {isDeclined && (
                <div className="bg-red-50/50 p-3.5 rounded-2xl border border-red-100/50">
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-1">Decline Reason</p>
                  <p className="text-xs text-red-700 leading-relaxed font-semibold">{seller.decline}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons inside Modal */}
        {isPending && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
            <button
              onClick={() => {
                onDecline(seller);
              }}
              className="px-4 py-2 text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold border border-rose-100 transition-colors flex items-center gap-1.5"
            >
              <FiX /> Decline
            </button>
            <button
              onClick={() => {
                onApprove(seller);
              }}
              className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-sm shadow-orange-500/10"
            >
              <FiCheck /> Approve Request
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

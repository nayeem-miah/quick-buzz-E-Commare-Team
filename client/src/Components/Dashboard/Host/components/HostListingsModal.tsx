import React from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Package, X, Edit, Trash2 } from "lucide-react";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../MyAddedProduct";

interface HostListingsModalProps {
  selectedBooking: Listing | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const HostListingsModal: React.FC<HostListingsModalProps> = ({
  selectedBooking,
  onClose,
  onDelete,
}) => {
  if (!selectedBooking) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Product Details</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {selectedBooking._id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Product Image */}
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
              <img
                src={selectedBooking.productImage}
                alt={selectedBooking.productTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Key Details */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base leading-snug">
                  {selectedBooking.productTitle}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Brand:{" "}
                  <span className="font-semibold text-gray-700">
                    {selectedBooking.brandName || "No Brand"}
                  </span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4">
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Price</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  ৳{selectedBooking.price?.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    Category
                  </span>
                  <span className="font-semibold text-gray-800">{selectedBooking.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    Stock
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedBooking.quantity !== undefined ? selectedBooking.quantity : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    Created
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedBooking.createdAt
                      ? new Date(selectedBooking.createdAt).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                  Approval Status
                </p>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${
                    selectedBooking.adminIsApproved === ApprovalStatus.APPROVED
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedBooking.adminIsApproved === ApprovalStatus.PENDING
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {selectedBooking.adminIsApproved === ApprovalStatus.APPROVED
                    ? "Approved"
                    : selectedBooking.adminIsApproved === ApprovalStatus.PENDING
                    ? "Pending Approval"
                    : "Rejected"}
                </span>
              </div>
            </div>
          </div>

          {/* Rejection Reason if Rejected */}
          {selectedBooking.adminIsApproved === ApprovalStatus.REJECTED && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs">
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                Rejection Reason
              </p>
              <p className="text-red-700 font-medium mt-1 leading-relaxed">
                {selectedBooking.feedback ||
                  selectedBooking.rejectionReason ||
                  "This product request was rejected by admin. Please update the details and submit again."}
              </p>
            </div>
          )}

          {/* Tags Section */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-xs">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Tags
            </p>
            <p className="text-gray-700 font-semibold">{selectedBooking.tags || "No tags specified"}</p>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-xs">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-gray-600 leading-relaxed">
              {selectedBooking.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
          <Link
            to={`/dashboard/update-product/${selectedBooking._id}`}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Product</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onDelete(selectedBooking._id);
              onClose();
            }}
            className="flex-1 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

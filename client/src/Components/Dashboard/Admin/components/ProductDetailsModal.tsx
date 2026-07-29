import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ApprovalStatus } from "../../../../constants/enums";
import { Listing } from "../../../../types/listing.type";

interface ProductDetailsModalProps {
  selectedBooking: Listing;
  onClose: () => void;
  onStatusChange: (product: Listing, status: string) => void;
  onDelete: (id: string | number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  selectedBooking,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 aspect-square">
              <img src={selectedBooking.productImage} alt={selectedBooking.productTitle} className="w-full h-full object-cover" />
              {selectedBooking.discount && Number(selectedBooking.discount) > 0 ? (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {selectedBooking.discount}% OFF
                </span>
              ) : null}
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {selectedBooking.category}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-6 text-gray-700 text-sm">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{selectedBooking.productTitle}</h4>
                <p className="text-orange-500 font-medium text-base">{selectedBooking.brandName}</p>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-gray-900">
                  ৳{selectedBooking.discount ? (Number(selectedBooking.price) * (1 - Number(selectedBooking.discount) / 100)).toLocaleString() : Number(selectedBooking.price).toLocaleString()}
                </span>
                {selectedBooking.discount && Number(selectedBooking.discount) > 0 && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    ৳{Number(selectedBooking.price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-xs text-orange-600/70 font-semibold mb-1 uppercase tracking-wider">Category</p>
                  <p className="font-bold text-gray-900">{selectedBooking.category}</p>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-xs text-orange-600/70 font-semibold mb-1 uppercase tracking-wider">Stock Quantity</p>
                  <p className="font-bold text-gray-900">{selectedBooking.quantity || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Status</p>
                  <span className={`font-bold capitalize ${
                    selectedBooking.adminIsApproved === ApprovalStatus.APPROVED ? 'text-green-600' :
                    selectedBooking.adminIsApproved === ApprovalStatus.REJECTED ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {selectedBooking.adminIsApproved || 'Pending'}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Created Date</p>
                  <p className="font-bold text-gray-800">
                    {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <img
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                  src={selectedBooking.hostPhoto || "https://via.placeholder.com/150"}
                  alt={selectedBooking.hostName}
                />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Seller Information</p>
                  <p className="font-bold text-gray-900 text-base">{selectedBooking.hostName}</p>
                  <p className="text-gray-500 text-sm">{selectedBooking.hostEmail}</p>
                </div>
              </div>

              <div>
                <h5 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Full Description</h5>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {selectedBooking.description || "No description provided."}
                </p>
              </div>
              
              {selectedBooking.tags && (
                <div>
                  <h5 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onClose(); navigate(`/dashboard/update-product/${selectedBooking._id}`); }}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <FiEdit size={16} /> Edit
            </button>
            <button
              onClick={() => { onClose(); onDelete(selectedBooking._id); }}
              className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <FiTrash2 size={16} /> Delete
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedBooking.adminIsApproved !== ApprovalStatus.REJECTED && (
              <button
                onClick={() => { onStatusChange(selectedBooking, ApprovalStatus.REJECTED); }}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-sm font-bold transition-all shadow-sm"
              >
                Reject
              </button>
            )}
            {selectedBooking.adminIsApproved !== ApprovalStatus.APPROVED && (
              <button
                onClick={() => { onStatusChange(selectedBooking, ApprovalStatus.APPROVED); }}
                className="px-6 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all"
              >
                Approve
              </button>
            )}
            {selectedBooking.adminIsApproved === ApprovalStatus.APPROVED && (
              <button
                onClick={() => { onStatusChange(selectedBooking, ApprovalStatus.PENDING); }}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-sm font-bold transition-all"
              >
                Mark as Pending
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

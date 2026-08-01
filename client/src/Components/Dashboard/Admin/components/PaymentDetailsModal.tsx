import React from "react";
import { createPortal } from "react-dom";
import { FiDollarSign, FiCalendar, FiCheck, FiCopy, FiCreditCard } from "react-icons/fi";
import { PaymentHistory } from "../../../../types/payment";
import { PaymentStatus, ApprovalStatus } from "../../../../constants/enums";

interface PaymentDetailsModalProps {
  payment: PaymentHistory;
  onClose: () => void;
  formatDate: (date?: string | number | Date) => string;
  onCopyTrx: (trxId: string) => void;
  copiedTrx: string | null;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  formatDate,
  onCopyTrx,
  copiedTrx,
}) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h3 className="text-lg font-bold text-gray-955 flex items-center gap-2">
            <FiDollarSign className="text-orange-555 text-orange-500" />
            Payment Details
          </h3>
          <button
            className="text-gray-400 hover:text-gray-655 hover:text-gray-600 text-sm font-semibold transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer Name</p>
              <p className="font-bold text-gray-955 mt-0.5">{payment?.cus_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-gray-750 mt-0.5">{payment?.cus_email || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Date</p>
              <p className="font-semibold text-gray-700 mt-0.5 flex items-center gap-1.5">
                <FiCalendar className="text-gray-400" />
                {formatDate(payment?.date || payment?.tran_date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Transaction ID</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="font-mono font-bold text-orange-500 text-xs">{payment?.transactionId || "N/A"}</p>
                {payment?.transactionId && payment.transactionId !== "N/A" && (
                  <button
                    onClick={() => onCopyTrx(payment.transactionId!)}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {copiedTrx === payment.transactionId ? (
                      <FiCheck className="text-green-600" size={13} />
                    ) : (
                      <FiCopy size={13} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Amount Paid</p>
              <p className="font-black text-gray-955 mt-0.5">
                ৳{(payment?.amount || payment?.totalPrice)?.toLocaleString()} BDT
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Method</p>
              <p className="font-semibold text-gray-700 mt-0.5 flex items-center gap-1.5">
                <FiCreditCard className="text-gray-400" />
                {payment?.payment_method || "Card"} {payment?.card_type ? `(${payment.card_type})` : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                  payment?.status === PaymentStatus.SUCCESS
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {payment?.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Approval Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                  payment?.hostIsApproved === ApprovalStatus.APPROVED
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {payment?.hostIsApproved || "Pending"}
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="pt-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Purchased Products</p>
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
              {payment?.productTitle?.map((title: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <img
                    src={payment?.productImage?.[index] || ""}
                    alt={title || "Product"}
                    className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">
                      {title || "Unnamed Product"}
                    </p>
                    <p className="text-[10px] text-gray-505 text-gray-500 font-semibold mt-0.5">
                      Brand: {payment?.brandName?.[index] || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-55 border-gray-50">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Host Contacts</p>
            <p className="font-semibold text-gray-650 mt-1 select-all font-mono text-xs bg-gray-50 p-2 rounded border border-gray-100" title="Click to select all">
              {payment?.hostEmail?.join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

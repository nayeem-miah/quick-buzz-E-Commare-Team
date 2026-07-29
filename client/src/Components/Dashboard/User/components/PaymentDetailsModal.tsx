/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { PaymentStatus, ApprovalStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface PaymentDetailsModalProps {
  payment: PaymentHistory | null;
  onClose: () => void;
  formatDate: (dateStr?: string | number | Date) => string;
  copiedTrx: string | null;
  onCopyTrx: (trxId: string) => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  formatDate,
  copiedTrx,
  onCopyTrx,
}) => {
  if (!payment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl border border-gray-100 shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
          <h3 className="text-lg font-bold text-gray-950">Payment Details</h3>
          <button
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer Name</p>
              <p className="font-bold text-gray-950 mt-0.5">{payment.cus_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-gray-700 mt-0.5">{payment.cus_email || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Date</p>
              <p className="font-semibold text-gray-700 mt-0.5">{formatDate(payment.date || payment.tran_date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Transaction ID</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="font-bold text-orange-500">{payment.transactionId || "N/A"}</p>
                {payment.transactionId && payment.transactionId !== "N/A" && (
                  <button
                    onClick={() => onCopyTrx(payment.transactionId!)}
                    className="text-gray-400 hover:text-orange-500 transition"
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

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Amount Paid</p>
              <p className="font-black text-gray-950 mt-0.5">৳{payment.totalPrice?.toLocaleString()} {payment.currency || "BDT"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Card Type</p>
              <p className="font-semibold text-gray-700 mt-0.5">{payment.card_type || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                  payment.status === PaymentStatus.SUCCESS
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {payment.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Approval Status</p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                  payment.hostIsApproved === ApprovalStatus.APPROVED
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {payment.hostIsApproved || "Pending"}
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="pt-2">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Purchased Products</p>
            <div className="space-y-3">
              {payment.productTitle?.map((title: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <img
                    src={payment.productImage?.[index] || ""}
                    alt={title || "Product"}
                    className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">
                      {title || "Unnamed Product"}
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                      Brand: {payment.brandName?.[index] || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

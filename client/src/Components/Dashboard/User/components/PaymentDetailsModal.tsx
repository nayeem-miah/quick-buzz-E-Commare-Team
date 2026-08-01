/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiCheck, FiCopy, FiX, FiCalendar, FiCreditCard, FiDollarSign, FiTag, FiShoppingBag } from "react-icons/fi";
import { PaymentStatus, ApprovalStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface PaymentDetailsModalProps {
  payment: PaymentHistory | null;
  onClose: () => void;
  formatDate: (dateStr?: string | number | Date) => string;
  copiedTrx: string | null;
  onCopyTrx: (trxId: string) => void;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  formatDate,
  copiedTrx,
  onCopyTrx,
}) => {
  if (!payment) return null;

  const isPaid = payment.status === PaymentStatus.SUCCESS;
  const isFailed = payment.status === PaymentStatus.FAILED;
  const isApproved = payment.hostIsApproved === ApprovalStatus.APPROVED;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <FiCreditCard className="text-orange-500" size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Payment Details</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Transaction summary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Amount Hero */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Amount Paid</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                ৳{payment.totalPrice?.toLocaleString()}
                <span className="text-xs font-semibold text-gray-400 ml-1.5">{payment.currency || "BDT"}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                isPaid
                  ? "bg-green-50 text-green-700 border-green-200"
                  : isFailed
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
                {isPaid ? "Paid" : isFailed ? "Failed" : "Pending"}
              </span>
              <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                isApproved
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
                {payment.hostIsApproved || "Pending"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FiTag size={10} /> Customer Info
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow label="Name" value={payment.cus_name || "N/A"} />
              <InfoRow
                label="Email"
                value={
                  <span className="break-all text-sm font-semibold text-gray-700">
                    {payment.cus_email || "N/A"}
                  </span>
                }
              />
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FiDollarSign size={10} /> Transaction Info
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                label="Date"
                value={
                  <span className="flex items-center gap-1.5">
                    <FiCalendar size={12} className="text-gray-400" />
                    {formatDate(payment.date || payment.tran_date)}
                  </span>
                }
              />
              <InfoRow label="Card / Method" value={payment.card_type || payment.payment_method || "N/A"} />
              <div className="sm:col-span-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Transaction ID</p>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <p className="font-mono text-xs font-bold text-orange-500 truncate flex-1">
                    {payment.transactionId || "N/A"}
                  </p>
                  {payment.transactionId && payment.transactionId !== "N/A" && (
                    <button
                      onClick={() => onCopyTrx(payment.transactionId!)}
                      className="flex-shrink-0 p-1 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
                      title="Copy Transaction ID"
                    >
                      {copiedTrx === payment.transactionId ? (
                        <FiCheck className="text-green-500" size={13} />
                      ) : (
                        <FiCopy size={13} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {payment.productTitle && payment.productTitle.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiShoppingBag size={10} /> Purchased Products ({payment.productTitle.length})
              </p>
              <div className="space-y-2">
                {payment.productTitle.map((title: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 p-3 rounded-xl transition-colors duration-150"
                  >
                    <img
                      src={payment.productImage?.[index] || ""}
                      alt={title || "Product"}
                      className="w-11 h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-900 truncate">{title || "Unnamed Product"}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Brand: {payment.brandName?.[index] || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

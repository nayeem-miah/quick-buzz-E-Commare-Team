import React from "react";
import { createPortal } from "react-dom";
import {
  FiCalendar,
  FiCheck,
  FiCopy,
  FiCreditCard,
  FiInbox,
  FiShoppingBag,
  FiX,
  FiMail
} from "react-icons/fi";
import { ApprovalStatus, PaymentStatus } from "../../../../constants/enums";
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

  const isPaid = payment.status === PaymentStatus.SUCCESS;
  const isFailed = payment.status === PaymentStatus.FAILED;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 w-full max-w-sm overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <FiCreditCard size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">Payment Details</h3>
            </div>
          </div>
          <button
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4 text-xs scrollbar-thin">
          
          {/* Amount Hero Box */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</p>
              <p className="text-xl font-black text-slate-950 mt-0.5 flex items-baseline">
                <span className="text-orange-500 font-bold mr-0.5">৳</span>
                {Number(payment?.amount || payment?.totalPrice || 0).toLocaleString()}
                <span className="text-[9px] font-bold text-slate-400 ml-1">BDT</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isPaid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                    : isFailed
                    ? "bg-rose-50 text-rose-700 border-rose-250"
                    : "bg-amber-50 text-amber-700 border-amber-250"
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${isPaid ? "bg-emerald-500 animate-pulse" : isFailed ? "bg-rose-500" : "bg-amber-500"}`} />
                {isPaid ? "Paid" : isFailed ? "Failed" : "Pending"}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  payment?.hostIsApproved === ApprovalStatus.APPROVED
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-750 border-yellow-200"
                }`}
              >
                {payment?.hostIsApproved
                  ? payment.hostIsApproved.charAt(0).toUpperCase() + payment.hostIsApproved.slice(1).toLowerCase()
                  : "Pending"}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3.5 space-y-3 shadow-sm">
            <div className="flex justify-between items-center gap-2">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Method</p>
                <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 text-[9px] bg-slate-100 text-slate-700 rounded font-bold uppercase border border-slate-200/80">
                    {payment?.payment_method || "Card"}
                  </span>
                  {payment?.card_type && <span className="text-slate-400 font-medium">({payment.card_type})</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                <p className="font-semibold text-slate-700 text-xs mt-0.5 flex items-center justify-end gap-1">
                  <FiCalendar size={11} className="text-slate-400" />
                  {formatDate(payment?.date || payment?.tran_date)}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2.5">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Transaction ID</p>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 mt-1 gap-2">
                <span className="font-mono font-bold text-slate-800 text-xs truncate">
                  {payment?.transactionId || "N/A"}
                </span>
                {payment?.transactionId && payment.transactionId !== "N/A" && (
                  <button
                    onClick={() => onCopyTrx(payment.transactionId!)}
                    className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all flex-shrink-0"
                    title="Copy Transaction ID"
                  >
                    {copiedTrx === payment.transactionId ? (
                      <FiCheck className="text-emerald-600" size={11} />
                    ) : (
                      <FiCopy size={11} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Products */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiShoppingBag size={11} className="text-slate-400" />
                Items Purchased
              </p>
              <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                {payment?.productTitle?.length || 0} {payment?.productTitle?.length === 1 ? "item" : "items"}
              </span>
            </div>
            
            <div className="space-y-2 max-h-28 overflow-y-auto pr-0.5">
              {payment?.productTitle && payment.productTitle.length > 0 ? (
                payment.productTitle.map((title: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-50/50 p-2 rounded-xl border border-slate-100 hover:bg-orange-50/10 transition-colors duration-150 group"
                  >
                    <div className="w-8 h-8 rounded bg-white border border-slate-200 overflow-hidden flex-shrink-0 relative">
                      <img
                        src={payment?.productImage?.[index] || ""}
                        alt={title || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Product";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[10px] text-slate-900 group-hover:text-orange-500 transition-colors truncate">
                        {title || "Unnamed Product"}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        Brand: <span className="font-semibold text-slate-600">{payment?.brandName?.[index] || "Generic"}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-slate-400">
                  <FiInbox size={18} />
                  <p className="text-[9px] mt-1">No products listed</p>
                </div>
              )}
            </div>
          </div>

          {/* Host Contacts */}
          {payment?.hostEmail && payment.hostEmail.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FiMail size={11} className="text-slate-400" />
                Host Contacts
              </p>
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2.5 overflow-hidden">
                <span className="font-mono text-[10px] text-slate-700 select-all truncate font-semibold break-all whitespace-normal" title="Double click to select all">
                  {payment.hostEmail.join(", ")}
                </span>
                <button
                  onClick={() => {
                    const emails = payment.hostEmail!.join(", ");
                    navigator.clipboard.writeText(emails);
                    import("react-hot-toast").then((m) => m.default.success("Host email(s) copied to clipboard!")).catch(console.error);
                  }}
                  className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 active:scale-95 transition-all flex-shrink-0"
                  title="Copy host emails"
                >
                  <FiCopy size={10} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

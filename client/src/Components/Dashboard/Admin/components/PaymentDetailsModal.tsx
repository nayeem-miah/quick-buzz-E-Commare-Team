import React from "react";
import { createPortal } from "react-dom";
import {
  FiCalendar,
  FiCheck,
  FiCopy,
  FiCreditCard,
  FiDollarSign,
  FiInbox,
  FiMail,
  FiShoppingBag,
  FiUser,
  FiX
} from "react-icons/fi";
import { ApprovalStatus, PaymentStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-5 sm:p-6 w-full max-w-md overflow-y-auto max-h-[85vh] sm:max-h-[90vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
              <FiDollarSign size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">Payment Details</h3>
              <p className="text-[10px] text-slate-400 font-medium">Detailed transaction summary</p>
            </div>
          </div>
          <button
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">

          {/* Transaction Summary Card */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 rounded-2xl p-4 border border-slate-100/80 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</p>
                <p className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 flex items-baseline gap-0.5">
                  <span className="text-orange-500 font-bold">৳</span>
                  {Number(payment?.amount || payment?.totalPrice || 0).toLocaleString()}
                  <span className="text-[10px] font-bold text-slate-400 ml-1">BDT</span>
                </p>
              </div>
              <div className="flex sm:flex-col justify-between items-center sm:items-end gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block sm:hidden">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-sm ${
                    payment?.status === PaymentStatus.SUCCESS
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    payment?.status === PaymentStatus.SUCCESS ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`} />
                  {payment?.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</p>
                <div className="flex items-center gap-1.5 mt-0.5 max-w-full overflow-hidden">
                  <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200/80 px-2 py-0.5 rounded text-[11px] shadow-sm truncate max-w-[200px] sm:max-w-none">
                    {payment?.transactionId || "N/A"}
                  </span>
                  {payment?.transactionId && payment.transactionId !== "N/A" && (
                    <button
                      onClick={() => onCopyTrx(payment.transactionId!)}
                      className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-sm active:scale-95 transition-all flex-shrink-0"
                      title="Copy Transaction ID"
                    >
                      {copiedTrx === payment.transactionId ? (
                        <FiCheck className="text-emerald-600" size={12} />
                      ) : (
                        <FiCopy size={12} />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex sm:flex-col justify-between items-center sm:items-end gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block sm:hidden">Approval</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-sm ${
                    payment?.hostIsApproved === ApprovalStatus.APPROVED
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {payment?.hostIsApproved
                    ? payment.hostIsApproved.charAt(0).toUpperCase() + payment.hostIsApproved.slice(1).toLowerCase()
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Customer Details Card */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiUser className="text-slate-400" />
                Customer Details
              </h4>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 font-medium">Name</p>
                <p className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={payment?.cus_name || "N/A"}>
                  {payment?.cus_name || "N/A"}
                </p>
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 font-medium">Email Address</p>
                <p className="font-semibold text-slate-700 text-xs truncate select-all" title={payment?.cus_email || "N/A"}>
                  {payment?.cus_email || "N/A"}
                </p>
              </div>
            </div>

            {/* Payment Method & Date Card */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiCreditCard className="text-slate-400" />
                Payment Info
              </h4>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 font-medium">Method</p>
                <p className="font-semibold text-slate-800 text-xs flex items-center gap-1 truncate">
                  <span className="px-1.5 py-0.5 text-[9px] bg-slate-100 text-slate-700 border border-slate-200/80 rounded font-bold uppercase">
                    {payment?.payment_method || "Card"}
                  </span>
                  {payment?.card_type ? <span className="text-slate-400 font-medium text-[10px]">({payment.card_type})</span> : ""}
                </p>
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-slate-400 font-medium">Transaction Date</p>
                <p className="font-semibold text-slate-700 text-xs flex items-center gap-1 truncate">
                  <FiCalendar className="text-slate-400" />
                  {formatDate(payment?.date || payment?.tran_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Products */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FiShoppingBag className="text-slate-400" />
                Purchased Products
              </p>
              <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                {payment?.productTitle?.length || 0} {payment?.productTitle?.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
              {payment?.productTitle && payment.productTitle.length > 0 ? (
                payment.productTitle.map((title: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100 hover:bg-orange-50/10 hover:border-orange-100/50 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-lg border border-slate-250/80 overflow-hidden bg-white flex-shrink-0 relative">
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
                      <p className="font-bold text-[11px] text-slate-900 group-hover:text-orange-500 transition-colors truncate">
                        {title || "Unnamed Product"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Brand:</span>
                        <span className="text-[9px] bg-white border border-slate-200 text-slate-600 px-1 py-0.1 rounded font-semibold shadow-sm truncate max-w-[120px]">
                          {payment?.brandName?.[index] || "Generic"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-5 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-slate-400">
                  <FiInbox size={20} />
                  <p className="text-[10px] mt-1 font-medium">No products listed</p>
                </div>
              )}
            </div>
          </div>

          {/* Host Contacts */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FiMail className="text-slate-400" />
              Host Contacts
            </p>
            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2.5 group/host overflow-hidden">
              <span className="font-mono text-[10px] sm:text-xs text-slate-700 select-all truncate font-semibold break-all whitespace-normal" title="Double click to select all">
                {payment?.hostEmail?.join(", ") || "No host emails listed"}
              </span>
              {payment?.hostEmail && payment.hostEmail.length > 0 && (
                <button
                  onClick={() => {
                    const emails = payment.hostEmail!.join(", ");
                    navigator.clipboard.writeText(emails);
                    import("react-hot-toast").then((m) => m.default.success("Host email(s) copied to clipboard!")).catch(console.error);
                  }}
                  className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-sm active:scale-95 transition-all flex-shrink-0"
                  title="Copy host emails"
                >
                  <FiCopy size={11} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

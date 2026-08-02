import { CreditCard, X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { ApprovalStatus, PaymentMethod } from "../../../../constants/enums";
import { HostPayment } from "./types";

interface Props {
  order: HostPayment;
  onClose: () => void;
  onApprove: (orderId: string, productTitle: string) => void;
}

const HostOrderModal: React.FC<Props> = ({ order, onClose, onApprove }) => {
  const getTitle = () =>
    Array.isArray(order.productTitle) ? order.productTitle[0] : order.productTitle || "";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Order Details</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Transaction summary</p>
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
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Amount Hero */}
          <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative z-10">
              <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Total Amount</p>
              <p className="text-3xl font-black text-white mt-1">৳{order.totalPrice?.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                  {order.payment_method === PaymentMethod.COD ? "💵 Cash on Delivery" : "💳 Online Payment"}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                    order.hostIsApproved === ApprovalStatus.APPROVED
                      ? "bg-green-500/20 text-white border-green-300/40"
                      : "bg-yellow-500/20 text-white border-yellow-300/40"
                  }`}
                >
                  {order.hostIsApproved === ApprovalStatus.APPROVED ? "✓ Approved" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">👤 Customer Info</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-black text-orange-500">
                  {(order.cus_name || "G")[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{order.cus_name || "N/A"}</p>
                <p className="text-xs text-gray-400 truncate">{order.cus_email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">🧾 Transaction Info</p>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-semibold">Date</span>
                <span className="text-xs font-bold text-gray-800 text-right">
                  {order.tran_date
                    ? new Date(order.tran_date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-semibold">Payment Method</span>
                <span className="text-xs font-bold text-gray-800">
                  {order.payment_method === PaymentMethod.COD ? "Cash on Delivery" : order.card_type || "Online"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold block mb-1.5">Transaction ID</span>
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                  <p className="font-mono text-xs font-bold text-orange-500 truncate">
                    {order.transactionId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {order.productTitle && (
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                📦 Products ({Array.isArray(order.productTitle) ? order.productTitle.length : 1})
              </p>
              <div className="space-y-2">
                {(Array.isArray(order.productTitle) ? order.productTitle : [order.productTitle]).map(
                  (title: string | undefined, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 p-3 rounded-2xl transition-all duration-200 shadow-sm"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={(order.productImage as string[])?.[index] || ""}
                          alt={title || "Product"}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 truncate">{title || "Unnamed Product"}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {(order.brandName as string[])?.[index] || "No Brand"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 flex gap-2.5">
          {order.hostIsApproved !== ApprovalStatus.APPROVED && (
            <button
              type="button"
              onClick={() => onApprove(order._id, getTitle())}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30"
            >
              ✓ Approve Order
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HostOrderModal;

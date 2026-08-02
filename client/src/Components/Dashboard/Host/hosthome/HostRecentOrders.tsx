import { ShoppingBag } from "lucide-react";
import React from "react";
import { ApprovalStatus, PaymentMethod } from "../../../../constants/enums";
import { HostPayment } from "./types";

interface Props {
  orders: HostPayment[];
  onView: (order: HostPayment) => void;
  onApprove: (orderId: string, productTitle: string) => void;
}

const HostRecentOrders: React.FC<Props> = ({ orders, onView, onApprove }) => {
  const getTitle = (order: HostPayment) =>
    Array.isArray(order.productTitle) ? order.productTitle[0] : order.productTitle || "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Orders</h2>
          <span className="text-[10px] text-gray-400">Latest active orders (online & COD)</span>
        </div>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 mx-6 mb-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
          <span className="p-3 bg-orange-50 rounded-xl text-orange-500 mb-3">
            <ShoppingBag className="w-5 h-5" />
          </span>
          <h3 className="text-sm font-bold text-gray-800">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-[240px] text-center mt-1">
            You haven't received any orders yet.
          </p>
        </div>
      ) : (
        <>
          {/* ── SM / MD: Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
            {orders.map((order, idx) => (
              <div
                key={order._id || idx}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        {order.cus_name || "Guest Customer"}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{order.cus_email}</p>
                      <span
                        className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                          order.payment_method === PaymentMethod.COD
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-purple-50 text-purple-600 border-purple-200"
                        }`}
                      >
                        {order.payment_method === PaymentMethod.COD ? "💵 COD" : "💳 Online"}
                      </span>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider flex-shrink-0 ${
                        order.hostIsApproved === ApprovalStatus.APPROVED
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {order.hostIsApproved === ApprovalStatus.APPROVED ? "Approved" : "Pending"}
                    </span>
                  </div>

                  {/* Card Body: Date & Amount */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-50 text-xs mb-3">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Date</p>
                      <p className="font-semibold text-gray-700 mt-1">
                        {order.tran_date
                          ? new Date(order.tran_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] text-right">Amount</p>
                      <p className="font-black text-orange-500 text-right mt-1">
                        ৳{order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => onView(order)}
                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl text-xs font-semibold transition"
                  >
                    View
                  </button>
                  {order.hostIsApproved !== ApprovalStatus.APPROVED && (
                    <button
                      type="button"
                      onClick={() => onApprove(order._id, getTitle(order))}
                      className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-orange-500/20"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── LG: Data Table ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  {["Customer", "Payment", "Date", "Amount", "Status", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider ${
                        i === 0 ? "text-left px-6" :
                        i === 3 ? "text-right px-4" :
                        i === 4 ? "text-center px-4" :
                        i === 5 ? "text-right px-6" :
                        "text-left px-4"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order, idx) => (
                  <tr key={order._id || idx} className="hover:bg-orange-50/30 transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-black text-orange-500">
                            {(order.cus_name || "G")[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
                            {order.cus_name || "Guest Customer"}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{order.cus_email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                          order.payment_method === PaymentMethod.COD
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-purple-50 text-purple-600 border-purple-200"
                        }`}
                      >
                        {order.payment_method === PaymentMethod.COD ? "💵 COD" : "💳 Online"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {order.tran_date
                          ? new Date(order.tran_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-black text-orange-500">
                        ৳{order.totalPrice?.toLocaleString()}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                          order.hostIsApproved === ApprovalStatus.APPROVED
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {order.hostIsApproved === ApprovalStatus.APPROVED ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onView(order)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg text-xs font-semibold transition"
                        >
                          View
                        </button>
                        {order.hostIsApproved !== ApprovalStatus.APPROVED && (
                          <button
                            type="button"
                            onClick={() => onApprove(order._id, getTitle(order))}
                            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition shadow-sm shadow-orange-500/20"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default HostRecentOrders;

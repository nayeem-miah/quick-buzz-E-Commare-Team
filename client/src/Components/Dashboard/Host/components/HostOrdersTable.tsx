import React from "react";
import { FiEye, FiCheck, FiTruck, FiXCircle } from "react-icons/fi";

interface HostOrder {
  _id: string;
  order_id?: string;
  status: string;
  totalPrice: number;
  cus_name?: string;
  cus_email?: string;
  tran_date?: string;
  transactionId?: string;
  card_type?: string;
  productTitle?: string | string[];
  productImage?: string | string[];
  brandName?: string | string[];
  hostIsApproved?: string;
  orderStatus?: string;
  trackingId?: string;
  currency?: string;
}

interface HostOrdersTableProps {
  orders: HostOrder[];
  onViewDetails: (order: HostOrder) => void;
  onApprove: (id: string, title: string) => void;
  onShip: (id: string, title: string) => void;
  onCancel: (id: string, title: string) => void;
}

export const HostOrdersTable: React.FC<HostOrdersTableProps> = ({
  orders,
  onViewDetails,
  onApprove,
  onShip,
  onCancel,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status?: string) => {
    const s = status || "pending";
    switch (s.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200">
            Pending (COD)
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-200">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-green-50 text-green-700 border-green-200">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-red-50 text-red-700 border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-gray-50 text-gray-700 border-gray-200">
            {s}
          </span>
        );
    }
  };

  return (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
            <th className="py-4 px-6 text-left">Customer</th>
            <th className="py-4 px-6 text-left">Date</th>
            <th className="py-4 px-6 text-right">Amount</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => {
            const productTitle = Array.isArray(order.productTitle)
              ? order.productTitle[0]
              : order.productTitle || "";
            const currentStatus = (order.orderStatus || "pending").toLowerCase();

            return (
              <tr
                key={order._id || idx}
                className={`border-b border-gray-50 hover:bg-orange-50/20 transition duration-150 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="py-5 px-6">
                  <p className="text-sm font-bold text-gray-900">{order.cus_name || "Guest Customer"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.cus_email}</p>
                </td>
                <td className="py-5 px-6 text-sm text-gray-500 font-medium">
                  {formatDate(order.tran_date)}
                </td>
                <td className="py-5 px-6 text-sm font-bold text-gray-900 text-right">
                  ৳{order.totalPrice?.toLocaleString()}
                </td>
                <td className="py-5 px-6 text-center">
                  {renderStatusBadge(order.orderStatus)}
                  {order.trackingId && (
                    <p className="text-[9px] font-mono text-gray-400 mt-1 truncate max-w-[150px] mx-auto">
                      Trk: {order.trackingId}
                    </p>
                  )}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order)}
                      className="px-3.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-orange-100"
                    >
                      <FiEye size={13} /> View
                    </button>

                    {currentStatus === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(order.order_id || order._id, productTitle)}
                          className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm shadow-orange-500/20"
                        >
                          <FiCheck size={13} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancel(order.order_id || order._id, productTitle)}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition border border-red-200"
                        >
                          <FiXCircle size={13} /> Cancel
                        </button>
                      </>
                    )}

                    {currentStatus === "processing" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onShip(order.order_id || order._id, productTitle)}
                          className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm shadow-orange-500/20"
                        >
                          <FiTruck size={13} /> Ship
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancel(order.order_id || order._id, productTitle)}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition border border-red-200"
                        >
                          <FiXCircle size={13} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

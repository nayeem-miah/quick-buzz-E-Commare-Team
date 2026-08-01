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

interface HostOrdersCardsProps {
  orders: HostOrder[];
  onViewDetails: (order: HostOrder) => void;
  onApprove: (id: string, title: string) => void;
  onShip: (id: string, title: string) => void;
  onCancel: (id: string, title: string) => void;
}

export const HostOrdersCards: React.FC<HostOrdersCardsProps> = ({
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
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-200">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-green-50 text-green-700 border-green-200">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-red-50 text-red-700 border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider bg-gray-50 text-gray-700 border-gray-200">
            {s}
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {orders.map((order, idx) => {
        const productTitle = Array.isArray(order.productTitle)
          ? order.productTitle[0]
          : order.productTitle || "";
        const currentStatus = (order.orderStatus || "pending").toLowerCase();

        return (
          <div
            key={order._id || idx}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="p-5 border-b border-gray-50 flex justify-between items-start">
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {order.cus_name || "Guest Customer"}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{order.cus_email}</p>
              </div>
              {renderStatusBadge(order.orderStatus)}
            </div>

            {/* Card Body */}
            <div className="p-5 grid grid-cols-2 gap-3 text-xs bg-gray-50/40">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                <p className="font-semibold text-gray-700 mt-0.5">{formatDate(order.tran_date)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</p>
                <p className="font-black text-orange-500 mt-0.5">
                  ৳{order.totalPrice?.toLocaleString()}
                </p>
              </div>
              {order.trackingId && (
                <div className="col-span-2 mt-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tracking Info</p>
                  <p className="font-mono text-xs text-gray-600 mt-0.5 break-all">{order.trackingId}</p>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex flex-wrap items-center gap-2 bg-white">
              <button
                type="button"
                onClick={() => onViewDetails(order)}
                className="flex-1 min-w-[70px] py-2 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <FiEye size={13} />
                <span>View</span>
              </button>

              {currentStatus === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => onApprove(order.order_id || order._id, productTitle)}
                    className="flex-1 min-w-[90px] py-2 rounded-xl border border-orange-100 bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm shadow-orange-500/20"
                  >
                    <FiCheck size={13} />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancel(order.order_id || order._id, productTitle)}
                    className="flex-1 min-w-[80px] py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FiXCircle size={13} />
                    <span>Cancel</span>
                  </button>
                </>
              )}

              {currentStatus === "processing" && (
                <>
                  <button
                    type="button"
                    onClick={() => onShip(order.order_id || order._id, productTitle)}
                    className="flex-1 min-w-[90px] py-2 rounded-xl border border-orange-100 bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm shadow-orange-500/20"
                  >
                    <FiTruck size={13} />
                    <span>Ship</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancel(order.order_id || order._id, productTitle)}
                    className="flex-1 min-w-[80px] py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FiXCircle size={13} />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

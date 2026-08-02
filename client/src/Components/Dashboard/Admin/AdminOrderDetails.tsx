/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiCreditCard, FiInfo, FiMapPin, FiPackage, FiTruck, FiUser, FiXCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";

import { OrderStatus, PaymentStatus } from "../../../constants/enums";
import { Order, OrderItem, OrderStatusHistory, Payment } from "../../../types/order";

interface OrderInfoResponse {
  order: Order;
  items: OrderItem[];
  payment: Payment | null;
}

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);


  const { data: orderInfo, isLoading, refetch } = useQuery<OrderInfoResponse>({
    queryKey: ["adminOrderDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });


  const { data: history = [], refetch: refetchHistory } = useQuery<OrderStatusHistory[]>({
    queryKey: ["adminOrderHistory", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${id}/history`);
      return res.data.data;
    },
    enabled: !!id
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case OrderStatus.PROCESSING:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case OrderStatus.SHIPPED:
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case OrderStatus.DELIVERED:
        return "bg-green-50 text-green-700 border-green-200";
      case OrderStatus.CANCELLED:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    setUpdatingStatus(newStatus);
    const loadToast = toast.loading(`Updating status to ${newStatus}...`);

    try {
      let res;
      if (newStatus === OrderStatus.DELIVERED) {
        res = await axiosSecure.patch(`/orders/${id}/deliver`);
      } else if (newStatus === OrderStatus.CANCELLED) {
        res = await axiosSecure.patch(`/orders/${id}/cancel`);
      } else {
        res = await axiosSecure.patch(`/orders/${id}/status`, { status: newStatus });
      }

      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}!`, { id: loadToast });
        refetch();
        refetchHistory();
      } else {
        throw new Error(res.data?.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status. Please try again.", { id: loadToast });
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!orderInfo) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
        <button onClick={() => navigate("/dashboard/manage-orders")} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl">
          Back to Orders
        </button>
      </div>
    );
  }

  const { order, items, payment } = orderInfo;
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isDelivered = order.status === OrderStatus.DELIVERED;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-6 text-slate-800 animate-fadeIn">
      <Helmet>
        <title>Order Details Admin | QuickBuzz</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/manage-orders")}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500"
            title="Back to Orders"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Order Details
              <span className="font-mono text-sm font-bold text-slate-400">#{order._id}</span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
              <FiCalendar /> {formatDate(order.date)} at {formatTime(order.date)}
            </p>
          </div>
        </div>

        {/* Action Controls for Admin */}
        <div className="flex flex-wrap items-center gap-2">
          {!isCancelled && !isDelivered && (
            <>
              <button
                disabled={!!updatingStatus}
                onClick={() => handleUpdateStatus(OrderStatus.PROCESSING)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition active:scale-95 flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 ${updatingStatus === OrderStatus.PROCESSING ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiPackage size={13} /> Process
              </button>
              <button
                disabled={!!updatingStatus}
                onClick={() => handleUpdateStatus(OrderStatus.SHIPPED)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition active:scale-95 flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 ${updatingStatus === OrderStatus.SHIPPED ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiTruck size={13} /> Ship
              </button>
              <button
                disabled={!!updatingStatus}
                onClick={() => handleUpdateStatus(OrderStatus.DELIVERED)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition active:scale-95 flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 ${updatingStatus === OrderStatus.DELIVERED ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiCheck size={13} /> Deliver
              </button>
              <button
                disabled={!!updatingStatus}
                onClick={() => handleUpdateStatus(OrderStatus.CANCELLED)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition active:scale-95 flex items-center gap-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 ${updatingStatus === OrderStatus.CANCELLED ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiXCircle size={13} /> Cancel
              </button>
            </>
          )}

          {isCancelled && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 text-red-700 border border-red-250">
              Order Cancelled
            </span>
          )}

          {isDelivered && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-green-50 text-green-700 border border-green-250">
              Order Delivered
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Order Items & Overview */}
        <div className="lg:col-span-2 space-y-6">

          {/* Status Progress Header */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>
            {/* Simple Step Indicator */}
            <div className="flex items-center justify-between pt-2">
              {[OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED].map((step, idx, arr) => {
                const isCurrent = order.status === step;
                const isPast = arr.indexOf(order.status as OrderStatus) >= idx && order.status !== OrderStatus.CANCELLED;

                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all ${
                        isCurrent ? 'bg-orange-500 border-orange-500 text-white shadow-md' :
                        isPast ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 capitalize ${
                        isCurrent ? 'text-orange-500 font-extrabold' : isPast ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className={`h-0.5 flex-1 transition-all ${isPast && arr.indexOf(order.status as OrderStatus) > idx ? 'bg-slate-900' : 'bg-slate-100'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <FiPackage size={15} /> Order Items
            </h3>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item._id} className="py-4 flex gap-4 items-center first:pt-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-white">
                    <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate" title={item.productTitle}>
                      {item.productTitle}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Brand: {item.brandName || "Generic"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ৳{(item.price * (1 - (item.discount || 0) / 100)).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <FiUser size={15} /> Customer & Shipping
            </h3>

            <div className="space-y-3.5">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Customer Details</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{order.shipping_address?.name || "N/A"}</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{order.email}</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{order.shipping_address?.phone}</p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><FiMapPin /> Delivery Address</p>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-1">
                  {order.shipping_address?.address}, {order.shipping_address?.city}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><FiCreditCard /> Payment Information</p>
                <div className="mt-1 flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>{order.payment_method}</span>
                  {payment && (
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      payment.status === PaymentStatus.SUCCESS
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {payment.status === PaymentStatus.SUCCESS ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </div>
                {payment?.transaction_id && (
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Trx: {payment.transaction_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log / Status History */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <FiInfo size={15} /> Status Activity History
            </h3>

            <div className="relative border-l border-slate-150 pl-4 space-y-5 ml-1.5 py-1">
              {history.length > 0 ? (
                history.map((log) => (
                  <div key={log._id} className="relative text-xs">
                    <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white" />
                    <p className="font-extrabold text-slate-800 capitalize">
                      Status changed to: {log.new_status}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                      <FiClock /> {formatDate(log.timestamp)} at {formatTime(log.timestamp)}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5 capitalize">
                      By: {log.changed_by_user_id} ({log.changed_by_role})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-semibold italic">No activity log found for this order.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;

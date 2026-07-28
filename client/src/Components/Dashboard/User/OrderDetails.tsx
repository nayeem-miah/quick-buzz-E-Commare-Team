/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCreditCard, FiPackage, FiRefreshCw, FiTruck, FiXCircle } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";

import { Order, OrderItem, Payment } from "../../../types/order";

interface OrderInfoResponse {
  order: Order;
  items: OrderItem[];
  payment: Payment | null;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);

  // Fetch single order details
  const { data: orderInfo, isLoading, refetch } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
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

  const handleCancelOrder = () => {
    Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axiosPublic.patch(`/orders/${id}/status`, { status: "cancelled" });
          Swal.fire({
            title: "Cancelled!",
            text: "Your order has been cancelled successfully.",
            icon: "success",
            confirmButtonColor: "#f97316",
          });
          refetch();
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to cancel order.", "error");
        }
      }
    });
  };

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      for (const item of items) {
        await axiosPublic.post("/cart", {
          email: user?.email,
          product_id: item.product_id,
          quantity: item.quantity
        });
      }
      toast.success("Items added to your cart!");
      navigate("/dashboard/my-listings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reorder items. Please try again.");
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!orderInfo || !orderInfo.order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  const { order, items = [], payment } = orderInfo as OrderInfoResponse;

  // Subtotal and discount math
  const subtotal = items.reduce(
    (total: number, item: OrderItem) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = items.reduce(
    (total: number, item: OrderItem) =>
      total + (item.price || 0) * ((item.discount || 0) / 100) * (item.quantity || 1),
    0
  );

  // Timeline Steps
  const steps = [
    { label: "Placed", status: "pending" },
    { label: "Processing", status: "processing" },
    { label: "Shipped", status: "shipped" },
    { label: "Delivered", status: "delivered" }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "pending": return 0;
      case "processing": return 1;
      case "shipped": return 2;
      case "delivered": return 3;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      <Helmet>
        <title>Order Details #{id} | QuickBuzz</title>
      </Helmet>

      {/* Back button */}
      <div>
        <Link
          to="/dashboard/my-orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition font-semibold"
        >
          <FiArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
            Order <span className="text-orange-500">#{order._id.substring(order._id.length - 8)}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {formatDate(order.date)} at {formatTime(order.date)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
          {(order.status === "pending" || order.status === "processing") && (
            <button
              onClick={handleCancelOrder}
              className="px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100 flex items-center gap-1.5 shadow-sm shadow-red-500/5"
            >
              <FiXCircle size={14} /> Cancel Order
            </button>
          )}
          <button
            onClick={handleReorder}
            disabled={isReordering}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 disabled:bg-orange-300"
          >
            <FiRefreshCw size={14} className={isReordering ? "animate-spin" : ""} /> Reorder
          </button>
        </div>
      </div>

      {/* Status Timeline */}
      {order.status === "cancelled" ? (
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 text-center font-bold text-sm">
          This order has been cancelled.
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Order Status Timeline</p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            {/* Horizontal progress connectors */}
            <div className="absolute top-[15px] left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden md:block z-0" />
            <div
              className="absolute top-[15px] left-0 h-1 bg-orange-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
              style={{ width: `${currentStep >= 0 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isActive = idx === currentStep;
              return (
                <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                      : "bg-white text-gray-400 border-gray-200"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="text-left md:text-center">
                    <p className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold bg-orange-50 text-orange-600 rounded border border-orange-100">
                        Current State
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Address and Ordered items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FiTruck className="text-gray-400" /> Shipping Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 font-medium">Receiver Name</p>
                <p className="font-bold text-gray-800 mt-0.5">{order.shipping_address?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Phone Number</p>
                <p className="font-bold text-gray-800 mt-0.5">{order.shipping_address?.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-400 font-medium">Address</p>
                <p className="font-bold text-gray-800 mt-0.5">
                  {order.shipping_address?.address}, {order.shipping_address?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Ordered items */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FiPackage className="text-gray-400" /> Items Ordered
            </h2>
            <div className="divide-y divide-gray-100">
              {items.map((item: OrderItem) => (
                <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-50 flex-shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-gray-950 line-clamp-1">{item.productTitle}</h4>
                      <p className="text-xs text-gray-400">Brand: <span className="font-semibold text-gray-700">{item.brandName || "Unknown"}</span></p>
                      <p className="text-xs text-gray-400">Qty: <span className="font-bold text-gray-800">{item.quantity}</span></p>
                    </div>
                  </div>
                  <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                    <span className="text-sm font-bold text-orange-500">
                      ${((item.price || 0) * (1 - (item.discount || 0) / 100) * (item.quantity || 1)).toFixed(2)}
                    </span>
                    {item.discount !== undefined && item.discount > 0 && (
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-gray-400 line-through">${(item.price * item.quantity).toFixed(2)}</span>
                        <span className="bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded">
                          {item.discount}% Off
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment and Summary */}
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
              <FiCreditCard className="text-gray-400" /> Payment Details
            </h2>
            <div className="space-y-3.5 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Method</span>
                <span className="font-bold text-gray-800">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Status</span>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border uppercase tracking-wider ${
                  payment?.status === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}>
                  {payment?.status === "success" ? "Paid" : "Pending"}
                </span>
              </div>
              {payment?.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-700 max-w-[120px] truncate" title={payment.transaction_id}>
                    {payment.transaction_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing calculations summary */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-950 pb-2 border-b border-gray-50">
              Billing Summary
            </h2>
            <div className="space-y-3.5 text-sm text-gray-700">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span className="font-semibold text-red-500">-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <hr className="border-gray-50 my-1" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-950">Total Paid</span>
                <span className="text-lg font-black text-orange-500">
                  ${order.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

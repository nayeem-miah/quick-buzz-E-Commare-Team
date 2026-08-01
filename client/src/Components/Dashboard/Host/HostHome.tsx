/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, CreditCard, DollarSign, Package, ShoppingBag, TrendingUp, X } from 'lucide-react';
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import { ApprovalStatus, PaymentStatus } from "../../../constants/enums";

interface HostPayment {
  _id: string;
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
}

interface HostProduct {
  _id: string;
  adminIsApproved: string;
}

const HostHome: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const [selectedOrder, setSelectedOrder] = useState<HostPayment | null>(null);

  // Fetch payment history using email
  const { data: PaymentHistoryData = [], isLoading: isPaymentLoading, refetch: refetchPayments } = useQuery<HostPayment[]>({
    queryKey: ["PaymentHistoryData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/host-payment-history/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const handleApproveOrder = async (orderId: string, productTitle: string) => {
    try {
      const res = await axiosPublic.patch(`/products/host-manage-product/${orderId}`);
      if (res.data.data.modifiedCount > 0) {
        refetchPayments();
        setSelectedOrder(prev => prev ? { ...prev, hostIsApproved: ApprovalStatus.APPROVED } : null);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${String(productTitle).slice(0, 20)} is approved now!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Failed to approve order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve order. Please try again.",
      });
    }
  };

  // Successful payments count and amount
  const successfulPayments = PaymentHistoryData.filter(
    (item: HostPayment) => item.status === PaymentStatus.SUCCESS
  );

  const totalAmount = successfulPayments.reduce(
    (total: number, item: HostPayment) => total + item.totalPrice,
    0
  );

  // Fetch all products
  const { data: productsData = [], isLoading: isProductsLoading } = useQuery<HostProduct[]>({
    queryKey: ["allProduct", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/host-product/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const approvedProductsCount = productsData.filter(
    (item: HostProduct) => item.adminIsApproved === ApprovalStatus.APPROVED
  ).length;

  const pendingProductsCount = productsData.filter(
    (item: HostProduct) => item.adminIsApproved === ApprovalStatus.PENDING
  ).length;

  const rejectedProductsCount = productsData.filter(
    (item: HostProduct) => item.adminIsApproved === ApprovalStatus.REJECTED
  ).length;

  // Process data for the sales chart
  const getChartData = () => {
    let referenceDate = new Date();
    const succPaymentsWithDates = successfulPayments.filter((p) => p.tran_date);

    if (succPaymentsWithDates.length > 0) {
      const dates = succPaymentsWithDates.map((p) => new Date(p.tran_date!).getTime());
      referenceDate = new Date(Math.max(...dates));
    }

    const daysCount = timeRange === '7days' ? 7 : 30;
    const chartData = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(referenceDate);
      d.setDate(referenceDate.getDate() - i);

      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const targetDateStr = d.toDateString();

      const daySales = succPaymentsWithDates
        .filter((item) => new Date(item.tran_date!).toDateString() === targetDateStr)
        .reduce((sum, item) => sum + item.totalPrice, 0);

      chartData.push({
        date: dateString,
        Sales: daySales,
      });
    }

    return chartData;
  };

  const chartData = getChartData();

  // Get recent 5 orders
  const recentOrders = [...successfulPayments]
    .sort((a, b) => {
      const dateA = a.tran_date ? new Date(a.tran_date).getTime() : 0;
      const dateB = b.tran_date ? new Date(b.tran_date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  if (isPaymentLoading || isProductsLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Store summary for <span className="text-orange-500 font-semibold">{user?.displayName || "Seller"}</span>
        </p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Sales",    value: `৳${totalAmount?.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: "text-blue-500",   bg: "bg-blue-50" },
          { label: "Total Products", value: productsData?.length || 0,           icon: <Package className="w-5 h-5" />,     color: "text-violet-500",  bg: "bg-violet-50" },
          { label: "Approved",       value: approvedProductsCount,               icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pending",        value: pendingProductsCount,                icon: <Clock className="w-5 h-5" />,       color: "text-amber-500",  bg: "bg-amber-50" },
          { label: "Total Orders",   value: successfulPayments.length,           icon: <ShoppingBag className="w-5 h-5" />, color: "text-indigo-500",  bg: "bg-indigo-50", span: true },
        ].map((stat) => (
          <div key={stat.label} className={`bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 ${stat.span ? "col-span-2 lg:col-span-1" : ""}`}>
            <div className={`p-2.5 sm:p-3 ${stat.bg} ${stat.color} rounded-xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider truncate">{stat.label}</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sales Revenue</h2>
              <span className="text-[10px] text-gray-400">Daily earnings tracking</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setTimeRange('7days')}
                className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  timeRange === '7days'
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                7d
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30days')}
                className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  timeRange === '30days'
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                30d
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {successfulPayments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <span className="p-2.5 bg-orange-50 rounded-full text-orange-500 mb-2">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="text-xs font-semibold text-slate-800">No Sales Data</h3>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">
                  Once you receive successful orders, your sales chart will appear here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '10px',
                      boxShadow: 'none'
                    }}
                    formatter={(value: any) => [`৳${value}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="Sales" stroke="#f97316" strokeWidth={1.5} fill="#ffedd5" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Minimal Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Status</h2>
            <span className="text-[10px] text-gray-400">Ratio of current listings</span>
          </div>

          <div className="space-y-4 my-6">
            {[
              { label: "Approved", count: approvedProductsCount, color: "text-emerald-600" },
              { label: "Pending",  count: pendingProductsCount,  color: "text-amber-500" },
              { label: "Rejected", count: rejectedProductsCount, color: "text-red-500" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${row.color}`}>{row.label}</span>
                <span className="text-xs font-bold text-gray-900">
                  {row.count} ({productsData.length ? Math.round((row.count / productsData.length) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-4 flex justify-between">
            <span className="uppercase tracking-wider font-bold">Total Listings</span>
            <span className="font-bold text-gray-700">{productsData.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Orders</h2>
            <span className="text-[10px] text-gray-400">Latest successful transactions</span>
          </div>
        </div>

        {recentOrders.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {recentOrders.map((order: HostPayment, idx: number) => (
              <div
                key={order._id || idx}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Customer Info and Status */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-900 truncate">
                        {order.cus_name || "Guest Customer"}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{order.cus_email}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider flex-shrink-0 ${
                      order.hostIsApproved === ApprovalStatus.APPROVED
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {order.hostIsApproved === ApprovalStatus.APPROVED ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  {/* Card Body: Date and Amount */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50 text-xs mb-4">
                    <div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Date</p>
                      <p className="font-semibold text-gray-700 mt-1">
                        {order.tran_date ? new Date(order.tran_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
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

                {/* Card Footer: Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl text-xs font-semibold transition"
                  >
                    View
                  </button>
                  {order.hostIsApproved !== ApprovalStatus.APPROVED && (
                    <button
                      type="button"
                      onClick={() => handleApproveOrder(order._id, Array.isArray(order.productTitle) ? order.productTitle[0] : (order.productTitle || ""))}
                      className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-orange-500/20"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Order Details</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Transaction summary</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {/* Amount Hero */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">৳{selectedOrder.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-green-50 text-green-700 border-green-200">
                    Payment: Success
                  </span>
                  <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                    selectedOrder.hostIsApproved === ApprovalStatus.APPROVED
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {selectedOrder.hostIsApproved === ApprovalStatus.APPROVED ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Info</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.cus_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-gray-700 break-all">{selectedOrder.cus_email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Info</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedOrder.tran_date ? new Date(selectedOrder.tran_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedOrder.card_type || "N/A"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Transaction ID</p>
                    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                      <p className="font-mono text-xs font-bold text-orange-500 truncate">{selectedOrder.transactionId || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              {selectedOrder.productTitle && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Products ({Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle.length : 1})
                  </p>
                  <div className="space-y-2">
                    {(Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle : [selectedOrder.productTitle]).map(
                      (title: string | undefined, index: number) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 p-3 rounded-xl transition-colors duration-150">
                          <img
                            src={selectedOrder.productImage?.[index] || ""}
                            alt={title || "Product"}
                            className="w-11 h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-900 truncate">{title || "Unnamed Product"}</p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                              Brand: {selectedOrder.brandName?.[index] || "No Brand"}
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
            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
              {selectedOrder.hostIsApproved !== ApprovalStatus.APPROVED && (
                <button
                  type="button"
                  onClick={() => handleApproveOrder(selectedOrder._id, Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle[0] : (selectedOrder.productTitle || ""))}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30"
                >
                  Approve Order
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HostHome;

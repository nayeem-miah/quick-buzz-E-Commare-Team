/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, CreditCard, DollarSign, Package, ShoppingBag, TrendingUp, X } from 'lucide-react';
import React, { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
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
import { ApprovalStatus, PaymentMethod, PaymentStatus } from "../../../constants/enums";

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
  payment_method?: string;
  orderStatus?: string;
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
        toast.success(`"${String(productTitle).slice(0, 25)}" approved!`, {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error("Failed to approve order:", error);
      toast.error("Failed to approve order. Please try again.", {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  // Include online payments (status === success) AND COD orders that are at least approved/processing
  const successfulPayments = PaymentHistoryData.filter((item: HostPayment) => {
    if (item.status === PaymentStatus.SUCCESS) return true;
    // COD orders: show them once host has approved (processing/shipped/delivered)
    if (item.payment_method === PaymentMethod.COD) {
      const activeStatuses = ['processing', 'shipped', 'delivered'];
      return activeStatuses.includes(item.orderStatus || '');
    }
    return false;
  });

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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 flex-shrink-0">
            <span className="text-xl font-black text-white">
              {(user?.displayName || "S")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Welcome back, <span className="text-orange-500">{user?.displayName || "Seller"}</span> 👋</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Revenue",   value: `৳${totalAmount?.toLocaleString()}`,  icon: <DollarSign className="w-4 h-4" />,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100" },
          { label: "Total Products",  value: productsData?.length || 0,            icon: <Package className="w-4 h-4" />,      color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
          { label: "Approved",        value: approvedProductsCount,                icon: <CheckCircle className="w-4 h-4" />,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Pending",         value: pendingProductsCount,                 icon: <Clock className="w-4 h-4" />,        color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100" },
          { label: "Total Orders",    value: successfulPayments.length,            icon: <ShoppingBag className="w-4 h-4" />,  color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-100", span: true },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3 hover:shadow-md transition-shadow duration-200 ${stat.span ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5 leading-none">{stat.value}</p>
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

        {/* Product Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Status</h2>
            <span className="text-[10px] text-gray-400">Distribution of your listings</span>
          </div>

          <div className="space-y-4 flex-1">
            {[
              { label: "Approved", count: approvedProductsCount, bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Pending",  count: pendingProductsCount,  bar: "bg-amber-400",   text: "text-amber-600",  bg: "bg-amber-50" },
              { label: "Rejected", count: rejectedProductsCount, bar: "bg-red-400",     text: "text-red-600",   bg: "bg-red-50" },
            ].map((row) => {
              const pct = productsData.length ? Math.round((row.count / productsData.length) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${row.text}`}>{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{row.count}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${row.bg} ${row.text}`}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Listings</span>
            <span className="text-sm font-black text-gray-800">{productsData.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Orders</h2>
            <span className="text-[10px] text-gray-400">Latest active orders (online & COD)</span>
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
          <>
            {/* ── SM / MD: Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
              {recentOrders.map((order: HostPayment, idx: number) => (
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
                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                          order.payment_method === PaymentMethod.COD
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-purple-50 text-purple-600 border-purple-200'
                        }`}>
                          {order.payment_method === PaymentMethod.COD ? '💵 COD' : '💳 Online'}
                        </span>
                      </div>
                      <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider flex-shrink-0 ${
                        order.hostIsApproved === ApprovalStatus.APPROVED
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {order.hostIsApproved === ApprovalStatus.APPROVED ? 'Approved' : 'Pending'}
                      </span>
                    </div>

                    {/* Card Body: Date & Amount */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-50 text-xs mb-3">
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Date</p>
                        <p className="font-semibold text-gray-700 mt-1">
                          {order.tran_date
                            ? new Date(order.tran_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

            {/* ── LG: Data Table ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-right px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-center px-4 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order: HostPayment, idx: number) => (
                    <tr
                      key={order._id || idx}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
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
                        <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                          order.payment_method === PaymentMethod.COD
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-purple-50 text-purple-600 border-purple-200'
                        }`}>
                          {order.payment_method === PaymentMethod.COD ? '💵 COD' : '💳 Online'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {order.tran_date
                            ? new Date(order.tran_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'N/A'}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-black text-orange-500">৳{order.totalPrice?.toLocaleString()}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                          order.hostIsApproved === ApprovalStatus.APPROVED
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {order.hostIsApproved === ApprovalStatus.APPROVED ? 'Approved' : 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg text-xs font-semibold transition"
                          >
                            View
                          </button>
                          {order.hostIsApproved !== ApprovalStatus.APPROVED && (
                            <button
                              type="button"
                              onClick={() => handleApproveOrder(order._id, Array.isArray(order.productTitle) ? order.productTitle[0] : (order.productTitle || ""))}
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

      {/* Order Details Modal */}
      {selectedOrder && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setSelectedOrder(null)}
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
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

              {/* Amount Hero */}
              <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
                <div className="relative z-10">
                  <p className="text-xs text-orange-100 font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-3xl font-black text-white mt-1">৳{selectedOrder.totalPrice?.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                      {selectedOrder.payment_method === PaymentMethod.COD ? '💵 Cash on Delivery' : '💳 Online Payment'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                      selectedOrder.hostIsApproved === ApprovalStatus.APPROVED
                        ? 'bg-green-500/20 text-white border-green-300/40'
                        : 'bg-yellow-500/20 text-white border-yellow-300/40'
                    }`}>
                      {selectedOrder.hostIsApproved === ApprovalStatus.APPROVED ? '✓ Approved' : '⏳ Pending'}
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
                      {(selectedOrder.cus_name || "G")[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{selectedOrder.cus_name || "N/A"}</p>
                    <p className="text-xs text-gray-400 truncate">{selectedOrder.cus_email || "N/A"}</p>
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
                      {selectedOrder.tran_date
                        ? new Date(selectedOrder.tran_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-semibold">Payment Method</span>
                    <span className="text-xs font-bold text-gray-800">
                      {selectedOrder.payment_method === PaymentMethod.COD ? 'Cash on Delivery' : (selectedOrder.card_type || 'Online')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block mb-1.5">Transaction ID</span>
                    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <p className="font-mono text-xs font-bold text-orange-500 truncate">{selectedOrder.transactionId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              {selectedOrder.productTitle && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    📦 Products ({Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle.length : 1})
                  </p>
                  <div className="space-y-2">
                    {(Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle : [selectedOrder.productTitle]).map(
                      (title: string | undefined, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 p-3 rounded-2xl transition-all duration-200 shadow-sm"
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={selectedOrder.productImage?.[index] || ""}
                              alt={title || "Product"}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate">{title || "Unnamed Product"}</p>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                              {selectedOrder.brandName?.[index] || "No Brand"}
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
              {selectedOrder.hostIsApproved !== ApprovalStatus.APPROVED && (
                <button
                  type="button"
                  onClick={() => handleApproveOrder(selectedOrder._id, Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle[0] : (selectedOrder.productTitle || ""))}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30"
                >
                  ✓ Approve Order
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-xl transition-all duration-200"
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

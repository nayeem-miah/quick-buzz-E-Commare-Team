/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, CreditCard, DollarSign, Package, ShoppingBag, TrendingUp, X } from 'lucide-react';
import React, { useState } from "react";
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
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-white/50 min-h-screen">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Store summary for <span className="text-orange-500 font-medium">{user?.displayName || "Seller"}</span>
        </p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Sales</span>
            <span className="text-lg font-bold text-slate-900 mt-1">
              ৳{totalAmount?.toLocaleString()}
            </span>
          </div>
          <div className="bg-orange-50 text-orange-500 p-2 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Products</span>
            <span className="text-lg font-bold text-slate-900 mt-1">
              {productsData?.length || 0}
            </span>
          </div>
          <div className="bg-orange-50 text-orange-500 p-2 rounded-lg">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Approved Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Approved</span>
            <span className="text-lg font-bold text-emerald-600 mt-1">
              {approvedProductsCount}
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        {/* Pending Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pending</span>
            <span className="text-lg font-bold text-amber-500 mt-1">
              {pendingProductsCount}
            </span>
          </div>
          <div className="bg-amber-50 text-amber-500 p-2 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm col-span-2 sm:col-span-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Orders</span>
            <span className="text-lg font-bold text-slate-900 mt-1">
              {successfulPayments.length}
            </span>
          </div>
          <div className="bg-orange-50 text-orange-500 p-2 rounded-lg">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Chart and distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Sales Revenue</h2>
              <span className="text-[10px] text-slate-400">Daily earnings tracking</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimeRange('7days')}
                className={`text-[10px] px-2.5 py-1 rounded transition-colors ${
                  timeRange === '7days'
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                7d
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30days')}
                className={`text-[10px] px-2.5 py-1 rounded transition-colors ${
                  timeRange === '30days'
                    ? 'bg-orange-500 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
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
        <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Product Status</h2>
            <span className="text-[10px] text-slate-400">Ratio of current listings</span>
          </div>

          <div className="space-y-4 my-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Approved</span>
              <span className="font-semibold text-slate-900">{approvedProductsCount} ({productsData.length ? Math.round((approvedProductsCount / productsData.length) * 100) : 0}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-slate-900">{pendingProductsCount} ({productsData.length ? Math.round((pendingProductsCount / productsData.length) * 100) : 0}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Rejected</span>
              <span className="font-semibold text-slate-900">{rejectedProductsCount} ({productsData.length ? Math.round((rejectedProductsCount / productsData.length) * 100) : 0}%)</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-4 flex justify-between">
            <span className="uppercase tracking-wider">Total Listings:</span>
            <span className="font-semibold text-slate-700">{productsData.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Recent Orders</h2>
            <span className="text-[10px] text-slate-400">Latest successful transactions</span>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-100 rounded-xl bg-slate-50/20">
            <span className="p-2.5 bg-orange-50 rounded-full text-orange-500 mb-2">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-semibold text-slate-800">No Orders Found</h3>
            <p className="text-[10px] text-slate-400 max-w-[240px] text-center mt-1">
              You haven't received any orders yet. When customers buy your products, they will show up here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead>
                <tr className="text-left font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 text-left">Customer</th>
                  <th className="pb-3 text-left">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order: HostPayment, idx: number) => (
                  <tr key={order._id || idx} className="text-slate-600 hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-3 text-left">
                      <div className="font-semibold text-slate-900">{order.cus_name || "Guest Customer"}</div>
                      <div className="text-slate-400 text-[10px]">{order.cus_email}</div>
                    </td>
                    <td className="py-3 text-left text-slate-400">
                      {order.tran_date ? new Date(order.tran_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      ৳{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        order.hostIsApproved === ApprovalStatus.APPROVED
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {order.hostIsApproved === ApprovalStatus.APPROVED ? 'Seller: Approved' : 'Seller: Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="text-slate-500 hover:text-slate-900 font-semibold"
                        >
                          View
                        </button>
                        {order.hostIsApproved !== ApprovalStatus.APPROVED && (
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(order._id, Array.isArray(order.productTitle) ? order.productTitle[0] : (order.productTitle || ""))}
                            className="text-orange-500 hover:text-orange-600 font-semibold"
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
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative bg-white rounded-xl p-6 w-full max-w-xl mx-4 overflow-hidden border border-slate-100 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Order Details
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Transaction ID: <span className="font-mono text-slate-600">{selectedOrder.transactionId || "N/A"}</span></p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                onClick={() => setSelectedOrder(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Customer Name</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedOrder.cus_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Customer Email</p>
                  <p className="font-medium text-slate-700 mt-0.5">{selectedOrder.cus_email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Payment Date</p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {selectedOrder.tran_date ? new Date(selectedOrder.tran_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Payment Method</p>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                    <span>{selectedOrder.card_type || "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Status and Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-orange-50/50 rounded-lg border border-orange-100/30 gap-4">
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Approval & Payment Status</p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Payment: Success
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-semibold ${
                      selectedOrder.hostIsApproved === ApprovalStatus.APPROVED
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {selectedOrder.hostIsApproved === ApprovalStatus.APPROVED ? 'Seller: Approved' : 'Seller: Pending Approval'}
                    </span>
                  </div>
                </div>

                {selectedOrder.hostIsApproved !== ApprovalStatus.APPROVED && (
                  <button
                    type="button"
                    onClick={() => handleApproveOrder(selectedOrder._id, Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle[0] : (selectedOrder.productTitle || ""))}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                  >
                    Approve Order
                  </button>
                )}

                <div className="text-left sm:text-right">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">৳{selectedOrder.totalPrice?.toLocaleString()}</p>
                </div>
              </div>

              {/* Products List */}
              <div>
                <h4 className="text-[10px] font-semibold text-slate-900 mb-2 uppercase tracking-wider">Products in Order</h4>
                <ul className="divide-y divide-slate-100">
                  {(Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle : [selectedOrder.productTitle]).map(
                    (title: string | undefined, index: number) => (
                      <li key={index} className="flex items-center gap-3 py-2">
                        <img
                          src={selectedOrder.productImage?.[index] || ""}
                          alt={title || "Product"}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-50"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-xs leading-snug">
                            {title || "Unnamed Product"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Brand: <span className="font-medium text-slate-600">{selectedOrder.brandName?.[index] || "No Brand"}</span>
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostHome;

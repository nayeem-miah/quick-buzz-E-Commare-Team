/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BsFillCartPlusFill } from "react-icons/bs";
import { FaDollarSign, FaStore, FaUserAlt } from "react-icons/fa";
import { FiClock, FiShoppingCart } from "react-icons/fi";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";
import ApexChart from "./Chart/ApexChart";
import { PaymentStatus } from "../../../constants/enums";
import { PaymentHistory } from "../../../types/payment";

const AdminStatistics: React.FC = () => {
  const axiosSecure = UseAxiosSecure();

  // Total users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data;
    },
  });

  // Total products
  const { data: products = [] } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data.data;
    },
  });

  // Payments / Orders
  const { data: PaymentHistoryData = [], isLoading } = useQuery<PaymentHistory[]>({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.data;
    },
  });

  // Total Sellers
  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/seller");
      return res.data?.data || [];
    },
  });

  // Calculations
  const totalAmount = PaymentHistoryData.filter(
    (item: PaymentHistory) => item.status === PaymentStatus.SUCCESS
  ).reduce((total: number, item: PaymentHistory) => total + (item.totalPrice || 0), 0);

  const totalOrders = PaymentHistoryData.length;
  const pendingOrders = PaymentHistoryData.filter(
    (item: PaymentHistory) => item.status === PaymentStatus.PENDING
  ).length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end pb-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-gray-500 mt-1 text-sm">Here's what's happening with your store today.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Total Sales */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <FaDollarSign size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sales</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">৳{totalAmount.toLocaleString()}</h4>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <FiShoppingCart size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Orders</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">{totalOrders}</h4>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <FiClock size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">{pendingOrders}</h4>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <BsFillCartPlusFill size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Products</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">{products.length}</h4>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <FaUserAlt size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Users</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">{users.length}</h4>
            </div>
          </div>

          {/* Total Sellers */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center gap-3 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <FaStore size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sellers</p>
              <h4 className="text-xl font-bold text-gray-900 mt-0.5">{sellers.length}</h4>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 overflow-hidden">
          <ApexChart />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6 font-semibold">Order ID</th>
                  <th className="py-3 px-6 font-semibold">Customer</th>
                  <th className="py-3 px-6 font-semibold">Amount</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {PaymentHistoryData.slice(0, 5).map((order: PaymentHistory, idx: number) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">#{order._id?.slice(-6) || "N/A"}</td>
                    <td className="py-4 px-6">{order.cus_name || order.cus_email || "Guest"}</td>
                    <td className="py-4 px-6 font-semibold text-gray-900">৳{order.totalPrice?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date((order.tran_date || order.date) as string | number | Date).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide
                        ${order.status === PaymentStatus.SUCCESS ? 'bg-green-50 text-green-600 border border-green-100' :
                          order.status === PaymentStatus.PENDING ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          'bg-red-50 text-red-600 border border-red-100'}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
                {PaymentHistoryData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatistics;

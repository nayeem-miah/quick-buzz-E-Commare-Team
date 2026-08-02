/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiCheck, FiCopy, FiEye, FiPackage, FiClock, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import { Order } from "../../../types/order";
import { OrderStatus } from "../../../constants/enums";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import CustomDatePicker from "../../../Shared/DatePicker/CustomDatePicker";

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["userOrders", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/user/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date.startsWith(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Summary stats
  const totalOrders = orders.length;
  const processingCount = orders.filter((o) => o.status === OrderStatus.PROCESSING).length;
  const pendingCount = orders.filter((o) => o.status === OrderStatus.PENDING).length;
  const cancelledCount = orders.filter((o) => o.status === OrderStatus.CANCELLED).length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 animate-fadeIn">
      <Helmet>
        <title>My Orders | QuickBuzz</title>
      </Helmet>

      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your order history</p>
        </div>
        <Link to="/product" className="self-start sm:self-auto">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-px flex-shrink-0">
            <FiPackage size={15} />
            Shop More
          </button>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: totalOrders, icon: <FiPackage size={20} />, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Processing", value: processingCount, icon: <FiRefreshCw size={20} />, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Pending", value: pendingCount, icon: <FiClock size={20} />, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Cancelled", value: cancelledCount, icon: <FiXCircle size={20} />, color: "text-red-500", bg: "bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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

      {orders.length === 0 ? (
        <NoData />
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search Order</label>
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Status</label>
              <CustomDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: OrderStatus.PENDING, label: "Pending" },
                  { value: OrderStatus.PROCESSING, label: "Processing" },
                  { value: OrderStatus.SHIPPED, label: "Shipped" },
                  { value: OrderStatus.DELIVERED, label: "Delivered" },
                  { value: OrderStatus.CANCELLED, label: "Cancelled" },
                ]}
                className="w-full"
                buttonClassName="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-700 bg-white flex justify-between items-center cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Date</label>
              <CustomDatePicker value={dateFilter} onChange={setDateFilter} placeholder="Pick a date..." />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-sm text-gray-400 font-semibold">No matching orders found.</p>
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDateFilter(""); }}
                className="mt-4 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition border border-orange-100"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
                      <th className="py-4 px-6 text-left">Order ID / Date</th>
                      <th className="py-4 px-6 text-left">Ship To</th>
                      <th className="py-4 px-6 text-left">Payment</th>
                      <th className="py-4 px-6 text-left">Total</th>
                      <th className="py-4 px-6 text-left">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order: Order, index: number) => (
                      <tr
                        key={order._id}
                        className={`border-b border-gray-50 hover:bg-orange-50/20 transition duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        <td className="py-5 px-6 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">
                              #{order._id.substring(order._id.length - 8)}
                            </span>
                            <button
                              onClick={() => handleCopyId(order._id)}
                              className="text-gray-300 hover:text-orange-500 transition"
                              title="Copy Full ID"
                            >
                              {copiedId === order._id ? (
                                <FiCheck className="text-green-500" size={13} />
                              ) : (
                                <FiCopy size={13} />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                        </td>
                        <td className="py-5 px-6 text-sm">
                          <p className="font-semibold text-gray-800">{order.shipping_address?.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.shipping_address?.city}</p>
                        </td>
                        <td className="py-5 px-6 text-sm text-gray-600 font-medium">
                          {order.payment_method}
                        </td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-900">
                          ৳{order.total_amount?.toLocaleString()}
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Link to={`/dashboard/order/${order._id}`}>
                            <button className="px-3.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 ml-auto transition border border-orange-100">
                              <FiEye size={13} /> Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Card View ── */}
              <div className="flex flex-col gap-4 md:hidden">
                {filteredOrders.map((order: Order) => (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          #{order._id.substring(order._id.length - 8)}
                        </span>
                        <button
                          onClick={() => handleCopyId(order._id)}
                          className="text-gray-300 hover:text-orange-500 transition"
                        >
                          {copiedId === order._id ? (
                            <FiCheck className="text-green-500" size={12} />
                          ) : (
                            <FiCopy size={12} />
                          )}
                        </button>
                      </div>
                      <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                      <div>
                        <p className="text-gray-400 mb-0.5">Date</p>
                        <p className="font-semibold text-gray-700">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-0.5">Method</p>
                        <p className="font-semibold text-gray-700">{order.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-0.5">Ship To</p>
                        <p className="font-semibold text-gray-700">{order.shipping_address?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-0.5">Total</p>
                        <p className="text-sm font-black text-orange-500">৳{order.total_amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5">
                      <Link to={`/dashboard/order/${order._id}`} className="block w-full">
                        <button className="w-full py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-orange-100">
                          <FiEye size={13} /> View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result count */}
              <p className="text-xs text-gray-400 text-right">
                Showing <span className="font-bold text-gray-600">{filteredOrders.length}</span> of{" "}
                <span className="font-bold text-gray-600">{orders.length}</span> orders
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
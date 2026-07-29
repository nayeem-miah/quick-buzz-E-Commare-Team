import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { Order } from "../../../types/order";
import { OrderStatus } from "../../../constants/enums";

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch user orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["userOrders", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/user/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <Helmet>
        <title>My Orders | QuickBuzz</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <NoData />
      ) : (
        <div className="space-y-6">
          {/* Search & Filters Section */}
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-600 bg-white"
              />
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
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/75">
                    <tr className="uppercase tracking-wider text-xs font-bold text-gray-500">
                      <th className="py-4 px-6 text-left">Order ID / Date</th>
                      <th className="py-4 px-6 text-left">Address / Shipping</th>
                      <th className="py-4 px-6 text-left">Payment Method</th>
                      <th className="py-4 px-6 text-left">Total Amount</th>
                      <th className="py-4 px-6 text-left">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order: Order) => (
                      <tr key={order._id} className="hover:bg-gray-50/30 transition duration-200">
                        <td className="py-4 px-6 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-950">
                              #{order._id.substring(order._id.length - 8)}
                            </span>
                            <button
                              onClick={() => handleCopyId(order._id)}
                              className="text-gray-400 hover:text-orange-500 transition"
                              title="Copy Full ID"
                            >
                              {copiedId === order._id ? (
                                <FiCheck className="text-green-600" size={14} />
                              ) : (
                                <FiCopy size={14} />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(order.date)}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          <p className="font-semibold text-gray-800">{order.shipping_address?.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {order.shipping_address?.city}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {order.payment_method}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-950">
                          ৳{order.total_amount?.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-right">
                          <Link to={`/dashboard/order/${order._id}`}>
                            <button className="px-3.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 ml-auto transition border border-orange-100 shadow-sm shadow-orange-500/5">
                              <FiEye size={14} /> Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile responsive view */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredOrders.map((order: Order) => (
                  <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            Order #{order._id.substring(order._id.length - 8)}
                          </span>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            className="text-gray-400 hover:text-orange-500 transition"
                          >
                            {copiedId === order._id ? (
                              <FiCheck className="text-green-600" size={12} />
                            ) : (
                              <FiCopy size={12} />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.date)}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400">Ship To:</p>
                        <p className="font-semibold text-gray-800">{order.shipping_address?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Method:</p>
                        <p className="font-semibold text-gray-800">{order.payment_method}</p>
                      </div>
                      <div className="col-span-2 pt-1">
                        <p className="text-gray-400">Total Price:</p>
                        <p className="text-sm font-black text-orange-500">৳{order.total_amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-50">
                      <Link to={`/dashboard/order/${order._id}`} className="block w-full">
                        <button className="w-full py-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-orange-100">
                          <FiEye size={14} /> View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
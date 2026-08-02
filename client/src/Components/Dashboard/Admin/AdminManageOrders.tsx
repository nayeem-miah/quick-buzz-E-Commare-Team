import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiCopy, FiEye, FiInbox, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import LoadingSpinner from "../../../Shared/Loading";
import Pagination from "../../../Shared/Pagination/Pagination";
import { OrderStatus } from "../../../constants/enums";
import { Order } from "../../../types/order";
import { ManageOrdersStats } from "./components/ManageOrdersStats";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" }
];

const AdminManageOrders: React.FC = () => {
  const axiosSecure = UseAxiosSecure();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const size = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Order ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
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

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["adminAllOrders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data.data;
    },
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order._id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        order.shipping_address?.name?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / size) || 1;
  const paginatedOrders = filteredOrders.slice((page - 1) * size, page * size);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View status, filter and process all product orders.</p>
        </div>
      </div>

      {/* Orders Stats */}
      <ManageOrdersStats orders={orders} />

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex w-full xl:w-80 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-base" />
              </div>
              <input
                type="text"
                placeholder="Search by Order ID, name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto z-20">
            <CustomDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={STATUS_OPTIONS}
              className="w-full sm:w-44"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <FiInbox className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              We couldn't find any orders matching your parameters.
            </p>
            {(searchQuery || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-5 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-visible w-full min-h-[400px]">
              <table className="w-full min-w-full text-left border-collapse whitespace-nowrap table-fixed">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[25%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[13%]" />
                  <col className="w-[12%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50/40 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-semibold">Order ID</th>
                    <th className="py-3.5 px-6 font-semibold">Customer</th>
                    <th className="py-3.5 px-6 font-semibold">Date</th>
                    <th className="py-3.5 px-6 font-semibold">Total Amount</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/60 text-slate-800">
                  {paginatedOrders.map((order: Order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/70 transition-colors duration-150 group"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-gray-700 truncate max-w-[120px]">
                            {order._id}
                          </span>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                            title="Copy Order ID"
                          >
                            {copiedId === order._id ? (
                              <FiCheck className="text-emerald-600" size={13} />
                            ) : (
                              <FiCopy size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="truncate">
                          <p className="text-sm font-bold text-gray-900 truncate" title={order.shipping_address?.name || "N/A"}>
                            {order.shipping_address?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={order.email}>
                            {order.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-xs text-gray-600">
                        {formatDate(order.date)}
                      </td>
                      <td className="py-3 px-6 text-sm font-extrabold text-gray-900">
                        ৳{order.total_amount?.toLocaleString()} BDT
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/dashboard/admin-order/${order._id}`}
                            className="px-2.5 py-1 text-xs text-orange-600 bg-orange-50/60 hover:bg-orange-100/80 rounded-lg font-semibold border border-orange-100 transition-colors flex items-center gap-1"
                          >
                            <FiEye size={12} /> Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 p-5 md:hidden text-slate-800">
              {paginatedOrders.map((order: Order) => (
                <div key={order._id} className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-700 truncate max-w-[100px]">
                        #{order._id}
                      </span>
                      <button onClick={() => handleCopyId(order._id)} className="text-slate-400 hover:text-orange-500">
                        {copiedId === order._id ? <FiCheck className="text-emerald-600" size={12} /> : <FiCopy size={12} />}
                      </button>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-slate-500">
                      Customer: <span className="font-semibold text-slate-800">{order.shipping_address?.name || "N/A"}</span>
                    </p>
                    <p className="text-slate-500">
                      Email: <span className="font-semibold text-slate-800">{order.email}</span>
                    </p>
                    <p className="text-slate-500">
                      Date: <span className="font-semibold text-slate-800">{formatDate(order.date)}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <p className="text-xs font-black text-slate-900">
                      ৳{order.total_amount?.toLocaleString()} BDT
                    </p>
                    <Link
                      to={`/dashboard/admin-order/${order._id}`}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <FiEye size={12} /> Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              size={size}
              totalItems={filteredOrders.length}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminManageOrders;

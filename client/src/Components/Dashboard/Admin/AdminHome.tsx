import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BsFillCartPlusFill } from "react-icons/bs";
import { FaDollarSign, FaStore, FaUserAlt } from "react-icons/fa";
import { FiClock, FiShoppingCart } from "react-icons/fi";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";
import { PaymentStatus } from "../../../constants/enums";
import { PaymentHistory } from "../../../types/payment";
import ApexChart from "./Chart/ApexChart";

const AdminStatistics: React.FC = () => {
  const axiosSecure = UseAxiosSecure();


  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data;
    },
  });


  const { data: products = [] } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data.data;
    },
  });

  const { data: PaymentHistoryData = [], isLoading } = useQuery<PaymentHistory[]>({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.data;
    },
  });


  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/seller");
      return res.data?.data || [];
    },
  });


  const totalAmount = PaymentHistoryData.filter(
    (item: PaymentHistory) => item.status === PaymentStatus.SUCCESS
  ).reduce((total: number, item: PaymentHistory) => total + (item.totalPrice || 0), 0);

  const totalOrders = PaymentHistoryData.length;
  const pendingOrders = PaymentHistoryData.filter(
    (item: PaymentHistory) => item.status === PaymentStatus.PENDING
  ).length;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <FaDollarSign size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Total Sales</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">৳{totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <FiShoppingCart size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Orders</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">{totalOrders}</p>
            </div>
          </div>


          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <FiClock size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Pending</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">{pendingOrders}</p>
            </div>
          </div>


          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <BsFillCartPlusFill size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Products</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">{products.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <FaUserAlt size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Users</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">{users.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
              <FaStore size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide truncate">Sellers</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5 truncate">{sellers.length}</p>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 overflow-hidden">
          <ApexChart />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      ৳{order.totalPrice?.toLocaleString()}
                    </td>
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

          {/* Mobile Card View */}
          <div className="flex flex-col gap-4 p-4 md:hidden">
            {PaymentHistoryData.slice(0, 5).map((order: PaymentHistory, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">#{order._id?.slice(-6) || "N/A"}</p>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border
                    ${order.status === PaymentStatus.SUCCESS ? 'bg-green-50 text-green-600 border-green-100' :
                      order.status === PaymentStatus.PENDING ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-red-50 text-red-600 border-red-100'}`}
                  >
                    {order.status || "Unknown"}
                  </span>
                </div>
                <div className="px-4 py-3.5 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Customer</p>
                    <p className="font-semibold text-gray-800 truncate">{order.cus_name || order.cus_email || "Guest"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Amount</p>
                    <p className="text-sm font-black text-orange-500">
                      ৳{order.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date</p>
                    <p className="font-semibold text-gray-700">
                      {new Date((order.tran_date || order.date) as string | number | Date).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {PaymentHistoryData.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No recent orders found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatistics;

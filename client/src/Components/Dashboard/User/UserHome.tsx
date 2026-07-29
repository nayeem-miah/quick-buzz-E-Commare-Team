/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FiEdit2, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import Card from "../../../Pages/Product/Card";
import { ProductItem } from "../../../Pages/Product/types";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import { OrderStatus, ApprovalStatus } from "../../../constants/enums";

interface UserHomeOrder {
  _id: string;
  status: string;
  total_amount: number;
  date: string;
}

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // recommended-for-you-product
  const { data: recommended = [], isLoading: recommendedLoading } = useQuery<ProductItem[]>({
    queryKey: ["recommended"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products/recommended-for-you-product");
      return res.data.data;
    },
  });

  // Fetch user orders for metrics
  const { data: orders = [], isLoading } = useQuery<UserHomeOrder[]>({
    queryKey: ["userOrders", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/user/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email
  });

  if (isLoading || recommendedLoading) return <LoadingSpinner />;

  const totalOrders = orders.length;
  const totalSpent = orders
    .filter((order: UserHomeOrder) => order.status !== OrderStatus.CANCELLED)
    .reduce((sum: number, order: UserHomeOrder) => sum + (order.total_amount || 0), 0);
  const pendingOrders = orders.filter(
    (order: UserHomeOrder) => order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING
  ).length;
  const completedOrders = orders.filter((order: UserHomeOrder) => order.status === OrderStatus.DELIVERED).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center md:text-left animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, <span className="text-orange-500">{user?.displayName}</span>
        </h1>
        <p className="mt-2 text-gray-500 text-sm md:text-base max-w-2xl">
          We’re excited to see you again. Explore your personalized recommendations and manage your account details below.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <FiShoppingBag size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <FiDollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Spent</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">৳{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <FiClock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <FiCheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed</p>
            <p className="text-lg font-black text-gray-950 mt-0.5">{completedOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-950">Your Profile</h2>
              <Link
                to="/edit-profile"
                className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
              >
                <FiEdit2 size={14} /> Edit Profile
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <img
                src={user?.photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-gray-200 object-cover shadow-sm"
              />
              <div className="space-y-1 text-center sm:text-left mt-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Name</p>
                <p className="text-base font-bold text-gray-950">{user?.displayName}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider pt-2">Email Address</p>
                <p className="text-sm font-semibold text-gray-700">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Overview Links Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950 mb-6">Account Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/dashboard/my-payment-history"
                className="flex flex-col justify-center items-center p-5 rounded-xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-500 hover:text-white transition duration-300 text-center group"
              >
                <span className="text-sm font-bold text-orange-600 group-hover:text-white">Payment History</span>
                <span className="text-xs text-orange-500 group-hover:text-orange-100 mt-1">View transaction records</span>
              </Link>
              <Link
                to="/dashboard/my-listings"
                className="flex flex-col justify-center items-center p-5 rounded-xl bg-orange-50/50 border border-orange-100/50 hover:bg-orange-500 hover:text-white transition duration-300 text-center group"
              >
                <span className="text-sm font-bold text-orange-600 group-hover:text-white">My Cart</span>
                <span className="text-xs text-orange-500 group-hover:text-orange-100 mt-1">Manage added products</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-950">Recent Orders</h2>
          <Link
            to="/dashboard/my-orders"
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            View All Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 3).map((order: UserHomeOrder) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="py-3.5 text-sm font-semibold text-gray-950">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="py-3.5 text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3.5 text-sm font-bold text-gray-950">
                      ৳{order.total_amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-xs">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        order.status === OrderStatus.DELIVERED
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === OrderStatus.CANCELLED
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link to={`/dashboard/order/${order._id}`}>
                        <button className="px-3 py-1 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white rounded-lg text-xs font-semibold transition border border-orange-100 flex items-center gap-1.5 ml-auto">
                          <FiEye size={12} /> Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Products Section */}
      <div className="border-t border-gray-100 pt-10 mb-10">
        <h2 className="text-xl font-bold text-gray-950 mb-6">
          Recommended for You
        </h2>
        {recommended.length === 0 ? (
          <NoData />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommended?.map(
              (product: ProductItem) =>
                product?.adminIsApproved === ApprovalStatus.APPROVED && (
                  <Card product={product} key={product._id} />
                )
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/product">
            <button className="px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 font-semibold rounded-xl transition duration-300 shadow-md shadow-orange-500/10">
              Show All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHome;

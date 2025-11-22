import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import Card from "../../../Pages/Product/Card";

const UserHome: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // recommended-for-you-product
  const { data: recommended = [], isLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products/recommended-for-you-product");
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8 lg:px-10 md:px-8 px-1">
      {/* Welcome, User Details, and Navigation Section */}
      <div className="bg-gradient-to-r  lg:p-10 md:p-7 p-3 rounded-lg shadow-2xl mb-12 space-y-10">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-extrabold text-center tracking-tight">
          Welcome back,
          <span className="text-green-500">{user?.displayName}</span>
        </h1>
        <p className="mt-6 text-lg text-center opacity-80">
          We’re excited to see you again. Explore your personalized
          recommendations and manage your account details below.
        </p>

        {/* User Details Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-10 border border-gray-200 transform transition-all hover:scale-105 hover:shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Your Profile
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-40 h-40 rounded-full shadow-2xl object-cover mb-6 md:mb-0"
            />
            <div className="space-y-4 text-center md:text-left">
              <p className="text-lg text-gray-700">
                <strong>Name:</strong> {user?.displayName}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-10 border border-gray-200 hover:scale-105 transform transition-all hover:shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Account Overview
          </h2>
          <div className="flex flex-col space-y-6">
            <Link
              to="/dashboard/my-payment-history"
              className="text-indigo-600 hover:text-indigo-800  duration-300 py-3 px-5 rounded-lg bg-indigo-100 hover:bg-indigo-200 shadow-md transform transition-all hover:scale-105"
            >
              View Payment History
            </Link>
            <Link
              to="/dashboard/my-listings"
              className="text-indigo-600 hover:text-indigo-800  duration-300 py-3 px-5 rounded-lg bg-indigo-100 hover:bg-indigo-200 shadow-md transform transition-all hover:scale-105"
            >
              My Added List
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mb-16">
        <h2 className="text-4xl font-semibold text-gray-800 mb-8 tracking-tight">
          Recommended for You
        </h2>
        {recommended.length === 0 ? (
          <NoData />
        ) : (
          <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-3 md:gap-8 lg:gap-10 gap-4">
            {recommended?.map(
              (product: any) =>
                product?.adminIsApproved === "approve" && (
                  <Card product={product} key={product._id} />
                )
            )}
          </div>
        )}

        <div className="mx-auto my-8 text-center">
          <Link to={"/product"}>
            <button className="px-8 py-4 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl transform transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:shadow-xl hover:scale-105">
              Show All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHome;

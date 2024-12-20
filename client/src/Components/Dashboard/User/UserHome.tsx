import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/UseAuth";

const UserHome: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="mt-12 px-6 md:px-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg mb-10">
        <h1 className="text-4xl font-semibold">
          Welcome back, {user?.displayName}
        </h1>
        <p className="mt-4 text-lg">
          We’re glad to see you again. Check out your account details and
          personalized recommendations below.
        </p>
      </div>

      {/* User Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Profile
        </h2>
        <div className="space-y-3">
          <p className="text-lg text-gray-700">
            <strong>Name:</strong> {user?.displayName}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
      </div>

      {/* Navigation Links Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Account Overview
        </h2>
        <div className="flex flex-col space-y-4">
          <Link
            to="/dashboard/my-payment-history"
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            View Payment History
          </Link>
          <Link
            to="/dashboard/my-listings"
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            My Added List
          </Link>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recommended for You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800">Smartphone</h3>
            <p className="text-sm text-gray-600 mt-2">$599.99</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Add to Cart
            </button>
          </div>
          {/* Repeat Product Cards for more items */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-medium text-gray-800">Laptop</h3>
            <p className="text-sm text-gray-600 mt-2">$899.99</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Add to Cart
            </button>
          </div>
          {/* Additional Product Cards can be added here */}
        </div>
      </div>
    </div>
  );
};

export default UserHome;

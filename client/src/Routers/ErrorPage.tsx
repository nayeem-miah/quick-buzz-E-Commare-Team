import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiShoppingBag } from "react-icons/fi";

const ErrorPage: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 z-50 overflow-y-auto">
      
      <div className="max-w-xl w-full text-center space-y-8 animate-fadeIn">
        
        {/* 404 Heading */}
        <div className="space-y-2">
          <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 drop-shadow-sm tracking-tight">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Oops! Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto">
            The page you're looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl shadow-sm shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiHome size={18} />
            Go to Homepage
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-orange-500 font-semibold rounded-xl border border-orange-200 hover:bg-orange-50 hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiShoppingBag size={18} />
            Browse Products
          </Link>
        </div>

        {/* Footer Support Info */}
        <div className="pt-10 text-sm text-gray-400">
          <p>
            Need help? Contact our{" "}
            <a href="mailto:support@quickbazz.com" className="text-orange-500 hover:underline hover:text-orange-600 font-medium transition-colors">
              support team
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ErrorPage;

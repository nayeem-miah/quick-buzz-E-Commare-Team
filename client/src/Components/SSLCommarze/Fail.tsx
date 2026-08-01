import React from "react";
import { Link } from "react-router-dom";
import { FiXCircle, FiRefreshCw } from "react-icons/fi";

const Fail: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6 animate-fadeIn">
        {/* Fail Icon */}
        <div className="flex justify-center">
          <div className="flex justify-center items-center bg-red-50 text-red-500 rounded-2xl h-16 w-16">
            <FiXCircle size={36} className="stroke-[1.5]" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Payment Failed
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            Unfortunately, your transaction could not be processed. Please check your card status, internet connection, or choose another payment method.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <Link to="/checkout" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-2.5 text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 rounded-xl transition-all duration-200 font-bold shadow-md shadow-orange-500/30 flex items-center justify-center gap-2">
              <FiRefreshCw size={16} /> Retry Payment
            </button>
          </Link>
          <Link
            to="/"
            className="text-sm font-semibold text-gray-400 hover:text-orange-500 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Fail;

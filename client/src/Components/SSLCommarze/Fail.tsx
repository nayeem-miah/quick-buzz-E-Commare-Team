import React from "react";
import { Link } from "react-router-dom";
import { FiXCircle, FiRefreshCw, FiHome } from "react-icons/fi";

const Fail: React.FC = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-red-100/50 via-white to-red-100/30 flex flex-col items-center justify-center px-4 overflow-y-auto">
      {/* Decorative blurred backgrounds */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-300 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-300 opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Container */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-red-500/5 p-8 sm:p-12 max-w-lg w-full border border-gray-100 text-center space-y-8 animate-fadeIn">
        {/* Animated Fail Icon */}
        <div className="flex justify-center">
          <div className="flex justify-center items-center bg-red-100 text-red-500 rounded-full h-20 w-20 shadow-inner animate-pulse">
            <FiXCircle size={44} className="stroke-[1.5]" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Payment Failed
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Unfortunately, your transaction could not be processed. Please check your card status, internet connection, or choose another payment method.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/checkout" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3.5 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition duration-300 font-bold shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <FiRefreshCw size={18} /> Retry Payment
            </button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition duration-300 font-bold border border-gray-200/60 flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <FiHome size={18} /> Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Fail;

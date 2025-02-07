import React from 'react';
import { Link } from 'react-router-dom';

const Success: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 ">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-11/12 md:w-full">
        {/* Animated Icon */}
        <div className="flex justify-center items-center bg-green-100 text-green-600 rounded-full h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 md:w-10 md:h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m0 6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm md:text-base">
          Thank you for your purchase. We’ve received your payment and your order is being processed. You will receive a confirmation email shortly.
        </p>

        {/* Details Button */}
        <div className="flex justify-center">
          <Link to={'/dashboard/my-payment-history'}>
            <button
              className="px-5 py-2 md:px-6 md:py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg transition-all duration-300 ease-in-out
            border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
            >
              View Payment History
            </button></Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-blue-600 hover:text-indigo-600 font-medium text-sm md:text-base transition"
          >
            Back to Homepage
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 bg-green-300 opacity-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 md:w-32 md:h-32 bg-blue-300 opacity-50 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Success;

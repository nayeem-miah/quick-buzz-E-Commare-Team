import React from "react";

const Fail: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-red-700">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-11/12 md:w-full">
        {/* Animated Icon */}
        <div className="flex justify-center items-center bg-red-100 text-red-600 rounded-full h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-pulse">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed text-sm md:text-base">
          Unfortunately, your payment could not be processed. Please check your
          payment details or try again later.
        </p>

        {/* Retry Button */}
        <div className="flex justify-center">
          <button
            className="px-5 py-2 md:px-6 md:py-3 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg transition-all duration-300 ease-in-out
            border-2 border-transparent hover:bg-orange-600 hover:border-orange-400 hover:shadow-[0_0_15px_3px_rgba(255,165,0,0.7)] hover:scale-105"
            onClick={() => (window.location.href = "/retry-payment")}
          >
            Retry Payment
          </button>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-6">
          <a
            href="/contact"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base transition"
          >
            Contact Support
          </a>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-red-600 hover:text-pink-600 font-medium text-sm md:text-base transition"
          >
            Back to Homepage
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 bg-red-300 opacity-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 md:w-32 md:h-32 bg-red-400 opacity-50 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Fail;

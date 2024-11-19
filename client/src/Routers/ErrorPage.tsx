import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 opacity-40 w-full h-full animate-gradient-flow"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 opacity-20 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-400 opacity-20 rounded-full animate-pulse blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 text-center">
        <h1 className="text-9xl font-extrabold text-red-500 drop-shadow-lg">
          404
        </h1>
        <h2 className="mt-4 text-4xl font-bold text-gray-700">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, the page you are looking for might have been moved or deleted.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
            border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Back to Home
          </a>
          <a
            href="/product"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
            border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Shop Products
          </a>
        </div>
      </div>

      {/* Contact Information */}
      <footer className="mt-12 text-center z-10">
        <p className="text-gray-500">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@quickbazz.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            support@quickbazz.com
          </a>
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          Or call us at{" "}
          <a
            href="tel:+8801849317388"
            className="text-blue-600 underline hover:text-blue-800"
          >
            +8801849317388
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ErrorPage;

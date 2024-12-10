import React from "react";

const Input: React.FC = () => {
  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-auto mx-auto p-4 bg-red-400">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div>
          

          <button className="mt-3  w-full md:w-auto px-6 flex py-4 mb-4 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
            <span className="mx-4 font-medium">Search</span>
         
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;

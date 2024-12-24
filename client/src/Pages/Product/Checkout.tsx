// import React from "react";

// const Checkout: React.FC = () => {
//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;

//     // Extracting values for all required fields
//     const brandName = (form.elements.namedItem("brandName") as HTMLInputElement).value;
//     const email = (form.elements.namedItem("email") as HTMLInputElement).value;
//     const date = (form.elements.namedItem("date") as HTMLInputElement).value;
//     const price = (form.elements.namedItem("price") as HTMLInputElement).value;
//     const location = (form.elements.namedItem("location") as HTMLInputElement).value;
//     const number = (form.elements.namedItem("number") as HTMLInputElement).value;

//     // // Logging all values to check
//     // console.log({
//     //   brandName,
//     //   email,
//     //   date,
//     //   price,
//     //   location,
//     //   number,
//     // });

//   };

//   return (
//     <div className="w-1/2 mx-auto mt-10 mb-14">
//       <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//         {/* Brand Name */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="brandName">
//             Brand Name
//           </label>
//           <input
//             id="brandName"
//             name="brandName"
//             type="text"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="email">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="text"
//             placeholder="Enter Your Email"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="date">
//             Date
//           </label>
//           <input
//             id="date"
//             name="date"
//             type="date"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="price">
//             Price ($)
//           </label>
//           <input
//             id="price"
//             name="price"
//             type="number"
//             placeholder="Enter product price"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="location">
//             Location
//           </label>
//           <input
//             id="location"
//             name="location"
//             type="text"
//             placeholder="Enter Your Location"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Number */}
//         <div>
//           <label className="block text-sm font-medium" htmlFor="number">
//             Number
//           </label>
//           <input
//             id="number"
//             name="number"
//             type="text"
//             placeholder="Enter your number"
//             className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="relative w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
//           >
//             SAVE
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Checkout;

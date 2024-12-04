import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner } from "react-icons/im";

interface SellerFormData {
  name: string;
  mobile: string;
  address: string;
  reason: string;
  other: string;
}

const BecomeSellerForm: React.FC = () => {
  const [formData, setFormData] = useState<SellerFormData>({
    name: "",
    mobile: "",
    address: "",
    reason: "",
    other: "",
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Become a Seller
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Why should you become a seller?
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Explain why you want to be a seller"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="productImage">
            Passport or nid card !!
          </label>
          <input
            id="productImage"
            name="productImage"
            type="file"
            accept="image/*"
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="other"
            className="block text-sm font-medium text-gray-700"
          >
            Other Information
          </label>
          <input
            type="text"
            id="other"
            name="other"
            value={formData.other}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Provide any additional information (optional)"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`w-full text-white   shadow-lg py-2 relative ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-indigo-600"
          } rounded-md transition-all duration-500 ease-in-out border-2 border-transparent`}
        >
          {loading ? (
            <ImSpinner size={20} className="animate-spin mx-auto "></ImSpinner>
          ) : (
            "submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default BecomeSellerForm;

import React, { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form Submitted Successfully!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Become a Seller</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="other" className="block text-sm font-medium text-gray-700">
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
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BecomeSellerForm;

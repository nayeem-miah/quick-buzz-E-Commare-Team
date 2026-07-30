/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiSave } from "react-icons/fi";
import { ShippingAddress } from "../../../../types/order";

interface ShippingAddressFormProps {
  dbShippingAddress?: ShippingAddress;
  userEmail: string;
  axiosSecure: any;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  dbShippingAddress,
  userEmail,
  axiosSecure,
}) => {
  const [shippingName, setShippingName] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    if (saved) {
      try {
        return JSON.parse(saved).name || "";
      } catch (e) {
        console.error(e);
      }
    }
    return "";
  });

  const [shippingPhone, setShippingPhone] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    if (saved) {
      try {
        return JSON.parse(saved).phone || "";
      } catch (e) {
        console.error(e);
      }
    }
    return "";
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    if (saved) {
      try {
        return JSON.parse(saved).address || "";
      } catch (e) {
        console.error(e);
      }
    }
    return "";
  });

  const [shippingCity, setShippingCity] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    if (saved) {
      try {
        return JSON.parse(saved).city || "";
      } catch (e) {
        console.error(e);
      }
    }
    return "";
  });

  // Sync shipping address from DB once loaded
  useEffect(() => {
    if (dbShippingAddress) {
      setShippingName(dbShippingAddress.name || "");
      setShippingPhone(dbShippingAddress.phone || "");
      setShippingAddress(dbShippingAddress.address || "");
      setShippingCity(dbShippingAddress.city || "");
    }
  }, [dbShippingAddress]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: shippingName,
      phone: shippingPhone,
      address: shippingAddress,
      city: shippingCity,
    };

    try {
      // Save to localStorage for checkout integration
      localStorage.setItem("quickbuzz_shipping_address", JSON.stringify(data));

      // Save to MongoDB UserCollection
      await axiosSecure.patch(`/users/profile/${userEmail}`, {
        shippingAddress: data,
      });

      toast.success("Shipping address saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save shipping address.");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50 flex items-center gap-2">
        <FiMapPin className="text-orange-500" /> Default Shipping Address
      </h2>
      <form onSubmit={handleShippingSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Receiver Name
            </label>
            <input
              type="text"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Receiver Phone
            </label>
            <input
              type="tel"
              value={shippingPhone}
              onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="e.g. +88017xxxxxxxx"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Full Address
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="House, Road, Apartment details..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="e.g. Dhaka"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-orange-500/10"
        >
          <FiSave /> Save Shipping Address
        </button>
      </form>
    </div>
  );
};

export default ShippingAddressForm;

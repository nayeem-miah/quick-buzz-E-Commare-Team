import React from "react";

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface ShippingAddressFormProps {
  shippingAddress: ShippingAddress;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingAddress,
  handleInputChange
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Receiver's Name</label>
          <input
            type="text"
            name="name"
            value={shippingAddress.name}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleInputChange}
            placeholder="e.g. +88017XXXXXXXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            required
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Address</label>
          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleInputChange}
            placeholder="e.g. Apartment, House, Road details..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            required
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            placeholder="e.g. Dhaka, Chittagong, Sylhet..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            required
          />
        </div>
      </div>
    </div>
  );
};

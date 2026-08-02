import React from "react";
import { FiTruck } from "react-icons/fi";
import { Order } from "../../../../types/order";

interface ShippingDetailsCardProps {
  shippingAddress?: Order["shipping_address"];
}

export const ShippingDetailsCard: React.FC<ShippingDetailsCardProps> = ({
  shippingAddress,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
        <FiTruck className="text-gray-400" /> Shipping Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400 font-medium">Receiver Name</p>
          <p className="font-bold text-gray-800 mt-0.5">{shippingAddress?.name}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Phone Number</p>
          <p className="font-bold text-gray-800 mt-0.5">{shippingAddress?.phone}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-gray-400 font-medium">Address</p>
          <p className="font-bold text-gray-800 mt-0.5">
            {shippingAddress?.address}, {shippingAddress?.city}
          </p>
        </div>
      </div>
    </div>
  );
};

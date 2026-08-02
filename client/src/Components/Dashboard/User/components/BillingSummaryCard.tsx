import React from "react";

interface BillingSummaryCardProps {
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
}

export const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
  subtotal,
  totalDiscount,
  totalAmount,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-950 pb-2 border-b border-gray-50">
        Billing Summary
      </h2>
      <div className="space-y-3.5 text-sm text-gray-700">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Discount</span>
          <span className="font-semibold text-red-500">-৳{totalDiscount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <hr className="border-gray-50 my-1" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-950">Total Paid</span>
          <span className="text-lg font-black text-orange-500">
            ৳{totalAmount?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

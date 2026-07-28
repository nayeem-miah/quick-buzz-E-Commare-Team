/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ImSpinner9 } from "react-icons/im";

interface OrderSummarySidebarProps {
  cartItems: any[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  cartItems,
  subtotal,
  discount,
  totalPrice,
  isSubmitting,
  handleSubmit
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:sticky lg:top-8">
      <h2 className="text-lg font-bold text-gray-950 pb-2 border-b border-gray-50">
        Order Summary
      </h2>

      {/* Items Preview */}
      <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item: any) => (
          <div key={item._id} className="flex gap-3 items-center">
            <img
              src={item.productImage}
              alt={item.productTitle}
              className="w-12 h-12 object-cover rounded-lg border border-gray-50 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-950 truncate">{item.productTitle}</p>
              <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
            </div>
            <span className="text-xs font-bold text-gray-950">
              ${(item.price * (1 - (item.discount || 0) / 100) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-gray-50" />

      {/* Calculations list */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Discount</span>
          <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <hr className="border-gray-50 my-1" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Price</span>
          <span className="text-xl font-black text-orange-500">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className={`w-full py-3.5 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition duration-300 font-semibold shadow-md shadow-orange-500/10 flex items-center justify-center ${
          isSubmitting ? "cursor-not-allowed bg-orange-400" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ImSpinner9 size={20} className="animate-spin text-white" />
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
};

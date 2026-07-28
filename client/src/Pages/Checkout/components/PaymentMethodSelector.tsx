import React from "react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50">
        Payment Method
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["Cash on Delivery", "SSLCommerz"].map((method) => (
          <label
            key={method}
            className={`flex items-center gap-4 p-4 rounded-xl border transition cursor-pointer ${
              paymentMethod === method
                ? "border-orange-500 bg-orange-50/30 text-orange-950 font-bold"
                : "border-gray-100 hover:border-gray-200 text-gray-700"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
            />
            <div className="text-sm">
              {method}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

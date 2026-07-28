/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PaymentStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface PaymentHistoryCardsProps {
  payments: PaymentHistory[];
  onDetailsClick: (payment: PaymentHistory) => void;
  formatDate: (dateStr: any) => string;
}

export const PaymentHistoryCards: React.FC<PaymentHistoryCardsProps> = ({
  payments,
  onDetailsClick,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {payments.map((payment, idx) => (
        <div
          key={payment.id || idx}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <div>
              <p className="text-xs text-gray-400 font-semibold">
                {formatDate(payment.date || payment.tran_date)}
              </p>
              <p className="text-sm font-bold text-gray-950 mt-0.5">
                {payment.cus_name}
              </p>
            </div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                payment.status === PaymentStatus.SUCCESS
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}>
              {payment.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="text-gray-400">Method:</p>
              <p className="font-semibold text-gray-800">
                {payment.payment_method || "Card"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Amount:</p>
              <p className="text-sm font-black text-gray-900">
                ${payment.totalPrice?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <button
              onClick={() => onDetailsClick(payment)}
              className="w-full py-2 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-orange-100"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

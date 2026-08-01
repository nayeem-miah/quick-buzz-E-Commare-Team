/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiEye } from "react-icons/fi";
import { PaymentStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface PaymentHistoryCardsProps {
  payments: PaymentHistory[];
  onDetailsClick: (payment: PaymentHistory) => void;
  formatDate: (dateStr?: string | number | Date) => string;
}

export const PaymentHistoryCards: React.FC<PaymentHistoryCardsProps> = ({
  payments,
  onDetailsClick,
  formatDate,
}) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {payments.map((payment, idx) => (
        <div
          key={payment.id || idx}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-900">{payment.cus_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(payment.date || payment.tran_date)}</p>
            </div>
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                payment.status === PaymentStatus.SUCCESS
                  ? "bg-green-50 text-green-700 border-green-200"
                  : payment.status === PaymentStatus.FAILED
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {payment.status === PaymentStatus.SUCCESS ? "Paid" : payment.status === PaymentStatus.FAILED ? "Failed" : "Pending"}
            </span>
          </div>

          {/* Card Body */}
          <div className="px-5 py-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <p className="text-gray-400 mb-0.5">Email</p>
              <p className="font-semibold text-gray-700 truncate">{payment.cus_email}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Method</p>
              <p className="font-semibold text-gray-700">{payment.payment_method || "Card"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 mb-0.5">Amount</p>
              <p className="text-sm font-black text-orange-500">৳{payment.totalPrice?.toLocaleString()}</p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-5 pb-5">
            <button
              onClick={() => onDetailsClick(payment)}
              className="w-full py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-orange-100"
            >
              <FiEye size={13} /> View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

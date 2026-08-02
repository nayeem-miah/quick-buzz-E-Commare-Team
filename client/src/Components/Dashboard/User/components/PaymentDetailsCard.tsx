import React from "react";
import { FiCreditCard } from "react-icons/fi";
import { Payment } from "../../../../types/order";
import { PaymentStatus } from "../../../../constants/enums";

interface PaymentDetailsCardProps {
  paymentMethod?: string;
  payment: Payment | null;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  paymentMethod,
  payment,
  formatDate,
  formatTime,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
        <FiCreditCard className="text-gray-400" /> Payment Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400 font-medium">Payment Method</p>
          <p className="font-bold text-gray-800 mt-0.5">{paymentMethod || "Card"}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Payment Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize mt-1 border ${
            payment?.status === PaymentStatus.SUCCESS
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}>
            {payment?.status || "Pending"}
          </span>
        </div>
        {payment?.tran_date && (
          <div>
            <p className="text-gray-400 font-medium">Payment Time</p>
            <p className="font-bold text-gray-800 mt-0.5">
              {formatDate(payment.tran_date)} at {formatTime(payment.tran_date)}
            </p>
          </div>
        )}
        {payment?.card_type && (
          <div>
            <p className="text-gray-400 font-medium">Card Type</p>
            <p className="font-bold text-gray-800 mt-0.5">{payment.card_type}</p>
          </div>
        )}
        {payment?.transaction_id && (
          <div className="sm:col-span-2">
            <p className="text-gray-400 font-medium">Transaction ID</p>
            <span className="inline-block font-mono bg-gray-50 text-gray-700 border border-gray-100 rounded-lg px-2.5 py-1 text-xs mt-1">
              {payment.transaction_id}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

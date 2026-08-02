/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiEye } from "react-icons/fi";
import { PaymentStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface PaymentHistoryTableProps {
  payments: PaymentHistory[];
  onDetailsClick: (payment: PaymentHistory) => void;
  formatDate: (dateStr?: string | number | Date) => string;
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  payments,
  onDetailsClick,
  formatDate,
}) => {
  return (
    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 uppercase tracking-wider text-xs font-bold text-gray-500">
            <th className="py-4 px-6 text-left">ID</th>
            <th className="py-4 px-6 text-left">Customer</th>
            <th className="py-4 px-6 text-left">Date</th>
            <th className="py-4 px-6 text-left">Amount</th>
            <th className="py-4 px-6 text-left">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, idx) => (
            <tr
              key={payment.id || idx}
              className={`border-b border-gray-50 hover:bg-orange-50/20 transition duration-150 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <td className="py-5 px-6 text-sm text-gray-500 font-semibold">
                {idx + 1}
              </td>
              <td className="py-5 px-6">
                <p className="text-sm font-bold text-gray-900">{payment?.cus_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{payment?.cus_email}</p>
              </td>
              <td className="py-5 px-6 text-sm text-gray-500 font-medium">
                {formatDate(payment?.date || payment?.tran_date)}
              </td>
              <td className="py-5 px-6 text-sm font-extrabold text-gray-900">
                ৳{payment?.totalPrice?.toLocaleString()}
              </td>
              <td className="py-5 px-6">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    payment.status === PaymentStatus.SUCCESS
                      ? "bg-green-50 text-green-700 border-green-200"
                      : payment.status === PaymentStatus.FAILED
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {payment.status === PaymentStatus.SUCCESS ? "Paid" : payment.status === PaymentStatus.FAILED ? "Failed" : "Pending"}
                </span>
              </td>
              <td className="py-5 px-6 text-right">
                <button
                  onClick={() => onDetailsClick(payment)}
                  className="px-3.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 ml-auto transition border border-orange-100"
                >
                  <FiEye size={13} /> Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

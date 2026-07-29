/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/75">
          <tr className="uppercase tracking-wider text-xs font-bold text-gray-500">
            <th className="py-4 px-6 text-left">ID</th>
            <th className="py-4 px-6 text-left">Customer</th>
            <th className="py-4 px-6 text-left">Date</th>
            <th className="py-4 px-6 text-left">Amount</th>
            <th className="py-4 px-6 text-left">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments.map((payment, idx) => (
            <tr
              key={payment.id || idx}
              className="hover:bg-gray-50/30 transition duration-200"
            >
              <td className="py-4 px-6 text-sm text-gray-500 font-semibold">
                {idx + 1}
              </td>
              <td className="py-4 px-6 text-sm text-gray-900 font-bold">
                <div>
                  <p className="text-sm font-bold text-gray-950">{payment?.cus_name}</p>
                  <p className="text-xs text-gray-400 font-normal">{payment?.cus_email}</p>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                {formatDate(payment?.date || payment?.tran_date)}
              </td>
              <td className="py-4 px-6 text-sm font-extrabold text-gray-950">
                ৳{payment?.totalPrice?.toLocaleString()}
              </td>
              <td className="py-4 px-6 text-sm">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    payment.status === PaymentStatus.SUCCESS
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {payment.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-right">
                <button
                  onClick={() => onDetailsClick(payment)}
                  className="px-4 py-1.5 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition duration-300 font-semibold text-xs shadow-md shadow-orange-500/10"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

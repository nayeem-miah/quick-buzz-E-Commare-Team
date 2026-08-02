import React from "react";
import { FiClock } from "react-icons/fi";
import { PaymentStatus } from "../../../../constants/enums";
import { PaymentHistory } from "../../../../types/payment";

interface AllPaymentHistoryTableProps {
  payments: PaymentHistory[];
  formatDate: (date?: string | number | Date) => string;
  onDetailsClick: (payment: PaymentHistory) => void;
  page: number;
  size: number;
}

export const AllPaymentHistoryTable: React.FC<AllPaymentHistoryTableProps> = ({
  payments,
  formatDate,
  onDetailsClick,
}) => {
  return (
    <div className="hidden md:block overflow-visible w-full min-h-[480px]">
      <table className="w-full min-w-full text-left border-collapse whitespace-nowrap table-fixed">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[15%]" />
          <col className="w-[13%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-gray-50/40 border-b border-gray-100 text-gray-550 text-xs font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-6 font-semibold">User</th>
            <th className="py-3.5 px-6 font-semibold">Method</th>
            <th className="py-3.5 px-6 font-semibold">Status</th>
            <th className="py-3.5 px-6 font-semibold">Date</th>
            <th className="py-3.5 px-6 font-semibold">Amount</th>
            <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/60">
          {payments.map((payment: PaymentHistory, id: number) => {
            const isPaid = payment.status === PaymentStatus.SUCCESS;
            const amount = payment.amount || payment.totalPrice || 0;

            return (
              <tr
                key={payment._id || id}
                className="hover:bg-gray-50/70 transition-colors duration-150 group"
              >
                <td className="py-3 px-6">
                  <div className="truncate">
                    <p className="text-sm font-bold text-gray-900 truncate" title={payment.cus_name}>
                      {payment.cus_name}
                    </p>
                    <p className="text-xs text-gray-505 truncate" title={payment.cus_email}>
                      {payment.cus_email}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-6 text-sm text-gray-650 font-medium">
                  {payment.payment_method || "Card"}
                </td>
                <td className="py-3 px-6">
                  {isPaid ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-505 bg-emerald-500 animate-pulse"></span>
                      Paid
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pending
                    </div>
                  )}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-550">
                    <FiClock className="text-gray-400" />
                    {formatDate(payment.date || payment.tran_date)}
                  </div>
                </td>
                <td className="py-3 px-6 text-sm font-bold text-gray-900">
                  ৳{amount.toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDetailsClick(payment)}
                      className="px-2.5 py-1 text-xs text-orange-600 bg-orange-50/60 hover:bg-orange-100/80 rounded-lg font-semibold border border-orange-100 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

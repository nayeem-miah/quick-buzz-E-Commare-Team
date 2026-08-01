import React from "react";
import { FiClock } from "react-icons/fi";
import { PaymentHistory } from "../../../../types/payment";
import { PaymentStatus } from "../../../../constants/enums";

interface AllPaymentHistoryCardsProps {
  payments: PaymentHistory[];
  formatDate: (date?: string | number | Date) => string;
  onDetailsClick: (payment: PaymentHistory) => void;
  onMarkAsPaid: (payment: PaymentHistory) => void;
}

export const AllPaymentHistoryCards: React.FC<AllPaymentHistoryCardsProps> = ({
  payments,
  formatDate,
  onDetailsClick,
  onMarkAsPaid,
}) => {
  return (
    <div className="md:hidden flex flex-col p-4 gap-4 bg-gray-50/50 min-h-[480px]">
      {payments.map((payment: PaymentHistory, id: number) => {
        const isPaid = payment.status === PaymentStatus.SUCCESS;
        const amount = payment.amount || payment.totalPrice || 0;

        return (
          <div
            key={payment._id || id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3.5 group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-900">{payment.cus_name}</p>
                <p className="text-xs text-gray-500">{payment.cus_email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-955">
                  ৳{amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">
                  {payment.payment_method || "Card"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-1">
              {isPaid ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 bg-emerald-500 animate-pulse"></span>
                  Paid
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-550 bg-amber-500"></span>
                  Pending
                </div>
              )}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FiClock className="text-gray-400" /> {formatDate(payment.date || payment.tran_date)}
              </div>
            </div>

            <div className="h-px w-full bg-gray-100"></div>

            <div className="flex items-center justify-between">
              <div className="text-[10px] font-mono text-gray-400 select-all" title="Transaction ID">
                Trx: {payment.transactionId || "N/A"}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onDetailsClick(payment)}
                  className="px-2.5 py-1 text-xs text-orange-650 bg-orange-50 hover:bg-orange-100 rounded-lg font-semibold border border-orange-100 transition-colors"
                >
                  Details
                </button>
                {!isPaid && payment.payment_method === "Cash on Delivery" && (
                  <button
                    onClick={() => onMarkAsPaid(payment)}
                    className="px-2.5 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold shadow-sm transition-colors"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

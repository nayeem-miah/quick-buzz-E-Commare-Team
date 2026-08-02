import React from "react";
import { FiDollarSign, FiCheckCircle, FiClock, FiCreditCard } from "react-icons/fi";
import { PaymentHistory } from "../../../../types/payment";
import { PaymentStatus } from "../../../../constants/enums";

interface AllPaymentHistoryStatsProps {
  payments: PaymentHistory[];
}

export const AllPaymentHistoryStats: React.FC<AllPaymentHistoryStatsProps> = ({
  payments,
}) => {
  const totalTransactions = payments.length;

  const totalSales = payments
    .filter((p) => p.status === PaymentStatus.SUCCESS)
    .reduce((acc, p) => acc + (p.totalPrice || p.amount || 0), 0);

  const successfulCount = payments.filter(
    (p) => p.status === PaymentStatus.SUCCESS
  ).length;

  const pendingCount = payments.filter(
    (p) => p.status === PaymentStatus.PENDING
  ).length;

  const stats = [
    {
      label: "Total Sales",
      value: `৳${totalSales.toLocaleString()}`,
      icon: <FiDollarSign size={16} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Paid Payments",
      value: successfulCount,
      icon: <FiCheckCircle size={16} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Pending Payments",
      value: pendingCount,
      icon: <FiClock size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Total Records",
      value: totalTransactions,
      icon: <FiCreditCard size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 rounded-xl border border-gray-100/80 shadow-sm flex items-center gap-4 min-w-0"
        >
          <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-lg flex-shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-sm font-extrabold text-gray-950 mt-0.5 truncate">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

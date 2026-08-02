import React from "react";
import { FiShoppingBag, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Order } from "../../../../types/order";
import { OrderStatus } from "../../../../constants/enums";

interface ManageOrdersStatsProps {
  orders: Order[];
}

export const ManageOrdersStats: React.FC<ManageOrdersStatsProps> = ({ orders }) => {
  const totalOrders = orders.length;

  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.PENDING
  ).length;

  const deliveredCount = orders.filter(
    (o) => o.status === OrderStatus.DELIVERED
  ).length;

  const cancelledCount = orders.filter(
    (o) => o.status === OrderStatus.CANCELLED
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <FiShoppingBag size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Orders",
      value: pendingCount,
      icon: <FiClock size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Delivered Orders",
      value: deliveredCount,
      icon: <FiCheckCircle size={16} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Cancelled Orders",
      value: cancelledCount,
      icon: <FiXCircle size={16} />,
      color: "text-red-500",
      bg: "bg-red-50",
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

import React from "react";
import { FiShoppingBag, FiCheckCircle, FiClock } from "react-icons/fi";

interface HostOrdersStatsProps {
  totalOrders: number;
  approvedCount: number;
  pendingCount: number;
}

export const HostOrdersStats: React.FC<HostOrdersStatsProps> = ({
  totalOrders,
  approvedCount,
  pendingCount,
}) => {
  const stats = [
    { label: "Total Orders", value: totalOrders, icon: <FiShoppingBag size={20} />, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Approved",    value: approvedCount, icon: <FiCheckCircle size={20} />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending",     value: pendingCount,  icon: <FiClock size={20} />,       color: "text-amber-500",  bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-row items-start sm:items-center gap-3 sm:gap-4"
        >
          <div className={`p-2.5 sm:p-3 ${stat.bg} ${stat.color} rounded-xl flex-shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

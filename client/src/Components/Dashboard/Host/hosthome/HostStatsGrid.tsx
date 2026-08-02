import { CheckCircle, Clock, DollarSign, Package, ShoppingBag } from "lucide-react";
import React from "react";

interface Props {
  totalAmount: number;
  totalProducts: number;
  approvedCount: number;
  pendingCount: number;
  totalOrders: number;
}

const HostStatsGrid: React.FC<Props> = ({
  totalAmount,
  totalProducts,
  approvedCount,
  pendingCount,
  totalOrders,
}) => {
  const stats = [
    {
      label: "Total Revenue",
      value: `৳${totalAmount?.toLocaleString()}`,
      icon: <DollarSign className="w-4 h-4" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: <Package className="w-4 h-4" />,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: <Clock className="w-4 h-4" />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="w-4 h-4" />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      span: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-center gap-3 hover:shadow-md transition-shadow duration-200 ${
            stat.span ? "col-span-2 lg:col-span-1" : ""
          }`}
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}
          >
            {stat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-lg sm:text-2xl font-black text-gray-900 mt-0.5 leading-none">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HostStatsGrid;

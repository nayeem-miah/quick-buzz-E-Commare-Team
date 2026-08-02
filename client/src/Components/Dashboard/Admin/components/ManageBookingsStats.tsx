import React from "react";
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";

interface ManageBookingsStatsProps {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export const ManageBookingsStats: React.FC<ManageBookingsStatsProps> = ({
  total,
  approved,
  pending,
  rejected,
}) => {
  const stats = [
    { label: "Total Products", value: total, icon: <Package className="w-4 h-4" />, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Approved",       value: approved, icon: <CheckCircle className="w-4 h-4" />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending Approval", value: pending,  icon: <Clock className="w-4 h-4" />,       color: "text-amber-500",  bg: "bg-amber-50" },
    { label: "Rejected",       value: rejected, icon: <XCircle className="w-4 h-4" />,     color: "text-red-500",    bg: "bg-red-50" },
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
            <p className="text-sm font-extrabold text-gray-950 mt-0.5">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

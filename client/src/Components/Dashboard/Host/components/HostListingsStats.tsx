import React from "react";
import { Package, CheckCircle, Clock, XCircle } from "lucide-react";

interface HostListingsStatsProps {
  totalListings: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export const HostListingsStats: React.FC<HostListingsStatsProps> = ({
  totalListings,
  approvedCount,
  pendingCount,
  rejectedCount,
}) => {
  const stats = [
    { label: "Total Listings", value: totalListings, icon: <Package className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Approved",       value: approvedCount, icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending",        value: pendingCount,  icon: <Clock className="w-5 h-5" />,       color: "text-amber-500",  bg: "bg-amber-50" },
    { label: "Rejected",       value: rejectedCount, icon: <XCircle className="w-5 h-5" />,     color: "text-red-500",    bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
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

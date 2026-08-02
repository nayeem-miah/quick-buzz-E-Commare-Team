import React from "react";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { SellerDetails } from "../AllHostRequest";

interface AllHostRequestsStatsProps {
  requests: SellerDetails[];
}

export const AllHostRequestsStats: React.FC<AllHostRequestsStatsProps> = ({
  requests,
}) => {
  const totalRequests = requests.length;

  const pendingCount = requests.filter(
    (r) => (r.adminIsApproved || "").toLowerCase() === "pending"
  ).length;

  const approvedCount = requests.filter(
    (r) => (r.adminIsApproved || "").toLowerCase() === "approved"
  ).length;

  const declinedCount = requests.filter(
    (r) => (r.adminIsApproved || "").toLowerCase() === "declined"
  ).length;

  const stats = [
    {
      label: "Total Applications",
      value: totalRequests,
      icon: <FiFileText size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Review",
      value: pendingCount,
      icon: <FiClock size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Approved Hosts",
      value: approvedCount,
      icon: <FiCheckCircle size={16} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Declined Requests",
      value: declinedCount,
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

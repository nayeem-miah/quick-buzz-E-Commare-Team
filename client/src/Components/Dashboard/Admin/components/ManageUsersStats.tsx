import React from "react";
import { FiUsers, FiUser, FiShoppingBag, FiSlash } from "react-icons/fi";
import { User } from "../../../../types/user";

interface ManageUsersStatsProps {
  users: User[];
}

export const ManageUsersStats: React.FC<ManageUsersStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  
  const customerCount = users.filter(
    (u) => !u.role || u.role.toLowerCase() === "user" || u.role.toLowerCase() === "customer"
  ).length;

  const hostCount = users.filter(
    (u) => u.role?.toLowerCase() === "host"
  ).length;

  const suspendedCount = users.filter(
    (u) => u.status === "suspended"
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: <FiUsers size={16} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Customers",
      value: customerCount,
      icon: <FiUser size={16} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Sellers / Hosts",
      value: hostCount,
      icon: <FiShoppingBag size={16} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Suspended",
      value: suspendedCount,
      icon: <FiSlash size={16} />,
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

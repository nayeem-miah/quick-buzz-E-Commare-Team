import React from "react";
import { FiLayers, FiPackage, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import { Category } from "../../../../types/category.type";

interface ManageCategoriesStatsProps {
  categories: Category[];
}

export const ManageCategoriesStats: React.FC<ManageCategoriesStatsProps> = ({
  categories,
}) => {
  const totalCategories = categories.length;
  
  const totalProducts = categories.reduce(
    (acc, cat) => acc + (cat.totalProducts || 0),
    0
  );

  const mostPopular = categories.reduce(
    (prev, current) => {
      const currentProducts = current.totalProducts || 0;
      return currentProducts > prev.totalProducts
        ? { name: current.name, totalProducts: currentProducts }
        : prev;
    },
    { name: "N/A", totalProducts: 0 }
  );

  const emptyCategories = categories.filter(
    (cat) => (cat.totalProducts || 0) === 0
  ).length;

  const stats = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: <FiLayers size={16} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Products Categorized",
      value: totalProducts,
      icon: <FiPackage size={16} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Popular Category",
      value: mostPopular.name,
      icon: <FiTrendingUp size={16} />,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Empty Categories",
      value: emptyCategories,
      icon: <FiAlertCircle size={16} />,
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

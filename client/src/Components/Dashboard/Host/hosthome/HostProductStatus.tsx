import React from "react";

interface Props {
  totalProducts: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

const HostProductStatus: React.FC<Props> = ({
  totalProducts,
  approvedCount,
  pendingCount,
  rejectedCount,
}) => {
  const rows = [
    { label: "Approved", count: approvedCount, bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending",  count: pendingCount,  bar: "bg-amber-400",   text: "text-amber-600",  bg: "bg-amber-50" },
    { label: "Rejected", count: rejectedCount, bar: "bg-red-400",     text: "text-red-600",   bg: "bg-red-50" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Status</h2>
        <span className="text-[10px] text-gray-400">Distribution of your listings</span>
      </div>

      {/* Progress bars */}
      <div className="space-y-4 flex-1">
        {rows.map((row) => {
          const pct = totalProducts ? Math.round((row.count / totalProducts) * 100) : 0;
          return (
            <div key={row.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-xs font-bold ${row.text}`}>{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">{row.count}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${row.bg} ${row.text}`}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${row.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Listings</span>
        <span className="text-sm font-black text-gray-800">{totalProducts}</span>
      </div>
    </div>
  );
};

export default HostProductStatus;

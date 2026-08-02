/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingUp } from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDataPoint {
  date: string;
  Sales: number;
}

interface Props {
  chartData: ChartDataPoint[];
  hasData: boolean;
  timeRange: "7days" | "30days";
  onTimeRangeChange: (range: "7days" | "30days") => void;
}

const HostSalesChart: React.FC<Props> = ({
  chartData,
  hasData,
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Sales Revenue
          </h2>
          <span className="text-[10px] text-gray-400">Daily earnings tracking</span>
        </div>

        {/* Time range toggle */}
        <div className="flex gap-1.5">
          {(["7days", "30days"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onTimeRangeChange(range)}
              className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-colors ${
                timeRange === range
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                  : "text-gray-500 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {range === "7days" ? "7d" : "30d"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="h-64 w-full">
        {!hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <span className="p-2.5 bg-orange-50 rounded-full text-orange-500 mb-2">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-semibold text-slate-800">No Sales Data</h3>
            <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">
              Once you receive successful orders, your sales chart will appear here.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "10px",
                  boxShadow: "none",
                }}
                formatter={(value: any) => [`৳${value}`, "Sales"]}
              />
              <Area
                type="monotone"
                dataKey="Sales"
                stroke="#f97316"
                strokeWidth={1.5}
                fill="#ffedd5"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default HostSalesChart;

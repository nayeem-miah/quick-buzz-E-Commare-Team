/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import { PaymentStatus } from "../../../../constants/enums";

interface BookingData {
  status: string;
  tran_date: string;
  totalPrice: number;
}

const EnhancedBarChart: React.FC = () => {
  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("30days"); // default to 30 days
  const [allBookings, setAllBookings] = useState<BookingData[]>([]);
  const axiosSecure = UseAxiosSecure();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosSecure.get("/payments");
      const bookingsData: BookingData[] = response.data.data;

      const bookings = bookingsData.filter((item) => item.status === PaymentStatus.SUCCESS);
      setAllBookings(bookings);

      if (bookings.length === 0) {
        setError("No booking data available! Bar chart cannot be displayed.");
      }
    } catch (error: any) {
      setError("Error fetching data: " + (error.message || "Unknown error"));
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allBookings.length === 0) return;

    const now = new Date();
    let filteredBookings = [...allBookings];

    if (filter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filteredBookings = allBookings.filter(b => new Date(b.tran_date) >= sevenDaysAgo);
    } else if (filter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      filteredBookings = allBookings.filter(b => new Date(b.tran_date) >= thirtyDaysAgo);
    } else if (filter === "thismonth") {
      filteredBookings = allBookings.filter(b => {
        const date = new Date(b.tran_date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });
    }

    const bookingMap: { [key: string]: number } = {};
    filteredBookings.forEach((item) => {
      const date = new Date(item.tran_date);
      // Format as DD MMM
      const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      bookingMap[formattedDate] = (bookingMap[formattedDate] || 0) + (item.totalPrice || 0);
    });

    const chartData = Object.entries(bookingMap).map(([date, amount]) => ({
      date,
      price: amount,
    }));

    chartData.sort((a, b) => new Date(a.date + ' ' + now.getFullYear()).getTime() - new Date(b.date + ' ' + now.getFullYear()).getTime());
    setData(chartData);

  }, [allBookings, filter]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading chart data...</div>;
  if (error) return <div className="p-8 text-center text-gray-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-3 py-2 outline-none"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="thismonth">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#fdba74" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: '12px',
              border: "1px solid #f3f4f6",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            itemStyle={{ fontWeight: "600", color: "#f97316" }}
            labelStyle={{ fontWeight: "600", color: "#374151", marginBottom: '4px' }}
            cursor={{ fill: "#fff7ed" }}
          />
          <Bar
            dataKey="price"
            name="Revenue"
            fill="url(#barGradient)"
            barSize={24}
            animationBegin={200}
            animationDuration={1000}
            animationEasing="ease-in-out"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedBarChart;

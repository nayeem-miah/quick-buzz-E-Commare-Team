import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useAxiosPublic from "../../../../Hooks/UsePublic";
import useAuth from "../../../../Hooks/UseAuth";

interface BookingData {
  status: string;
  tran_date: string;
  totalPrice: number;
}

const EnhancedBarChart: React.FC = () => {
  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPublic.get(`/host-payment-history/${user?.email}`);
      const bookingsData: BookingData[] = response.data;

      const bookings = bookingsData.filter((item) => item.status === "success");
      if (bookings.length === 0) {
        setError("No booking data available! Bar chart cannot be displayed.");
        setLoading(false);
        return;
      }

      const bookingMap: { [key: string]: number } = {};
      bookings.forEach((item) => {
        const date = new Date(item.tran_date);
        const formattedDate = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        bookingMap[formattedDate] =
          (bookingMap[formattedDate] || 0) + item.totalPrice;
      });

      const chartData = Object.entries(bookingMap).map(([date, amount]) => ({
        date,
        price: amount,
      }));

      chartData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setData(chartData);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#81c784" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis
          dataKey="date"
          stroke="#555"
          tick={{ fontSize: 12, fontWeight: 600 }}
          tickLine={false}
        />
        <YAxis
          stroke="#555"
          tick={{ fontSize: 12, fontWeight: 600 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#f4f4f4",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          itemStyle={{ fontWeight: "bold", color: "#4caf50" }}
          labelStyle={{ fontWeight: "bold" }}
          cursor={{ fill: "rgba(76, 175, 80, 0.1)" }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="price"
          fill="url(#barGradient)"
          barSize={30}
          animationBegin={300}
          animationDuration={1500}
          animationEasing="ease-in-out"
          radius={[5, 5, 0, 0]} // Rounded corners for bars
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnhancedBarChart;

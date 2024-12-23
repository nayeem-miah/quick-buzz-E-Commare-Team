import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MyChartComponent: React.FC = () => {
  const dataset = [
    { month: 'January', bangladesh: 30, paris: 20, newYork: 50, seoul: 40 },
    { month: 'February', bangladesh: 25, paris: 15, newYork: 45, seoul: 35 },
    { month: 'March', bangladesh: 35, paris: 25, newYork: 55, seoul: 45 },
    { month: 'April', bangladesh: 40, paris: 30, newYork: 60, seoul: 50 },
    { month: 'May', bangladesh: 45, paris: 35, newYork: 65, seoul: 55 },
    { month: 'June', bangladesh: 50, paris: 40, newYork: 70, seoul: 60 },
    { month: 'July', bangladesh: 55, paris: 45, newYork: 75, seoul: 65 },
    { month: 'August', bangladesh: 60, paris: 50, newYork: 80, seoul: 70 },
    { month: 'September', bangladesh: 65, paris: 55, newYork: 85, seoul: 75 },
    { month: 'October', bangladesh: 70, paris: 60, newYork: 90, seoul: 80 },
    { month: 'November', bangladesh: 75, paris: 65, newYork: 95, seoul: 85 },
    { month: 'December', bangladesh: 80, paris: 70, newYork: 100, seoul: 90 },
  ];

  return (
    <BarChart width={700} height={400} data={dataset}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="bangladesh" fill="#8884d8" name="Bangladesh" />
      <Bar dataKey="paris" fill="#82ca9d" name="Paris" />
      <Bar dataKey="newYork" fill="#ffc658" name="New York" />
      <Bar dataKey="seoul" fill="#ff7300" name="Seoul" />
    </BarChart>
  );
};

export default MyChartComponent;

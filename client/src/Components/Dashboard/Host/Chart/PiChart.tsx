import React from "react";
import { Chart } from "react-google-charts";

interface Data {
  data: any[];
  adminManageProduct: any[];
}

const options = {
  title: "My Product Activities",
  slices: {
    0: { color: "#3366CC" },
    1: { color: "#28a745" }, 
    2: { color: "#dc3545" }, 
  },
  animation: {
    startup: true, 
    easing: "inAndOut", 
    duration: 1000, 
  },
  pieSliceText: "percentage", 
  legend: {
    position: "labeled", 
  },
  pieSliceTextStyle: {
    color: "white", // Color of the text inside the slices
  },
  tooltip: {
    trigger: "selection", // Show tooltip when a slice is selected
  },
};

const PiChart: React.FC<Data> = ({ data = [], adminManageProduct = [] }) => {
  // Fallback values if no data is provided
  const fallbackData = [
    ["Task", "Count"],
    ["Total product", 10],
    ["Success product", 5],
    ["Pending product", 5],
  ];

  // Calculate pending products
  const pendingProduct = data.length - adminManageProduct.length;

  // Prepare chart data, using fallback if necessary
  const chartData = data.length
    ? [
        ["Task", "Count"],
        ["Total product", data.length],
        ["Success product", adminManageProduct.length],
        ["Pending product", pendingProduct],
      ]
    : fallbackData;

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={options}
        width={"100%"}
        height={"500px"} // Increased chart height for better visibility
      />
    </div>
  );
};

export default PiChart;

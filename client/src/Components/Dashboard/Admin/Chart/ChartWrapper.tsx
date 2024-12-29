import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import { Chart } from "react-google-charts";

// Data fetching and integration
const ChartWrapper = () => {
  const axiosSecure = UseAxiosSecure();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["alluser"],
    queryFn: async () => {
      const res = await axiosSecure.get("/alluser");
      return res.data;
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  if (usersLoading || productsLoading) {
    return <p>Loading...</p>;
  }

  const chartData = [
    ["Category", "Count"],
    ["Products", products.length],
    ["Users", users.length],
  ];

  const options = {
    title: "Products and Users Overview",
    is3D: true, 
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
    },
    colors: ["#1E90FF", "#FF6347"],
    legend: {
      position: "top", 
      textStyle: {
        color: "#333", 
        fontSize: 14,
      },
    },
    pieSliceText: "percentage", 
    pieSliceTextStyle: {
      color: "#fff",
      fontSize: 14,
    },
    tooltip: {
      trigger: "selection", 
    },
    animation: {
      startup: true, 
      duration: 1000, 
      easing: "out",
    },
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-100 to-gray-200 rounded-lg shadow-lg">
      <div className="w-full max-w-lg">
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={"100%"}
          height={"400px"}
        />
      </div>
    </div>
  );
};

export default ChartWrapper;

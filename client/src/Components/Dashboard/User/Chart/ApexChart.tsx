import React from "react";
import Chart from "react-apexcharts";

// Define the shape of the state
interface ApexChartState {
  series: Array<{
    name: string;
    data: [number, number][]; // Array of [timestamp, totalPrice for the day]
  }>;
  options: {
    chart: {
      type: string;
      zoom: { enabled: boolean };
      background: string; // Set background color for better visibility
      toolbar: {
        show: boolean; // Disable the toolbar
      };
      animations: {
        enabled: boolean;
        easing: string;
        speed: number;
      };
    };
    xaxis: {
      type: string;
      title: { text: string };
    };
    yaxis: {
      title: { text: string };
    };
    title: {
      text: string;
      align: string;
    };
    stroke: {
      curve: string; // Add smooth curve for the line
      width: number; // Line thickness
    };
    markers: {
      size: number; // Marker size for data points
    };
    tooltip: {
      enabled: boolean; // Enable tooltips to show data values
    };
  };
}

// Declare the PaymentHistoryData type
interface PaymentHistoryData {
  status: string;
  totalPrice: number;
  date: string;
}

interface ApexChartProps {
  PaymentHistoryData: PaymentHistoryData[];
}

class ApexChart extends React.Component<ApexChartProps, ApexChartState> {
  constructor(props: ApexChartProps) {
    super(props);

    // Filter the successful payments
    const paymentData = props.PaymentHistoryData.filter(
      (item) => item.status === "success"
    );

    // Calculate total price per day
    const dailyTotalPrice = paymentData.reduce((acc: any, item) => {
      const date = new Date(item.date).toDateString(); // Get the date part only
      if (!acc[date]) {
        acc[date] = 0; // Initialize total price for the day
      }
      acc[date] += item.totalPrice; // Add the total price of the transaction to the day
      return acc;
    }, {});

    // Convert daily total price data into the required chart format
    const seriesData = Object.keys(dailyTotalPrice).map((date) => [
      new Date(date).getTime(), // Convert date to timestamp
      dailyTotalPrice[date], // Total price for the day
    ]);

    this.state = {
      series: [
        {
          name: "Total Price per Day",
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "line",
          zoom: { enabled: false },
          background: "#f4f4f4", // Add a light background for visibility
          toolbar: {
            show: false, // Disable the download and other toolbar options
          },
          animations: {
            enabled: true,
            easing: "easeinout", // Smooth animation
            speed: 1000, // Animation speed
          },
        },
        xaxis: {
          type: "datetime",
          title: {
            text: "Date",
          },
        },
        yaxis: {
          title: {
            text: "Total Price (BDT)",
          },
        },
        title: {
          text: "Total Price per Day",
          align: "left",
        },
        stroke: {
          curve: "smooth", // Make the line smooth
          width: 3, // Set the line width
        },
        markers: {
          size: 5, // Add markers at data points
        },
        tooltip: {
          enabled: true, // Show data on hover
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height="350"
        />
      </div>
    );
  }
}

export default ApexChart;

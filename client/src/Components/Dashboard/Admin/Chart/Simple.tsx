import React from "react";
import ReactApexChart from "react-apexcharts";

// Define the state interface
interface ApexChartState {
  series: number[];
  options: {
    chart: {
      height: number;
      type: string;
      animations: {
        enabled: boolean;
        easing: string;
        speed: number;
        animateGradually: {
          enabled: boolean;
          delay: number;
        };
        dynamicAnimation: {
          enabled: boolean;
          speed: number;
        };
      };
      background: string;
      foreColor: string;
    };
    plotOptions: {
      radialBar: {
        size: number;
        startAngle: number;
        endAngle: number;
        hollow: {
          margin: number;
          size: string;
          background: string;
          dropShadow: {
            enabled: boolean;
            top: number;
            left: number;
            blur: number;
            color: string;
            opacity: number;
          };
        };
        track: {
          background: string;
          strokeWidth: string;
        };
        dataLabels: {
          name: {
            fontSize: string;
            color: string;
            fontWeight: string;
          };
          value: {
            fontSize: string;
            offsetY: number;
            color: string;
            fontWeight: string;
            formatter: (val: number) => string;
          };
          total: {
            show: boolean;
            label: string;
            color: string;
            formatter: () => string;
          };
        };
      };
    };
    labels: string[];
    colors: string[];
  };
}

// Main ApexCart component
class ApexCart extends React.Component<
  { data: any[]; users: any[] },
  ApexChartState
> {
  static defaultProps = {
    data: [],
    users: [],
  };

  constructor(props: { data: any[]; users: any[] }) {
    super(props);

    this.state = {
      series: [props.data.length, props.users.length],
      options: {
        chart: {
          height: 400,
          type: "radialBar",
          background: "#f4f6f9",
          foreColor: "#333",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1200,
            animateGradually: {
              enabled: true,
              delay: 200,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 500,
            },
          },
        },
        plotOptions: {
          radialBar: {
            size: 350,
            startAngle: -120,
            endAngle: 120,
            hollow: {
              margin: 15,
              size: "65%",
              background: "#ffffff",
              dropShadow: {
                enabled: true,
                top: 5,
                left: 0,
                blur: 10,
                color: "rgba(0, 0, 0, 0.25)",
                opacity: 0.5,
              },
            },
            track: {
              background: "#e0e0e0",
              strokeWidth: "85%",
            },
            dataLabels: {
              name: {
                fontSize: "18px",
                color: "#555",
                fontWeight: "600",
              },
              value: {
                fontSize: "24px",
                offsetY: 10,
                color: "#000",
                fontWeight: "bold",
                formatter: (val: number) => `${val}%`,
              },
              total: {
                show: true,
                label: "Overall",
                color: "#777",
                formatter: () => {
                  const total = props.data.length + props.users.length;
                  return `${total}`;
                },
              },
            },
          },
        },
        labels: ["All Products", "All Users"],
        colors: ["#1E90FF", "#FF6347"], // Blue and Tomato colors for better contrast
      },
    };
  }

  render() {
    return (
      <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-100 to-gray-100 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Products and Users Overview
        </h1>
        <div id="chart" className="w-full max-w-lg">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            height={400}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 font-medium">
            Stay updated with the latest insights on your platform's performance
          </p>
        </div>
      </div>
    );
  }
}

export default ApexCart;

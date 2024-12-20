/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactApexChart from "react-apexcharts";

interface ApexChartState {
  series: number[];
  options: {
    chart: {
      height: number;
      type: string;
    };
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: string;
          };
          value: {
            fontSize: string;
          };
          total: {
            show: boolean;
            label: string;
            formatter: (w: any) => string | number;
          };
        };
      };
    };
    labels: string[];
  };
}

class ApexCart extends React.Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [44, 55, 67, 83],
      options: {
        chart: {
          height: 350,
          type: "radialBar",
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: "22px",
              },
              value: {
                fontSize: "16px",
              },
              total: {
                show: true,
                label: "Total",
                formatter: function (w) {
                  return 249; // Custom formatter logic
                },
              },
            },
          },
        },
        labels: ["Apples", "Oranges", "Bananas", "Berries"],
      },
    };
  }

  render() {
    return (
      <div className="flex flex-col items-center p-4">
        <div id="chart" className="w-full max-w-md">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="radialBar"
            height={350}
          />
        </div>
        <div id="html-dist" className="mt-4 text-center"></div>
      </div>
    );
  }
}

export default ApexCart;

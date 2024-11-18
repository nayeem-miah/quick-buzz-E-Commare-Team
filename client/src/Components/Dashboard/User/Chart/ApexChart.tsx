import React from 'react';
import Chart from 'react-apexcharts';

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'Data Series',
          data: [
            [1327359600000, 30.95],
            [1327446000000, 31.34],
            [1327532400000, 31.18],
            // ... add other data points here
          ],
        },
      ],
      options: {
        chart: {
          type: 'line',
          zoom: { enabled: false },
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          title: {
            text: 'Value',
          },
        },
        title: {
          text: 'Time Series Chart',
          align: 'left',
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

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler for area fill
} from 'chart.js';

// Register the necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register Filler
);

const GoldPriceChart = () => {
  // In a real application, you would fetch this data from an API
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // Replace with your actual data fetching logic
      // Sample data resembling the image
      const dates = [
        '19 Apr', '21 Apr', '23 Apr', '25 Apr', '27 Apr', '29 Apr',
        '1 May', '3 May', '5 May', '7 May', '9 May', '11 May', '13 May',
      ];
      const prices = [
        98000, 98500, 101800, 99500, 100000, 98800,
        98200, 96500, 99000, 100500, 100200, 99800, 97000,
      ];

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Gold Price (10g of 24k)',
            data: prices,
            borderColor: 'rgb(255, 255, 255)', // A greenish-cyan, similar to the image
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter fill color
            tension: 0.4, // Makes the line smoother
            fill: true, // Fill the area under the line
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 192, 192)',
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control height and width more flexibly
    plugins: {
      legend: {
        display: false, // In the image, the legend is not directly on the chart
      },
      title: {
        display: false, // Title is displayed above the chart in the image
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hides X-axis grid lines
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Light color for x-axis labels
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Very subtle Y-axis grid lines
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // Light color for y-axis labels
          // Include a dollar sign in the ticks and format numbers
          callback: function (value, index, values) {
            if (value >= 1000) {
              return (value / 1000) + 'k';
            }
            return value;
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
  };

  // You'll want to wrap this in a div to control its size
  return (
    <div style={{ height: '300px', width: '100%' }}> {/* Adjust height as needed */}
      {chartData.labels.length > 0 ? (
        <Line options={options} data={chartData} />
      ) : (
        <p className="text-white/70">Loading chart data...</p>
      )}
    </div>
  );
};

export default GoldPriceChart;
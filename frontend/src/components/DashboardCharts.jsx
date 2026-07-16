import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Attractive accent palette (consistent with the rest of the dashboard)
const PALETTE = [
  "#2563eb", // blue
  "#f59e0b", // amber
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#0891b2", // teal
  "#ec4899", // pink
];

function DashboardCharts() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    try {
      const response = await api.get("/dashboard/charts");
      setChartData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!chartData) {
    return <h3 style={{ color: "white" }}>Loading Charts...</h3>;
  }

  const barColors = chartData.labels.map(
    (_, i) => PALETTE[i % PALETTE.length]
  );

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Stock Quantity",
        data: chartData.stock,
        backgroundColor: barColors,
        borderRadius: 8,
        maxBarThickness: 60,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 2,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: {
            size: 13,
            weight: "bold",
          },
        },
      },
      y: {
        ticks: {
          color: "#fff",
          font: {
            size: 13,
          },
        },
      },
    },
  };

  const categoryLabels = Object.keys(chartData.categories);
  const pieColors = categoryLabels.map((_, i) => PALETTE[i % PALETTE.length]);

  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: Object.values(chartData.categories),
        backgroundColor: pieColors,
        borderColor: "#1e293b",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 2,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        marginTop: "40px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          width: "500px",
          height: "380px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ color: "white" }}>📊 Product Stock</h2>
        <div style={{ position: "relative", height: "300px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          width: "400px",
          height: "380px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ color: "white" }}>🥧 Categories</h2>
        <div style={{ position: "relative", height: "300px" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
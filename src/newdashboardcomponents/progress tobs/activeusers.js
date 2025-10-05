import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { BASE_URL } from "../../config";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FullColorGaugeCard({ maxUsers = 100 }) {
  const [value, setValue] = useState(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chartRef = useRef(null);

  // Fetch Data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/active-users-today`);
      const data = await res.json();
      if (data && typeof data.activeUsersToday === "number") {
        setValue(data.activeUsersToday);
      } else {
        setValue(0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setValue(0);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Animate smooth transition from previous value to new value
  useEffect(() => {
    if (value === null) return;
    let start = displayValue;
    let end = value;
    let startTime = performance.now();
    const duration = 800;

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const newValue = Math.floor(start + (end - start) * progress);
      setDisplayValue(newValue);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  if (value === null) return <p>Loading...</p>;

  // Gradient color
  let gradient = "#11ff00";
  const chart = chartRef.current;
  if (chart && chart.ctx) {
    const ctx = chart.ctx;
    const g = ctx.createLinearGradient(0, 0, 0, 150);
    g.addColorStop(0, "#44ff00");
    g.addColorStop(1, "#0400ff");
    gradient = g;
  }

  // Chart data
  const safeValue = Math.max(0, Math.min(value, maxUsers));
  const data = {
    labels: ["Active", "Remaining"],
    datasets: [
      {
        data: [safeValue, maxUsers - safeValue],
        backgroundColor: [gradient, "#eaeaea"],
        borderWidth: 0,
        cutout: "80%",
        circumference: 360,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div
      style={{
        width: "260px",
        height: "100px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "17px",
            fontWeight: "500",
            color: "#555",
            letterSpacing: "0.5px",
          }}
        >
          Active Users Today
        </span>

        
      {/* Chart */}
      <div
        style={{
          width: "70px",
          height: "70px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Doughnut ref={chartRef} data={data} options={options} />
        <div
          style={{
            position: "absolute",
            fontSize: "14px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          {displayValue}
        </div>
      </div>

      <button
          onClick={fetchData}
          style={{
            display:"flex",
            alignContent:"flex-start",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            margin:"-50px -10px 0 0"
          }}
          title="Refresh"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#007bff"
            viewBox="0 0 16 16"
            style={{
              transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
              transition: "transform 0.8s ease-in-out",
            }}
          >
            <path d="M8 3a5 5 0 1 1-4.546 2.916.5.5 0 0 1 .908-.418A4 4 0 1 0 8 4V1.5a.5.5 0 0 1 1 0V4a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1 0-1H8z" />
          </svg>
        </button>
      </div>

    </div>
  );
}

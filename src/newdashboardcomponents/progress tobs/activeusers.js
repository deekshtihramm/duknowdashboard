import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { BASE_URL } from "../../config";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FullColorGaugeCard({ maxUsers = 100 }) {
  const [value, setValue] = useState(null);
  const [displayValue, setDisplayValue] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard/active-users-today`)
      .then((res) => res.json())
      .then((data) => setValue(data.activeUsersToday));
  }, []);

  // Smooth number animation
  useEffect(() => {
    if (value === null) return;
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  if (value === null) return <p>Loading...</p>;

  // Gradient fill
  const chart = chartRef.current;
  let gradient = "#11ff00ff";
  if (chart) {
  const ctx = chart.ctx;
  let gradient = ctx.createLinearGradient(0, 0, 0, 150);
  gradient.addColorStop(0, "#44ff00ff");
  gradient.addColorStop(1, "#0400ffff");
  
  // Use this gradient in dataset background
  chart.data.datasets[0].backgroundColor = gradient;
}


  const data = {
    datasets: [
      {
        data: [value, maxUsers - value],
        backgroundColor: [gradient, "#eaeaea"],
        borderWidth: 0,
        cutout: "80%", // thin ring
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
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
      }}
    >
      {/* LEFT SIDE TEXT */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "17px",
            fontWeight: "500",
            color: "#555",
            marginBottom: "8px",
            letterSpacing: "0.5px",
          }}
        >
          Active Users Today
        </span>
        {/* <span style={{ fontSize: "22px", fontWeight: "700", color: "#333" }}>
          <span style={{ color: "green", marginRight: "6px" }}>↑</span>
          234%
        </span> */}
      </div>

      {/* RIGHT SIDE CIRCLE */}
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
    </div>
  );
}

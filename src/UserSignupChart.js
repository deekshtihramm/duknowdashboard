import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { BASE_URL } from "./config";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserSignupChart = () => {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState("30"); // default: last 30 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/normaluser/allusers-createdAt`);
        const data = await res.json();

        const today = new Date();
        let startDate;

        // Determine start date based on selected timeframe
        if (timeframe === "7") startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        else if (timeframe === "30") startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
        else if (timeframe === "365") startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1); 
        else startDate = new Date(0); // all time

        // Filter users by selected timeframe
        const filteredUsers = data.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= startDate && createdAt <= today;
        });

        // Group users by date
        const dateCounts = {};
        filteredUsers.forEach(user => {
          const dateStr = new Date(user.createdAt).toISOString().split("T")[0];
          dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });

        // Prepare labels and counts
        const labels = [];
        const counts = [];

        if (timeframe !== "all") {
          const days = parseInt(timeframe);
          for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split("T")[0];
            labels.push(dateStr);
            counts.push(dateCounts[dateStr] || 0);
          }
        } else {
          // For all-time, sort dates from data
          const allDates = Object.keys(dateCounts).sort();
          allDates.forEach(date => {
            labels.push(date);
            counts.push(dateCounts[date]);
          });
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "New Users",
              data: counts,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.3
            }
          ]
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [timeframe]);

  if (!chartData) return <p>Loading chart...</p>;

  const buttonStyle = {
    marginRight: "10px",
    padding: "8px 16px",
    border: "2px solid #0099ff",
    borderRadius: "4px",
    background: "#ffffffff",
    color: "#0099ff",
  }
  return (
    <div style={{ width: "100%", maxWidth: "1000%", margin: "0 auto" }}>
      <h3>User Signups</h3>

      {/* Timeframe Selector */}
      <div style={{ marginBottom: "10px" }}>
        <button style={buttonStyle} onClick={() => setTimeframe("7")}>Last 7 Days</button>
        <button style={buttonStyle} onClick={() => setTimeframe("30")}>Last 30 Days</button>
        <button style={buttonStyle} onClick={() => setTimeframe("365")}>Last 1 Year</button>
        <button style={buttonStyle} onClick={() => setTimeframe("all")}>All Time</button>
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "User Signups"
            },
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Number of Users" } },
            x: { title: { display: true, text: "Date" } }
          }
        }}
      />
    </div>
  );
};

export default UserSignupChart;

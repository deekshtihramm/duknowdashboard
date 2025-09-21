import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { BASE_URL } from "./config";

const allowedCategories = [
  "general", "business", "food", "history", "movies", "mythology", "scientists",
  "space", "sports", "technology", "aptitude", "computer", "english", "reasoning",
  "gk", "polity", "geography", "currentaffairs", "economy", "environment",
  "ethics", "coding", "chemistry", "software", "aitools"
];

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD",
  "#52BE80", "#F1948A", "#5DADE2", "#F7DC6F", "#45B39D",
  "#D98880", "#7DCEA0", "#AF7AC5", "#F0B27A", "#58D68D",
  "#85929E", "#E59866", "#48C9B0", "#F5B041", "#CD6155"
];

// 🔹 Pie chart label (%)
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const UsersCategoryAnalysis = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/normaluser/all`);
        const users = res.data;

        const categoryCount = {};
        users.forEach(user => {
          if (Array.isArray(user.pageNames)) {
            user.pageNames.forEach(page => {
              const category = page.split("-")[0]; 
              if (allowedCategories.includes(category)) {
                categoryCount[category] = (categoryCount[category] || 0) + 1;
              }
            });
          }
        });

        const total = Object.values(categoryCount).reduce((a, b) => a + b, 0);

        const formattedData = Object.entries(categoryCount).map(([cat, count]) => ({
          name: cat,
          value: count,
          percentage: ((count / total) * 100).toFixed(1)
        }));

        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
      {/* Pie Chart (Percentage) */}
      <div style={{ width: "50%", height: 450 }}>
        <h3 style={{ textAlign: "center" }}>🥧 Category Usage (% Percentage)</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={70}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart (Counts) */}
      <div style={{ width: "50%", height: 450 }}>
        <h3 style={{ textAlign: "center" }}>📊 Category Usage (Counts)</h3>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersCategoryAnalysis;

import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BASE_URL } from "./config";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [latestQuestions, setLatestQuestions] = useState([]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  useEffect(() => {
    // Fetch all users
    fetch(`${BASE_URL}/api/usersearch/users`)
      .then((res) => res.json())
      .then((data) => setUserCount(data.length))
      .catch((err) => console.error("Failed to fetch users", err));

    // Fetch email-filtered users
    fetch(`${BASE_URL}/api/usersearch/email/users`)
      .then((res) => res.json())
      .then((data) => console.log("Filtered Users", data))
      .catch((err) => console.error("Failed to fetch filtered users", err));

    // Fetch latest questions
    fetch(`${BASE_URL}/api/randomquestions`)
      .then((res) => res.json())
      .then((data) => setLatestQuestions(data.slice(-5).reverse()))
      .catch((err) => console.error("Failed to fetch questions", err));

    // Fetch total question count
    fetch(`${BASE_URL}/api/randomquestions/count`)
      .then((res) => res.json())
      .then((data) => setQuestionCount(data.count))
      .catch((err) => console.error("Failed to fetch count", err));

    // Fetch question count by category
    fetch(`${BASE_URL}/api/randomquestions/count/category`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Object.keys(data).map((category) => ({
          name: category,
          value: data[category],
        }));
        setCategoryCounts(formattedData);
      })
      .catch((err) => console.error("Failed to fetch category counts", err));
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Duknow Dashboard</h1>

        <div className="metrics">
          <div className="metric-card">
            <h2>Total Users</h2>
            <p>{userCount}</p>
          </div>
          <div className="metric-card">
            <h2>Total Questions</h2>
            <p>{questionCount}</p>
          </div>
        </div>

        <div className="chart-section">
          <h2>Questions by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="latest-questions">
          <h2>Latest Questions</h2>
          <ul>
            {latestQuestions.map((q) => (
              <li key={q._id}>{q.question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

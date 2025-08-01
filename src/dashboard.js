import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import "./Dashboard.css";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#8dd1e1"];

  useEffect(() => {
    fetch("/api/randomquestions/count")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Total Questions API:", data);
        setQuestionCount(data.totalQuestions || 0);
      })
      .catch(err => {
        console.error("❌ Error fetching question count:", err);
      });

    fetch("/api/emailusersearch/user/count") // You may need to implement this route
      .then(res => res.json())
      .then(data => {
        console.log("✅ Total Users API:", data);
        setUserCount(data.count || 0);
      })
      .catch(err => {
        console.error("❌ Error fetching user count:", err);
      });

    fetch("/api/randomquestions/count/category")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Category-wise Count API:", data);
        const transformed = Object.entries(data).map(([category, count]) => ({
          category,
          count
        }));
        setCategoryStats(transformed);
      })
      .catch(err => {
        console.error("❌ Error fetching category stats:", err);
      });

    fetch("/api/randomquestions")
      .then(res => res.json())
      .then(data => {
        console.log("✅ All Questions API:", data);
        if (Array.isArray(data)) {
          setRecentQuestions(data.slice(-10).reverse());
        } else {
          console.error("❌ Expected an array for recent questions, got:", data);
          setRecentQuestions([]);
        }
      })
      .catch(err => {
        console.error("❌ Error fetching recent questions:", err);
        setRecentQuestions([]);
      });
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-navbar">
        <div className="dashboard-logo">Duknow Dashboard</div>
        <button className="dashboard-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className="dashboard-layout">
        <Sidebar isOpen={menuOpen} />
        <main className="dashboard-content">
          <header className="dashboard-header">
            <h2 className="dashboard-title">Dashboard Overview</h2>
            <p className="dashboard-subtitle">Welcome back, Admin</p>
          </header>

          {/* 🔹 Overview Cards */}
          <section className="dashboard-grid-cards">
            <div className="dashboard-card"><h3>Total Questions</h3><p>{questionCount}</p></div>
            <div className="dashboard-card"><h3>Total Users</h3><p>{userCount}</p></div>
            <div className="dashboard-card"><h3>System Status</h3><p>🟢 Active</p></div>
            <div className="dashboard-card"><h3>Support</h3><p>support@duknow.in</p></div>
          </section>

          {/* 🔹 Pie Chart */}
          <section className="dashboard-charts">
            <div className="dashboard-chart">
              <h3>Category-wise Question Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryStats.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 🔹 Recent Questions Table */}
          <section className="dashboard-full-panel">
            <h3>Recent Questions</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {recentQuestions.map((q, i) => (
                  <tr key={i}>
                    <td>{q.question}</td>
                    <td>{q.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

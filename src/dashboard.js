import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/header";

import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Dashboard metrics (individual variables)
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [emailUsers, setEmailUsers] = useState(0);
  const [normalUsers, setNormalUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [normalUserList, setNormalUserList] = useState([]);
  const [emailUserList, setEmailUserList] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("");


  const [categoryStats, setCategoryStats] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);

  const [mergedChartData, setMergedChartData] = useState([]);
  const [emailUserSummary, setEmailUserSummary] = useState({ total: 0, avgPerDay: 0 });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#8dd1e1"];

  useEffect(() => {
    // Fetch total question count
    fetch("/api/randomquestions/count")
      .then(res => res.json())
      .then(data => setTotalQuestions(data.totalQuestions || 0))
      .catch(console.error);

    // // Email users count
    // fetch("/api/emailusersearch/user/count")
    //   .then(res => res.json())
    //   .then(data => setEmailUsers(data.count || 0))
    //   .catch(console.error);


    fetch("/api/usersearch/users")
  .then(res => res.json())
  .then(data => {
    setNormalUsers(data.count || 0);
    setNormalUserList(data.users || []);
  })
  .catch(console.error);

fetch("/api/usersearch/email/users")
  .then(res => res.json())
  .then(data => {
    setEmailUsers(data.count || 0);
    setEmailUserList(data.users || []);
  })
  .catch(console.error);


    // Normal users count
    fetch("/api/usersearch/users")
      .then(res => res.json())
      .then(data => setNormalUsers(data.count || 0))
      .catch(console.error);

    // Category-wise question stats
    fetch("/api/randomquestions/count/category")
      .then(res => res.json())
      .then(data => {
        const transformed = Object.entries(data).map(([category, count]) => ({
          category,
          count
        }));
        setCategoryStats(transformed);
      })
      .catch(console.error);

    // Recent questions (last 10)
    fetch("/api/randomquestions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentQuestions(data.slice(-10).reverse());
        } else {
          setRecentQuestions([]);
        }
      })
      .catch(() => setRecentQuestions([]));

    // Chart data and email user summary
    const getUserChartData = async () => {
      try {
        const [normalRes, emailRes] = await Promise.all([
          fetch("/api/usersearch/users"),
          fetch("/api/usersearch/email/users")
        ]);
        const normalData = await normalRes.json();
        const emailData = await emailRes.json();

        const normalizeData = (users = []) => {
          const dateMap = {};
          users.forEach(user => {
            const date = new Date(user.createdAt).toISOString().split("T")[0];
            dateMap[date] = (dateMap[date] || 0) + 1;
          });
          return dateMap;
        };

        const normalMap = normalizeData(normalData.users || []);
        const emailMap = normalizeData(emailData.users || []);

        const allDates = new Set([...Object.keys(normalMap), ...Object.keys(emailMap)]);

        const merged = Array.from(allDates)
          .sort((a, b) => new Date(a) - new Date(b))
          .map(date => ({
            date,
            normal: normalMap[date] || 0,
            email: emailMap[date] || 0
          }));

        setMergedChartData(merged);

        // Email user summary
        const total = Object.values(emailMap).reduce((a, b) => a + b, 0);
        const dates = Object.keys(emailMap).sort();
        if (dates.length) {
          const diffDays = (new Date(dates[dates.length - 1]) - new Date(dates[0])) / (1000 * 60 * 60 * 24) + 1;
          setEmailUserSummary({
            total,
            avgPerDay: (total / diffDays).toFixed(2)
          });
        }
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    getUserChartData();
  }, []);

  // Total users calculated from normal + email
  useEffect(() => {
    setTotalUsers(normalUsers + emailUsers);
  }, [normalUsers, emailUsers]);

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <Sidebar isOpen={menuOpen} />
        <main className="dashboard-content">
          <header>
            <p>Welcome back, Admin</p>
          </header>

          {/* Metric Cards */}
          <section className="dashboard-grid-cards">
            <div
              className="dashboard-card"
             onClick={() => {
              navigate("/users", {
                state: {
                  userType: "normal",
                  userList: normalUserList
                }
              });
            }}
            >
              <h3>Normal Users</h3>
              <p>{normalUsers}</p>
            </div>

            <div
              className="dashboard-card"
              onClick={() => {
                navigate("/emailusers", {
                  state: {
                    userType: "emailuser",
                    userList: emailUserList, // this is the correct array
                  }
                });
              }}
            >
              <h3>Email Users</h3>
              <p>{emailUserSummary.total}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Questions</h3>
              <p>{totalQuestions}</p>
            </div>
            <div className="dashboard-card">
              <h3>System Status</h3>
              <p>🟢 Active</p>
            </div>
          </section>

          {/* Charts */}
          <section className="dashboard-charts">
            <div className="dashboard-chart">
              <h3>User Registrations Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mergedChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="normal" stroke="#8884d8" name="Normal Users" />
                  <Line type="monotone" dataKey="email" stroke="#ff8042" name="Email Users" />
                </LineChart>
              </ResponsiveContainer>
              <div className="user-summary">
                <p><strong>Email Users Total:</strong> {emailUserSummary.total}</p>
                <p><strong>Average per Day:</strong> {emailUserSummary.avgPerDay}</p>
              </div>
            </div>

            {/* Pie Chart */}
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
              <ul className="category-list">
                {categoryStats.map((cat, idx) => (
                  <li key={idx} style={{ color: COLORS[idx % COLORS.length] }}>
                    {cat.category}: {cat.count}
                  </li>
                ))}
              </ul>
            </div>
          </section>


          {showUserModal && (
            <div className="user-modal-overlay" onClick={() => setShowUserModal(false)}>
              <div className="user-modal" onClick={e => e.stopPropagation()}>
                <h2>{selectedUserType === "normal" ? "Normal Users" : "Email Users"}</h2>
                <button className="close-btn" onClick={() => setShowUserModal(false)}>✕</button>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedUserType === "normal" ? normalUserList : emailUserList).map((user, i) => (
                      <tr key={i}>
                        <td>{user.name || "—"}</td>
                        <td>{user.email || "—"}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* Recent Questions Table */}
          <section className="dashboard-full-panel">
            <h3>Recent Questions</h3>
            <table className="dashboard-table">
              <thead>
                <tr><th>Question</th><th>Category</th></tr>
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

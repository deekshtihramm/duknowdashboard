import React, { useState } from "react";
import Sidebar from "./components/Sidebar.js"; // adjust path if needed
import "./Dashboard.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

          <section className="dashboard-grid-cards">
            <div className="dashboard-card"><h3>Sales</h3><p>$89,300</p></div>
            <div className="dashboard-card"><h3>Visitors</h3><p>21,000</p></div>
            <div className="dashboard-card"><h3>Conversions</h3><p>3.2%</p></div>
            <div className="dashboard-card"><h3>New Customers</h3><p>312</p></div>
          </section>

          <section className="dashboard-data-row">
            <div className="dashboard-panel">
              <h3>Weekly Summary</h3>
              <ul>
                <li>Campaign performance up 10%</li>
                <li>More users active on mobile</li>
                <li>Page speed improved by 0.6s</li>
              </ul>
            </div>
            <div className="dashboard-panel">
              <h3>System Health</h3>
              <p>All systems operational</p>
              <p>Uptime: 99.99%</p>
              <p>Latency: 85ms</p>
            </div>
          </section>

          <section className="dashboard-full-panel">
            <h3>Latest Transactions</h3>
            <ul>
              <li>#TX1045 - Success</li>
              <li>#TX1046 - Failed</li>
              <li>#TX1047 - Pending</li>
              <li>#TX1048 - Success</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

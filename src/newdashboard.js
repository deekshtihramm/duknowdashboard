import React, { useEffect, useState } from "react";
import NewHeader from "./newdashboardcomponents/newHeader.js";
import NewSidebar from "./newdashboardcomponents/newSidebar.js";
import "./newdashboard.css";
import UserSignupChart from "./UserSignupChart.js";


const NewDashboard = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const storedData = JSON.parse(localStorage.getItem("totalUsers"));

    useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/user/count");
        const data = await response.json();
        localStorage.setItem("totalUsers", JSON.stringify(data));
        setLoading(false);
        setTotalUsers(data.totalUsers || 0); // Adjust based on API response
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }
    fetchUserCount();
  }, []);

  
  const cardStyle = {
    width: "200px",
    padding: "10px",
    margin: "10px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  };

  const numberStyle = {
    fontSize: "36px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0",
  };

    return (
        <div className="new-dashboard-container">
            <NewHeader />
            <div className="new-dashboard-content">
                <NewSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)}/>
                <main className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}>
                    <section className="dashboard-overview">
                        <h2>Overview</h2>
                        <div className="metrics-grid">
  <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/users'}>
      <div style={titleStyle}>Total Users</div>
      <div style={numberStyle}>
        {loading ? "Loading..." : (storedData.totalUsers !== null ? storedData.totalUsers : "N/A")}
      </div>
    </div>
 <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/active-users'}>
      <div style={titleStyle}>Active Users</div>
      <div style={numberStyle}>
        {totalUsers !== null ? "-" : "Loading..."}
      </div>
    </div>                 
 <div style={cardStyle}>
      <div style={titleStyle}>Active Users</div>
      <div style={numberStyle}>
        {totalUsers !== null ? "-" : "Loading..."}
      </div>
    </div>  
 <div style={cardStyle}>
      <div style={titleStyle}>Active Users</div>
      <div style={numberStyle}>
        {totalUsers !== null ? "-" : "Loading..."}
      </div>
    </div>  
     <div style={cardStyle}>
      <div style={titleStyle}>Active Users</div>
      <div style={numberStyle}>
        {totalUsers !== null ? "-" : "Loading..."}
      </div>
    </div>  
                            </div>
                    </section>
                    <section className="dashboard-user-stats">
        <h2>User Signup Chart</h2>
        <UserSignupChart />
      </section>

                    <section className="dashboard-recent">
                        <h2>Recent Activity</h2>
                        <ul>
                            <li>New Question Added - "Photosynthesis" (English)</li>
                            <li>Mock Test Uploaded - UPSC Prelims</li>
                            <li>User Registered - John Doe</li>
                        </ul>
                    </section>

                    <section className="dashboard-analytics">
                        <h2>Analytics</h2>
                        <div className="chart-placeholder">[User Growth Chart]</div>
                        <div className="chart-placeholder">[Questions by Category]</div>
                    </section>

                    <section className="dashboard-controls">
                        <h2>Quick Actions</h2>
                        <button>Add Question</button>
                        <button>Add Mock Test</button>
                        <button>Manage Users</button>
                    </section>

                    {children}
                </main>
            </div>
        </div>
    );
};
export default NewDashboard;

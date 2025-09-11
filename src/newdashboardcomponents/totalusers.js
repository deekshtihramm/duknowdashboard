import React, { useEffect, useState } from "react";
import NewHeader from "./newHeader.js";
import NewSidebar from "./newSidebar.js";
import "./Totalusers.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";



const Totalusers = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedData = JSON.parse(sessionStorage.getItem("userCount"));
  const navigate = useNavigate();


  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch all user details
      const usersResponse = await fetch(`${BASE_URL}/api/normaluser/all`);
      const usersData = await usersResponse.json();
      console.log("Fetched users data:", usersData);

      // Sort users by createdAt descending (latest first)
      const sortedUsers = usersData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/dashboard/user/count`);
        const data = await res.json();

        // Store in sessionStorage
        sessionStorage.setItem("userCount", JSON.stringify(data));

        // Update state
        setUserStats(data);
      } catch (err) {
        console.error("Failed to fetch user count:", err);
      }
    };

    // Check if already stored in sessionStorage
    const storedData = sessionStorage.getItem("userCount");
    if (storedData) {
      setUserStats(JSON.parse(storedData));
    } else {
      fetchUserCount();
    }
  }, []);

  return (
    <div className="total-users-page">
      <NewHeader />
      <div className="total-users-content" style={{ display: "flex" }}>
        <NewSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main
          className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
          style={{ flex: 1, padding: "20px" }}
        >
          {/* Summary Cards */}
          <section className="dashboard-user-stats">
            <h2>User Summary</h2>
            {storedData ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div className="stat-card">Total Users: {storedData.totalUsers}</div>
                <div className="stat-card">Last 1 Hour: {storedData.usersLast1Hour}</div>
                <div className="stat-card">Last 24 Hours: {storedData.usersLast24Hours}</div>
                <div className="stat-card">Last 7 Days: {storedData.usersLast7Days}</div>
                <div className="stat-card">Last 30 Days: {storedData.usersLast30Days}</div>
              </div>
            ) : (
              <p>Loading summary...</p>
            )}
          </section>

          {/* Full Users Table */}
          <section className="dashboard-total-users" style={{ marginTop: "40px" }}>
            <h2>All Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Selected Language</th>
                      <th>Selected Topic</th>
                      <th>Account Active</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                    <tr key={user.id} onClick={() => navigate(`/newdashboard/userdetails/${user.id}`)}>
                        <td>{users.indexOf(user) + 1}</td>
                        <td>{user.id}</td>
                        <td>{user.userId}</td>
                        <td>{user.selectedLanguage}</td>
                        <td>{user.selectedtopic}</td>
                        <td>{user.accountactive ? "Yes" : "No"}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>{new Date(user.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Totalusers;

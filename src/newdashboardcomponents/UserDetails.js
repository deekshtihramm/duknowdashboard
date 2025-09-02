import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/normaluser/${id}`);
        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main
          className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
          style={{ flex: 1, padding: "20px" }}
        >
          <h2>User Details</h2>
          {loading ? (
            <p>Loading user details...</p>
          ) : !user ? (
            <p>User not found.</p>
          ) : (
            <div className="user-details-table-container">
              <table className="user-details-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>ID</td><td>{user.id}</td></tr>
                  <tr><td>User ID</td><td>{user.userId}</td></tr>
                  <tr><td>Logined Email</td><td>{user.loginedemail}</td></tr>
                  <tr><td>Selected Language</td><td>{user.selectedLanguage}</td></tr>
                  <tr><td>Selected Topic</td><td>{user.selectedtopic}</td></tr>
                  <tr><td>Account Active</td><td>{user.accountactive ? "Yes" : "No"}</td></tr>
                  <tr>
                    <td>Created At</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Updated At</td>
                    <td>{new Date(user.updatedAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Last Opened At</td>
                    <td>
                      {user.lastOpenedAt
                        ? new Date(user.lastOpenedAt._seconds * 1000).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td>Token</td>
                    <td>{user.token}</td>
                  </tr>
                  <tr>
                    <td>Page Names</td>
                    <td>
                      {Array.isArray(user.pageNames)
                        ? user.pageNames.join(", ")
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDetails;

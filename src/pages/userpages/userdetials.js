// src/pages/UserDetailsPage/UserDetailsPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserDetailsPage.css";
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";

const UserDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) return <div>User data not available</div>;

  return (
    <div className="user-details-page">
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ width: "100%", color: "#fff", padding: "1rem" }}>
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <h2>User "{user.name}" Details</h2>
          <table className="user-details-table">
            <tbody>
              {Object.entries(user).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ fontWeight: "bold" }}>{key}</td>
                  <td>{Array.isArray(value) ? value.join(", ") : String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;

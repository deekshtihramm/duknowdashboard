// UserListPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserListPage.css";
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";


const UserListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType = "normal", userList = [] } = location.state || {};

  return (
    <div className="user-list-page">
      <Header />
      <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{width:"100%" , color:"#fff",padding:"1rem"}}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>{userType === "emailuser" ? "Email Users" : "Normal Users"}</h2>

      {userList.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {[...userList].reverse().map((user, i) => ( 
             <tr key={i} onClick={() => navigate(`/user-detail`, { state: { user } })} style={{ cursor: "pointer" }}>
                <td>{i+1}</td>
                <td>{user.name || "—"}</td>
                <td>{user.email || "—"}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
    </div>
    </div>
  );
};

export default UserListPage;

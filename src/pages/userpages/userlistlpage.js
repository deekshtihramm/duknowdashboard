// UserListPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserListPage.css";
import Header from "../../components/header";
import Sidebar from "../../components/Sidebar";


const UserListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType, userList } = location.state || { userType: "", userList: [] };

  return (
    <div className="user-list-page">
        <Header />
        <div style={{display:"flex", color:"#fff"}}>
        <Sidebar />
        <div style={{width:"100%",padding:"1rem"}}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>{userType === "normal" ? "Normal Users" : "Email Users"}</h2>
      <table className="user-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {userList.map((user, i) => (
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
    </div>
  );
};

export default UserListPage;

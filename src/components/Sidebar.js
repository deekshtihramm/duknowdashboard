import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // optional if styles need to be isolated

const Sidebar = ({ isOpen }) => {
  if (!isOpen && window.innerWidth <= 768) return null;

  return (
    <aside className="dashboard-sidebar">
      <nav className="dashboard-menu">
        <Link className="dashboard-menu-item" to="/dashboard">Overview</Link>
        <Link className="dashboard-menu-item" to="/dataentry">Data Entry</Link>
        <Link className="dashboard-menu-item" to="/sales">Community</Link>
        <Link className="dashboard-menu-item" to="/reports">Reports</Link>
        <Link className="dashboard-menu-item" to="/settings">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

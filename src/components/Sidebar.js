import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { MdOutlineDashboard, MdOutlineEdit, MdOutlineAnalytics, MdOutlineGroups, MdOutlineReport, MdOutlineSettings } from "react-icons/md";

const menuItems = [
  { to: "/dashboard", icon: MdOutlineDashboard, label: "Overview" },
  { to: "/dataentry", icon: MdOutlineEdit, label: "Data Entry" },
  { to: "/analytics", icon: MdOutlineAnalytics, label: "Analytics" },
  { to: "/community", icon: MdOutlineGroups, label: "Community" },
  { to: "/reports", icon: MdOutlineReport, label: "Reports" },
  { to: "/settings", icon: MdOutlineSettings, label: "Settings" },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  if (!isOpen && window.innerWidth <= 768) return null;

  return (
    <aside className="dashboard-sidebar">
      <nav className="dashboard-menu">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            className={`dashboard-menu-item${location.pathname === to ? " active" : ""}`}
            to={to}
          >
            <Icon className="dashboard-menu-icon" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

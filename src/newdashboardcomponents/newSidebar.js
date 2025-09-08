import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link & useLocation
import { FaTachometerAlt, FaFolder, FaCog, FaUsers, FaChartBar,FaKeyboard,  FaSignOutAlt , FaChartLine } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineEdit, MdOutlineAnalytics, MdOutlineGroups, MdOutlineReport, MdOutlineSettings } from "react-icons/md";

const Sidebar = ({isCollapsed,onToggle}) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation(); // Get current URL path

  const menuItems = [
    { name: "Overview", icon: <MdOutlineDashboard />, color: "#4CAF50", path: "/newdashboard/" },
    { name: "Analytics", icon: <FaChartLine />, color: "#E91E63", path: "/newanalytics/" },
    { name: "Data Entry", icon: <FaKeyboard />, color: "#FF9800", path: "/newdataentry/" },
    { name: "Community", icon: <FaUsers />, color: "#9C27B0", path: "/newcommunity/" },
    { name: "Reports", icon: <MdOutlineReport />, color: "#F44336", path: "/newreports/" },
    { name: "Settings", icon: <FaCog />, color: "#03A9F4", path: "/newsettings/" },
    { name: "logout", icon: <  FaSignOutAlt />, color: "#607D8B", path: "/logout" }
  ];

  const sidebarStyle = {
    width: collapsed ? "70px" : "250px",
    height: "100vh",
    background: "#ffffff",
    color: "#000",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s",
    position: "fixed",
    overflow: "hidden",
    boxShadow: "0 7px 10px rgba(0,0,0,0.3)",
    marginTop: "60px"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 10px",
    background: "#f2f2f2",
  };

  const buttonStyle = {
    background: "transparent",
    border: "none",
    color: "#000",
    fontSize: "18px",
    cursor: "pointer",
    transition: "transform 0.3s"
  };

  const menuStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flex: 1,
  };

  const menuItemStyle = {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "background 0.3s, transform 0.2s",
    borderRadius: "8px",
    margin: "5px 10px",
    textDecoration: "none", // for Link
  };

  return (
    <aside className={`new-sidebar ${isCollapsed ? "collapsed" : ""}`}>

    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: "18px", color: "#000" }}>
          {!collapsed && "Menu"}
        </h2>
       <button
            style={buttonStyle}
            onClick={() => {
                setCollapsed(!collapsed);
                onToggle();
            }}
            >
  {collapsed ? <span style={{ fontSize: "30px"}}>≡</span> : "←"}
</button>

      </div>

      <ul style={menuStyle}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <li key={index}>
              <Link
                to={item.path}
                style={{
                  ...menuItemStyle,
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive ? item.color + "22" : "transparent",
                  color: "#000",
                  display: "flex"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = item.color + "33")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    isActive ? item.color + "22" : "transparent")
                }
              >
                <span
                  style={{
                    color: isActive ? item.color : "#000",
                    fontSize: "18px",
                  }}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span
                    style={{
                      color: "#000",
                      fontWeight: isActive ? "600" : "500",
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
    </aside>

  );
};

export default Sidebar;

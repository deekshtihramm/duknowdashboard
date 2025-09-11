import React, { useState, useEffect } from "react";


const Header = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: "#fff",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    position: "fixed",
    zIndex: 1000,
  };

const titleStyle = {
  fontSize: "33px",
  fontWeight: "bold",
  letterSpacing: "2px",
  paddingLeft: "20px",
  fontFamily: "'Pacifico', cursive",
  backgroundImage: "linear-gradient(90deg, #4b6cb7 10%, #48ff00ff 130%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingRight: "20px",
  };

  const searchBarStyle = {
    height: "30px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    fontSize: "14px",
  };

  const iconStyle = {
    fontSize: "18px",
    cursor: "pointer",
  };

  const profileStyle = {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <header style={headerStyle}>
      {/* Left: Logo / Title */}
      <div style={titleStyle}>Duknow Dashboard</div>

      {/* Right: Search Bar / Icon, Notifications, Profile */}
      <div style={rightSectionStyle}>
        {/* Search: Full bar on desktop, icon on mobile */}
        {isMobile ? (
          <span style={iconStyle} title="Search">🔍</span>
        ) : (
          <input type="text" placeholder="Search..." style={searchBarStyle} />
        )}

        {/* Notifications */}
        <span style={iconStyle} title="Notifications">🔔</span>

        {/* Profile */}
        <div style={profileStyle} title="Profile">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;

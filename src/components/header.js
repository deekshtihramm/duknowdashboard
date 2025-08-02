import React, { useState } from 'react';
import './Header.css'; // Optional: For CSS separation


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div className="dashboard-navbar">
      <div className="dashboard-logo">Duknow Dashboard</div>
      <div className="dashboard-search">
        <input
          type="text"
          placeholder="Search anything..."
          style={{
            width: "500px",
            borderRadius: "30px",
            height:"10px",
            border: "1px solid #ccc",
            outline: "none",
            backgroundColor: "#222",
            color: "#fff",
          }}
        />
      </div>
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </div>
  );
};

export default Header;

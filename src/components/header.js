import React, { useState } from 'react';
import './Header.css'; // Optional: For CSS separation
import image from '../images/logoimg.png';


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

const refreshDashboard = () => {
  sessionStorage.clear();
  window.location.reload();
};

  return (
    <div className="dashboard-navbar">
      <div className="dashboard-logo">
        <img className='brand-img' src={image}/>
        Duknow Dashboard</div>
      {/* <div className="dashboard-search">
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
      </div> */}

      <button onClick={refreshDashboard} style={{ marginBottom: "10px" ,borderRadius:"50px"}}>
        🔄 Refresh Dashboard
      </button>

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

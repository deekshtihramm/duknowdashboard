import React from 'react';
import Header from "../components/header.js";
import Sidebar from '../components/Sidebar.js';



const Analytics = () => {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        
      </div>

    </div>


  );
};

export default Analytics;

import React from 'react';
import Header from "../components/header.js";
import Sidebar from '../components/Sidebar.js';



const Community = () => {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        
      </div>

    </div>


  );
};

export default Community;

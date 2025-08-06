import React from 'react';
import Header from "../../components/header.js";
import Sidebar from '../../components/Sidebar.js';



const Users = () => {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        
      </div>

    </div>


  );
};

export default Users;

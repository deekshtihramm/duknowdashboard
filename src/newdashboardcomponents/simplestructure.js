import React, { useEffect, useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";

const UserDetails = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main
          className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
          style={{ flex: 1, padding: "20px" }}
        >
          <h2>Total Uploaded Details</h2>
         
        </main>
      </div>
    </div>
  );
};

export default UserDetails;

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DataEntrySidebar from "../components/DataEntrySidebar";
import "./DataEntry.css";

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("#basic-info");

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-navbar">
        <div className="dashboard-logo">Duknow Dashboard</div>
      </div>

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content dataentry-layout">
          <DataEntrySidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="dataentry-main">
            <h2 className="dashboard-title">Data Entry</h2>


            {activeTab === "#basic-info" && (
              <div className="tab-content">
                <h3>Add Questions</h3>
                <input type="text" placeholder="Enter question..." />
              </div>
            )}

            {activeTab === "#contact" && (
              <div className="tab-content">
                <h3>All Questions</h3>
                <ul>
                  <li>Question 1</li>
                  <li>Question 2</li>
                  <li>Question 3</li>
                </ul>
              </div>
            )}

            {activeTab === "#notes" && (
              <div className="tab-content">
                <h3>Create Page</h3>
                <input type="text" placeholder="Page name" />
              </div>
            )}

            {activeTab === "#submit" && (
              <div className="tab-content">
                <h3>Submit</h3>
                <button>Submit All Data</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataEntry;

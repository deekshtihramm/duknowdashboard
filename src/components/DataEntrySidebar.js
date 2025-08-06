import React from "react";
import "./DataEntrySidebar.css";

const DataEntrySidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="dataentry-topbar">
      <button
        className={`dataentry-toplink ${activeTab === "#basic-info" ? "active" : ""}`}
        onClick={() => setActiveTab("#basic-info")}
      >
        Add Questions
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#notes" ? "active" : ""}`}
        onClick={() => setActiveTab("#notes")}
      >
        Create Question
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#submit" ? "active" : ""}`}
        onClick={() => setActiveTab("#submit")}
      >
        Post Question
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#contact" ? "active" : ""}`}
        onClick={() => setActiveTab("#contact")}
      >
        Fact Questions
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#mocktest" ? "active" : ""}`}
        onClick={() => setActiveTab("#mocktest")}
      >
        MockTest Questions
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#allQuestions" ? "active" : ""}`}
        onClick={() => setActiveTab("#allQuestions")}
      >
        All Questions
      </button>
      <button
        className={`dataentry-toplink ${activeTab === "#modifyQuestions" ? "active" : ""}`}
        onClick={() => setActiveTab("#modifyQuestions")}
      >
        Modify Questions
      </button>
    </div>
  );
};

export default DataEntrySidebar;

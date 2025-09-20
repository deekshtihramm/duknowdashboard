import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";

const QuestionDetail = () => {
  const location = useLocation();
  const mongoData = location.state?.mongoData;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  if (!mongoData)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Page not found</p>
    );

  const fieldStyle = {
    padding: "10px 12px",
    border: "1px solid #eee",
    verticalAlign: "top",
  };
  const labelStyle = {
    fontWeight: "600",
    width: "180px",
    background: "#f7f7f7",
  };

  const mainInfoPairs = [
    ["Category", mongoData.category],
    ["Page Number", mongoData.pageNumber],
    ["Place", mongoData.place],
    ["Level", mongoData.level],
    ["Update Status", mongoData.update],
    ["Created At", new Date(mongoData.createdAt).toLocaleString()],
    ["Updated At", new Date(mongoData.updatedAt).toLocaleString()],
    ["Title (Hindi)", mongoData.titleHindi],
    ["Title (Telugu)", mongoData.titleTelugu],
  ];

  const longInfoPairs = [
    ["Matter", mongoData.matter],
    ["Long Matter", mongoData.longmatter],
    ["Matter (Hindi)", mongoData.matterHindi],
    ["Long Matter (Hindi)", mongoData.longmatterHindi],
    ["Matter (Telugu)", mongoData.matterTelugu],
    ["Long Matter (Telugu)", mongoData.longmatterTelugu],
    [
      "Comments",
      mongoData.comments?.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: "18px" }}>
          {mongoData.comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      ) : (
        "No comments"
      ),
    ],
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleAIChange = (fieldName, value) => {
    alert(`AI Change clicked for ${fieldName}: ${value}`);
    // 🚀 Here you can integrate your AI API call (Gemini/OpenAI) and update state accordingly
  };

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
          style={{
            flex: 1,
            padding: "20px",
            background: "#f9f9f9",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              maxWidth: "100%",
              margin: "0 auto",
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              {mongoData.title}
            </h1>

            {mongoData.imageUrl && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={mongoData.imageUrl}
                  alt={mongoData.title}
                  style={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            )}

            {!isEditing ? (
              <button
                onClick={handleEdit}
                style={{
                  display: "block",
                  margin: "0 auto 20px",
                  padding: "10px 150px",
                  background: "#a8be005f",
                  color: "#000000ff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Edit Question
              </button>
            ) : (
              <button
                onClick={handleCancel}
                style={{
                  display: "block",
                  margin: "0 auto 20px",
                  padding: "10px 150px",
                  background: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Cancel Editing
              </button>
            )}

            {/* Main Info Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "30px",
              }}
            >
              <tbody>
                {mainInfoPairs.reduce((rows, pair, index) => {
                  if (index % 2 === 0) {
                    const nextPair = mainInfoPairs[index + 1] || ["", ""];
                    rows.push(
                      <tr key={index}>
                        <td style={labelStyle}>{pair[0]}</td>
                        <td style={fieldStyle}>
                          {pair[1]}
                          {isEditing && pair[0] && (
                            <button
                              style={{
                                marginLeft: "10px",
                                padding: "4px 8px",
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              onClick={() => handleAIChange(pair[0], pair[1])}
                            >
                              AI Change
                            </button>
                          )}
                        </td>
                        <td style={labelStyle}>{nextPair[0]}</td>
                        <td style={fieldStyle}>
                          {nextPair[1]}
                          {isEditing && nextPair[0] && (
                            <button
                              style={{
                                marginLeft: "10px",
                                padding: "4px 8px",
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              onClick={() =>
                                handleAIChange(nextPair[0], nextPair[1])
                              }
                            >
                              AI Change
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                }, [])}
              </tbody>
            </table>

            {/* Long Matters / Comments Table */}
            <h3 style={{ marginBottom: "10px", color: "#333" }}>
              Detailed Matters & Comments
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {longInfoPairs.map((pair, idx) => (
                  <tr key={idx}>
                    <td style={{ ...labelStyle, width: "200px" }}>{pair[0]}</td>
                    <td style={fieldStyle}>
                      {pair[1]}
                      {isEditing && (
                        <button
                          style={{
                            marginLeft: "10px",
                            padding: "4px 8px",
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                          onClick={() => handleAIChange(pair[0], pair[1])}
                        >
                          AI Change
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuestionDetail;

import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";

const QuestionDetail = () => {
  const location = useLocation();
  const mongoData = location.state?.mongoData;
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!mongoData) return <p style={{ textAlign: "center", marginTop: "50px" }}>Page not found</p>;

  const fieldStyle = { padding: "10px 12px", border: "1px solid #eee", verticalAlign: "top" };
  const labelStyle = { fontWeight: "600", width: "180px", background: "#f7f7f7" };

  const infoPairs = [
    ["Category", mongoData.category],
    ["Page Number", mongoData.pageNumber],
    ["Place", mongoData.place],
    ["Level", mongoData.level],
    ["Update Status", mongoData.update],
    ["Created At", new Date(mongoData.createdAt).toLocaleString()],
    ["Updated At", new Date(mongoData.updatedAt).toLocaleString()],
    ["Title (Hindi)", mongoData.titleHindi],
    ["Title (Telugu)", mongoData.titleTelugu],
    ["Matter", mongoData.matter],
    ["Long Matter", mongoData.longmatter],
    ["Matter (Hindi)", mongoData.matterHindi],
    ["Long Matter (Hindi)", mongoData.longmatterHindi],
    ["Matter (Telugu)", mongoData.matterTelugu],
    ["Long Matter (Telugu)", mongoData.longmatterTelugu],
    ["Comments", mongoData.comments?.length > 0 ? (
      <ul style={{ margin: 0, paddingLeft: "18px" }}>
        {mongoData.comments.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    ) : "No comments"]
  ];

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
          style={{ flex: 1, padding: "20px", background: "#f9f9f9", minHeight: "100vh" }}
        >
          <div style={{ maxWidth: "100%", margin: "0 auto", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{mongoData.title}</h1>

            {mongoData.imageUrl && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={mongoData.imageUrl}
                  alt={mongoData.title}
                  style={{ maxWidth: "100%", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                />
              </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {infoPairs.reduce((rows, pair, index) => {
                  // Every two items go in one row for two-column layout
                  if (index % 2 === 0) {
                    const nextPair = infoPairs[index + 1] || ["", ""];
                    rows.push(
                      <tr key={index}>
                        <td style={labelStyle}>{pair[0]}</td>
                        <td style={fieldStyle}>{pair[1]}</td>
                        <td style={labelStyle}>{nextPair[0]}</td>
                        <td style={fieldStyle}>{nextPair[1]}</td>
                      </tr>
                    );
                  }
                  return rows;
                }, [])}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuestionDetail;

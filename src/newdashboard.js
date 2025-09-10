import React, { useEffect, useState } from "react";
import NewHeader from "./newdashboardcomponents/newHeader.js";
import NewSidebar from "./newdashboardcomponents/newSidebar.js";
import "./newdashboard.css";
import UserSignupChart from "./UserSignupChart.js";


const NewDashboard = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recentQuestions, setRecentQuestions] = useState([]);
    const BASE_URL = "https://web.backend.duknow.in"; // ✅ Your backend base URL

    const getSessionOrFetch = async (key, url, setter) => {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setter(JSON.parse(cached));
      } else {
        const res = await fetch(url);
        const data = await res.json();
        sessionStorage.setItem(key, JSON.stringify(data));
        setter(data);
      }
    };


   useEffect(() => {
  async function fetchUserCount() {
    try {
      const response = await fetch("http://localhost:8000/api/normaluser/alluserscount");
      const data = await response.json();
      const count = data?.usercount || 0;
      sessionStorage.setItem("totalUsers", JSON.stringify(count));
      setTotalUsers(count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user count:", error);
      setLoading(false);
    }
  }
  fetchUserCount();
}, []);

  // Fetch total unposted questions from API and set state
  const [totalunPostedQuestions, setTotalunPostedQuestions] = useState(0);

  useEffect(() => {
    async function fetchPostedunQuestionsCount() {
      try {
        const response = await fetch("http://localhost:8000/api/demo/allunpostedquestionscount");
        const data = await response.json();
        // Sum all category counts to get total unposted questions
        const total =
          data
            ? Object.values(data).reduce((sum, val) => sum + Number(val), 0)
            : 0;
        setTotalunPostedQuestions(total);
      } catch (error) {
        console.error("Error fetching unposted questions count:", error);
      }
    }
    fetchPostedunQuestionsCount();
  }, []);
  
  // Fetch total posted questions from API and set state
  const [totalPostedQuestions, setTotalPostedQuestions] = useState(0);
  useEffect(() => {
    async function fetchPostedQuestionsCount() {
      try {
        const response = await fetch("http://localhost:8000/api/realpages/count/getallcount");
        const data = await response.json();
        // Sum all category counts to get total posted questions
        const total =
          data
            ? Object.values(data).reduce((sum, val) => sum + Number(val), 0)
            : 0;
        setTotalPostedQuestions(total);
      } catch (error) {
        console.error("Error fetching posted questions count:", error);
      }
    }
    fetchPostedQuestionsCount();
  }, []);
  const cardStyle = {
    width: "200px",
    padding: "10px",
    margin: "10px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: "#555",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  };

  const numberStyle = {
    fontSize: "36px",
    fontWeight: "600",
    color: "#2c3e50",
    margin: "0",
  };

  useEffect(() => {
   // ✅ Recent questions
    getSessionOrFetch("recentQuestions", `${BASE_URL}/api/randomquestions`, (data) => {
      if (Array.isArray(data)) {
        setRecentQuestions(data.slice(-10).reverse());
      } else {
        setRecentQuestions([]);
      }
    });
  }, []);


    return (
        <div className="new-dashboard-container">
            <NewHeader />
            <div className="new-dashboard-content">
                <NewSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)}/>
                <main className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}>
                    <section className="dashboard-overview">
                        <h2>Overview</h2>
                        <div className="metrics-grid">
                           <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/users'}>
                                <div style={titleStyle}>Total Users</div>
                                <div style={numberStyle}>
                                  {loading ? "..." : totalUsers}
                                </div>
                              </div>

                          <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/active-users'}>
                                <div style={titleStyle}>Active Users</div>
                                <div style={numberStyle}>
                                  {totalUsers !== null ? "-" : "Loading..."}
                                </div>
                              </div>                 
                          <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/total-questions'}>
                                <div style={titleStyle}>Total posted Questions</div>
                                <div style={numberStyle}>
                                  {totalPostedQuestions !== null ? totalPostedQuestions : "Loading..."}
                                </div>
                              </div>  
                          <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/total-u-questions'}>
                                <div style={titleStyle}>Total unposted Questions</div>
                                <div style={numberStyle}>
                                  {totalunPostedQuestions !== null ? totalunPostedQuestions : "Loading..."}
                                </div>
                              </div>  
                              <div style={cardStyle} onClick={() => window.location.href = '/newdashboard/active-users'}>
                                <div style={titleStyle}>Active Users</div>
                                <div style={numberStyle}>
                                  {totalUsers !== null ? "-" : "Loading..."}
                                </div>
                              </div>  
                            </div>
                    </section>
                    <section className="dashboard-user-stat">
                      <div style={{marginLeft: "20px", height: "45%", width: "50%", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <UserSignupChart />
                      </div>
                       <div
                        style={{
                          marginLeft: "20px",
                          height: "45%",
                          width: "50%",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          padding: "15px",
                          overflowY: "auto",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          <thead>
                            <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
                              <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Question</th>
                              <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentQuestions.map((q, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}>
                                <td style={{ padding: "8px", color: "#333" }}>{q.question}</td>
                                <td style={{ padding: "8px", color: "#555" }}>{q.category}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>


                    {/* <section className="dashboard-analytics">
                        <h2>Analytics</h2>
                        <div className="chart-placeholder">[User Growth Chart]</div>
                        <div className="chart-placeholder">[Questions by Category]</div>
                    </section>

                    <section className="dashboard-recent">
                        <h2>Recent Activity</h2>
                        <ul>
                            <li>New Question Added - "Photosynthesis" (English)</li>
                            <li>Mock Test Uploaded - UPSC Prelims</li>
                            <li>User Registered - John Doe</li>
                        </ul>
                    </section> */}

                    {/* Recent Questions Table */}

                   

                    {children}
                </main>
            </div>
        </div>
    );
};

export default NewDashboard;

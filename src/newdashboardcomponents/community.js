import React, { useEffect, useState } from "react";
import axios from "axios";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:4000/api/dashboard";

const UserDetails = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [userRole, setUserRole] = useState("member");
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

const [employee, setEmployee] = useState(null);
  const userProfileEmail = sessionStorage.getItem("duknowEmail"); // stored email

  useEffect(() => {
    if (userProfileEmail) {
      fetchEmployee(userProfileEmail);
    }
  }, [userProfileEmail]);

  const fetchEmployee = async (email) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/dashboard/employee/${email}`);
      setEmployee(res.data.employee);
      console.log("Employee Details:", res.data.employee);
      setUserRole(res.data.employee.role); // Set user role from fetched data
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
    }
  };


  // useEffect(() => {
  //   fetchEmployees();
  // }, []);

  // const fetchEmployees = async () => {
  //   try {
  //     const res = await axios.get(API);
  //     console.log(res.data);
  //     setEmployees(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {
  try {
    const res = await axios.get(API);
    if (res.data && res.data.length > 0) {
      console.log(res.data);
      setEmployees(res.data);
      setSelectedEmployee(res.data[0]); // default first employee
    }
  } catch (err) {
    console.error(err);
  }
};

  if (!employee) return <p>Loading...</p>;

return (
  <div className="user-details" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <NewHeader />
    <div style={{ display: "flex", flex: 1, minHeight: "100vh" }}>
      <NewSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      <main
        className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
        style={{ flex: 1, padding: "20px", background: "#ffffffff", minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header: Title + Admin Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#111827" }}>Team Members Dashboard</h2>
          {userRole === "admin" && (
            <button
              onClick={() => navigate("/employee-management")}
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Manage Members
            </button>
          )}
        </div>

      <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 100px)" }}>
  {/* Left: Current Employee (Fixed) */}
  <div style={{
    flex: "0 0 320px",
    minWidth: "35vw",
    position: "sticky", // keeps it fixed while scrolling right panel
    top: "90px",        // distance from top
    alignSelf: "flex-start",
    maxHeight: "calc(100vh - 40px)",
    overflowY: "auto",  // scroll if left panel content is tall
  }}>
    <div style={{
      background: "linear-gradient(135deg, #fef3c7, #fef1c0)",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      gap: "16px",
    }}>
      {/* Profile Avatar + Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "#ebc725af",
          color: "#fff",
          fontSize: "36px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {employee.photo
            ? <img src={employee.photo} alt={employee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (employee.name || "U").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
          }
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h2 style={{ margin: 0, color: "#111827" }}>{employee.name}</h2>
          <p style={{ margin: 0, fontWeight: 500, color: "#1e293b" }}><strong>Email:</strong> {employee.email}</p>
          <p style={{ margin: 0, fontWeight: 500, color: "#1e293b" }}><strong>Role:</strong> {employee.role}</p>
          <p style={{ margin: 0, fontWeight: 500, color: "#1e293b" }}><strong>Department:</strong> {employee.department}</p>
          <p style={{ margin: 0, fontWeight: 500, color: "#1e293b" }}><strong>Phone:</strong> {employee.phone}</p>
        </div>
      </div>

      {/* Performance */}
      <h3 style={{ marginTop: "16px", marginBottom: "12px", color: "#111827" }}>Performance:</h3>
      {employee.performance && employee.performance.length > 0 ? (
        employee.performance.map((p, idx) => (
          <div key={idx} style={{
            marginBottom: "12px",
            padding: "12px",
            background: "#e0f2fe",
            borderRadius: "12px",
            width: "100%",
            textAlign: "left",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <p style={{ margin: "2px 0", fontWeight: 600 }}>Date: {new Date(p.date).toLocaleDateString()}</p>
            <p style={{ margin: "2px 0", fontWeight: 500 }}>Total Pages: {p.pagesEntered}</p>
            <ul style={{ margin: "4px 0 0 16px", padding: 0, listStyleType: "disc" }}>
              {p.categories.map((c, cidx) => (
                <li key={cidx} style={{ marginBottom: "2px", fontWeight: 500 }}>
                  {c.categoryName}: {c.pages} pages
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p style={{ fontWeight: 500, color: "#475569" }}>No performance data yet.</p>
      )}
    </div>
  </div>

{/* Right: Other Employees Grid */}
<div style={{
  flex: 1,
  maxHeight: "100%",
  overflowY: "auto", // scroll independently
  paddingRight: "8px"
}}>
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  }}>
    {employees
      .filter(e => e._id !== employee._id)
      .sort((a, b) => {
        // Sort by total pages entered (descending)
        const aPages = a.performance?.reduce((sum, p) => sum + p.pagesEntered, 0) || 0;
        const bPages = b.performance?.reduce((sum, p) => sum + p.pagesEntered, 0) || 0;
        return bPages - aPages;
      })
      .map((emp) => (
        <div key={emp._id} style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "220px",
          overflow: "scroll",
          scrollbarWidth: "none",

        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
        }}
        >
          {/* Employee Info */}
          <div>
            <div style={{ fontWeight: "600", marginBottom: "6px", color: "#111827" }}>{emp.name}</div>
            <div style={{ marginBottom: "4px", fontSize: "14px", color: "#374151" }}>Role: {emp.role}</div>
            <div style={{ marginBottom: "4px", fontSize: "14px", color: "#374151" }}>Dept: {emp.department}</div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
              <div>Email: {emp.email}</div>
              <div>Phone: {emp.phone}</div>
            </div>
          </div>

          {/* Performance Summary */}
          <div style={{ marginTop: "8px", fontSize: "13px", color: "#374151" }}>
            {emp.performance?.map((p, idx) => (
              <div key={idx} style={{ marginBottom: "4px" }}>
                <div>Date: {new Date(p.date).toLocaleDateString()}</div>
                <div>Pages: {p.pagesEntered}</div>
              </div>
            ))}
          </div>
        </div>
      ))
    }
  </div>
</div>

</div>


      </main>
    </div>
  </div>
);

};

export default UserDetails;

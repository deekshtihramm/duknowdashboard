import React, { useState, useEffect } from "react";
import axios from "axios";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";

const API = "http://localhost:4000/api/dashboard"; // your backend

const EmployeeDetails = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API);
      setEmployees(res.data);
      if (res.data.length > 0) setSelectedEmployee(res.data[0]);
    } catch (err) {
      console.error(err);
    }
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
          style={{ flex: 1, padding: "20px" }}
        >
          <EmployeeDirectory
            employees={employees}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetails;

function EmployeeDirectory({ employees, selectedEmployee, setSelectedEmployee }) {
  const [query, setQuery] = useState("");

  const filtered = employees.filter(e => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (e.name || "").toLowerCase().includes(q) ||
      (e.email || "").toLowerCase().includes(q) ||
      (e.department || "").toLowerCase().includes(q) ||
      (e.role || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (s) => s ? new Date(s).toLocaleDateString() : "-";

  return (
    <div style={{ maxWidth: "100vw", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>Employee Directory</h2>
        <input
          type="text"
          placeholder="Search by name, email or dept..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            fontSize: 14,
            marginTop: 24,
            maxHeight: 36,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            outline: "none",
            minWidth: 320
          }}
        />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16
      }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 24, color: "#6b7280" }}>
            <h4>No employees found</h4>
          </div>
        ) : (
          filtered.map(emp => (
            <EmployeeCard
              key={emp._id}
              emp={emp}
              isSelected={selectedEmployee?._id === emp._id}
              onSelect={() => setSelectedEmployee(emp)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}


function EmployeeCard({ emp, isSelected, onSelect, formatDate }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        borderRadius: 12,
        border: `2px solid ${isSelected ? "#3b82f6" : "#e6e9ee"}`,
        background: "#fff",
        boxShadow: hover ? "0 12px 30px rgba(15,23,42,0.06)" : "0 6px 18px rgba(15,23,42,0.03)",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: "#374151",
          marginRight: 12
        }}>
          {emp.name?.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()}
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{emp.name}</h4>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{emp.role}</p>
        </div>
      </div>

      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Email:</strong> {emp.email}</p>
      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Phone:</strong> {emp.phone}</p>
      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Department:</strong> {emp.department}</p>
      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Joined:</strong> {formatDate(emp.createdAt)}</p>
      <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Performance:</strong> {emp.performance?.length || 0} entries</p>
    </div>
  );
}

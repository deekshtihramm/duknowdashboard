import React, { useState, useEffect } from "react";
import axios from "axios";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./EmployeeManagement.css";

const API = "https://web.backend.duknow.in/api/dashboard";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", role: "", department: "", email: "", phone: "" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [performanceData, setPerformanceData] = useState({ date: "", pagesEntered: "", categories: [{ categoryName: "", pages: "" }] });
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try { const res = await axios.get(API); setEmployees(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePerformanceChange = (e, idx) => {
    const updated = [...performanceData.categories];
    updated[idx][e.target.name] = e.target.value;
    setPerformanceData({ ...performanceData, categories: updated });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedEmployee) await axios.put(`${API}/${selectedEmployee._id}`, formData);
      else await axios.post(API, formData);
      setFormData({ name: "", role: "", department: "", email: "", phone: "" });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async id => { await axios.delete(`${API}/${id}`); fetchEmployees(); };
  const handleEdit = emp => { setSelectedEmployee(emp); setFormData(emp); };
  const handlePerformanceSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/${selectedEmployee._id}/performance`, performanceData);
      setPerformanceData({ date: "", pagesEntered: "", categories: [{ categoryName: "", pages: "" }] });
      fetchEmployees();
    } catch (err) { console.error(err); }
  };

  const sortedEmployees = [...employees]
    .filter(e => Object.values(e).join(" ").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a[sortField] < b[sortField] ? (sortOrder === "asc" ? -1 : 1) : a[sortField] > b[sortField] ? (sortOrder === "asc" ? 1 : -1) : 0));

  return (
    <div className="employee-dashboard">
      <NewHeader />
      <div className="dashboard-wrapper">
<NewSidebar
  isCollapsed={isCollapsed}
  className={isCollapsed ? "sidebar collapsed" : "sidebar"}
  onToggle={() => setIsCollapsed(!isCollapsed)}
/>

<main className={`employee-main ${isCollapsed ? "collapsed" : ""}`}>
          <h1>Members Management</h1>
          <div className="dashboard-container">

            {/* Left: Employee Form & Performance */}
            <div className="left-column">
              <div className="card employee-form">
                <h3>{selectedEmployee ? "Edit Member" : "Add Member"}</h3>
                <form onSubmit={handleSubmit}>
                  {["name", "role", "department", "email", "phone"].map(f => (
                    <input key={f} type="text" name={f} placeholder={f} value={formData[f]} onChange={handleChange} required />
                  ))}
                  <button type="submit">{selectedEmployee ? "Update" : "Create"}</button>
                </form>
              </div>

              {selectedEmployee && (
                <div className="card performance-form">
                  <h3>Add Performance - {selectedEmployee.name}</h3>
                  <form onSubmit={handlePerformanceSubmit}>
                    <input type="date" value={performanceData.date} onChange={e => setPerformanceData({ ...performanceData, date: e.target.value })} required />
                    <input type="number" placeholder="Total Pages" value={performanceData.pagesEntered} onChange={e => setPerformanceData({ ...performanceData, pagesEntered: e.target.value })} required />
                    {performanceData.categories.map((cat, idx) => (
                      <div key={idx}>
                        <input type="text" placeholder="Category" name="categoryName" value={cat.categoryName} onChange={e => handlePerformanceChange(e, idx)} />
                        <input type="number" placeholder="Pages" name="pages" value={cat.pages} onChange={e => handlePerformanceChange(e, idx)} />
                      </div>
                    ))}
                    <button type="submit">Add Performance</button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Employee List */}
            <div className="right-column">
              <div className="options-bar">
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <select value={sortField} onChange={e => setSortField(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="role">Role</option>
                  <option value="department">Department</option>
                </select>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
                <button onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}>
                  {viewMode === "table" ? "Grid View" : "Table View"}
                </button>
              </div>

              {viewMode === "table" ? (
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Performance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEmployees.map(emp => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.role}</td>
                        <td>{emp.department}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone}</td>
                        <td>{emp.performance?.length || 0} entries</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
                          <button className="performance-btn" onClick={() => setSelectedEmployee(emp)}>Performance</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="employee-grid">
                  {sortedEmployees.map(emp => (
                    <div className="employee-card" key={emp._id}>
                      <strong>{emp.name}</strong> ({emp.role})
                      <span>{emp.department}</span>
                      <span>{emp.email}</span>
                      <span>{emp.phone}</span>
                      <span>Performance: {emp.performance?.length || 0} entries</span>
                      <div>
                        <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
                        <button className="performance-btn" onClick={() => setSelectedEmployee(emp)}>Performance</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeManagement;

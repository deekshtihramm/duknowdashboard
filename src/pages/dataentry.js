import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DataEntrySidebar from "../components/DataEntrySidebar";
import "./DataEntry.css";

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState("#basic-info");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("General");
  const [allQuestions, setAllQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const handleAddQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const questionPayload = {
      questions: [
        {
          question: question,
          category: category
        }
      ]
    };

    try {
      const response = await fetch("http://localhost:3000/api/randomquestions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionPayload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Question added successfully!");
        setQuestion("");
        setCategory("General");
      } else {
        alert("Failed to add question: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Error adding question");
    }
  };

  useEffect(() => {
    if (activeTab === "#contact") {
      fetchAllQuestions();
    }
  }, [activeTab]);

  const fetchAllQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/randomquestions/");
      const data = await response.json();

      if (response.ok) {
        setAllQuestions(data);
      } else {
        alert("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Error fetching questions");
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/randomquestions/delete/${questionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Deleted successfully");
        fetchAllQuestions();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const filteredQuestions = allQuestions
    .filter((q) =>
      filterCategory === "All" || q.category === filterCategory
    )
    .filter((q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const groupedQuestions = filteredQuestions.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const uniqueCategories = ["All", ...new Set(allQuestions.map((q) => q.category))];

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
            {/* Add Question Tab */}
            {activeTab === "#basic-info" && (
              <div className="tab-content">
                <h3>Add Questions</h3>
                <input
                  type="text"
                  placeholder="Enter question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ marginLeft: "10px" }}
                >
                  <option>General</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Database</option>
                  <option>DevOps</option>
                </select>
                <button onClick={handleAddQuestion} style={{ marginLeft: "10px" }}>
                  Add Question
                </button>
              </div>
            )}

            {/* View All Questions */}
            {activeTab === "#contact" && (
              <div className="tab-content">
                <h3>All Questions by Category</h3>

                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "6px", marginRight: "10px" }}
                  />

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {uniqueCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {Object.keys(groupedQuestions).length === 0 ? (
                  <p>No questions found</p>
                ) : (
                  Object.entries(groupedQuestions).map(([category, questions]) => (
                    <div key={category} style={{ marginBottom: "20px" }}>
                      <details open>
                        <summary style={{ fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
                          {category} ({questions.length})
                        </summary>
                        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                          {questions.map((q) => (
                            <li key={q._id} style={{ marginBottom: "8px" }}>
                              {q.question}
                              <button
                                onClick={() => handleDelete(q._id)}
                                style={{
                                  marginLeft: "10px",
                                  padding: "2px 6px",
                                  backgroundColor: "#ff5555",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Create Page */}
            {activeTab === "#notes" && (
              <div className="tab-content">
                <h3>Create Page</h3>
                <input type="text" placeholder="Page name" />
              </div>
            )}

            {/* Submit */}
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

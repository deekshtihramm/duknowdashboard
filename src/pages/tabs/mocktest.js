import React, { useEffect, useState } from "react";

const MockTestsTab = () => {
  const [mockTests, setMockTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTitle, setFilterTitle] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3000/api/mocktest/mocktest")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched mock tests:", data);
        setMockTests(data);
      })
      .catch((err) => {
        console.error("Failed to fetch mock tests:", err);
      });
  }, []);

  const uniqueTitles = ["All", ...new Set(mockTests.map((mt) => mt.testTitle || "Untitled"))];

  const filteredTests = mockTests.filter((test) => {
    const matchTitle = filterTitle === "All" || test.testTitle === filterTitle;
    const matchSearch = test.questions.some((q) =>
      (q.questionText || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchTitle && matchSearch;
  });

  return (
    <div className="tab-content">
      <h3>Mock Test Questions</h3>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search mock questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />
        <select value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)}>
          {uniqueTitles.map((title, idx) => (
            <option key={idx} value={title}>{title}</option>
          ))}
        </select>
      </div>

      {filteredTests.length === 0 ? (
        <p>Loading or no mock tests found...</p>
      ) : (
        filteredTests.map((test) => (
          <div key={test._id} style={{ marginBottom: "20px" }}>
            <details open>
              <summary style={{ fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
                {test.testTitle} ({test.questions.length})
              </summary>
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {test.questions.map((q, idx) => (
                  <li key={q._id} style={{ marginBottom: "12px" }}>
                    <div>
                      <strong>Q{idx + 1}:</strong> {q.questionText}
                    </div>
                    {Array.isArray(q.options) && (
                      <ul style={{ paddingLeft: "20px" }}>
                        {q.options.map((opt, i) => (
                          <li key={opt._id || i}>
                            {opt.option}
                            {opt.isCorrect && <strong style={{ color: "green" }}> ✔</strong>}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div><em>Explanation:</em> {q.explanation || "Not provided"}</div>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))
      )}
    </div>
  );
};

export default MockTestsTab;

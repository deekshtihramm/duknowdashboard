import React from "react";

const AllQuestionsTab = ({
  groupedQuestions,
  uniqueCategories,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleDelete,
}) => (
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
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        {uniqueCategories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    {Object.keys(groupedQuestions).length === 0 ? (
      <p>Loading...</p>
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
                  <table><tbody>
                    <tr>
                      <td style={{ width: "150%" }}>{q.question}</td>
                      <td>
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
                      </td>
                    </tr>
                  </tbody></table>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))
    )}
  </div>
);

export default AllQuestionsTab;
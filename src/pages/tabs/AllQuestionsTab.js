import React from "react";

const AllQuestionsTab = ({
  groupedQuestions,
  uniqueCategories,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  handleDelete,
}) => {
  // ✅ Calculate counts for each category
  const categoryCounts = Object.entries(groupedQuestions).map(
    ([category, questions]) => ({
      category,
      count: questions.length,
    })
  );

  return (
    <div className="tab-content" style={{ padding: "10px" }}>
      <h3 style={{ marginBottom: "10px" }}>All Questions by Category</h3>

      {/* ✅ Top category-wise counts */}
      <div
        style={{
          marginBottom: "15px",
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        {categoryCounts.map((c) => (
          <span key={c.category}>
            {c.category}: {c.count}
          </span>
        ))}
      </div>

      {/* 🔍 Search + Filter */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "6px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "220px",
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop:"15px"
          }}
        >
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📌 Categories + Questions */}
      {Object.keys(groupedQuestions).length === 0 ? (
        <p>Loading...</p>
      ) : (
        Object.entries(groupedQuestions).map(([category, questions]) => (
          <div
            key={category}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "10px",
              backgroundColor: "#fafafa",
            }}
          >
            <details open>
              <summary
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginBottom: "10px",
                }}
              >
                {category} ({questions.length})
              </summary>

              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {questions.map((q) => (
                  <li
                    key={q._id}
                    style={{
                      marginBottom: "8px",
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                      listStyleType: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ flex: "1", marginRight: "10px" }}>
                      {q.question}
                    </span>

                    <button
                      onClick={() => handleDelete(q._id,q.category)}
                      style={{
                        padding: "4px 10px",
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
  );
};

export default AllQuestionsTab;

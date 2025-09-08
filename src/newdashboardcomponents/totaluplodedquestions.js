import React, { useEffect, useState, useRef, useCallback } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./totalpostedquestions.css";

const DEFAULT_CATEGORIES = [
  "general", "business", "food", "history", "movies", "mythology",
  "scientists", "space", "sports", "technology", "aptitude",
  "computer", "english", "reasoning", "gk", "polity", "geography",
  "currentaffairs", "economy", "environment", "ethics", "coding", "chemistry"
];

const TotalPostedQuestions = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch questions for selected category
  const fetchQuestions = useCallback(async (category, pageNumber) => {
    if (!category) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/realpages/questions/all?category=${category}&skip=${
          pageNumber * 30
        }&limit=30`
      );
      const data = await res.json();

      const newQuestions = Array.isArray(data) ? data : data[category] || [];

      setQuestionsByCategory((prev) => ({
        ...prev,
        [category]:
          pageNumber === 0 ? newQuestions : [...(prev[category] || []), ...newQuestions],
      }));

      setHasMore(newQuestions.length === 30);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
    setLoading(false);
  }, []);

    const filteredQuestions = (questionsByCategory[selectedCategory] || []).filter(q =>
  q.title?.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Fetch first page when category changes
  useEffect(() => {
    if (selectedCategory) {
      setPage(0);
      fetchQuestions(selectedCategory, 0);
    }
  }, [selectedCategory, fetchQuestions]);

  // Infinite scroll observer
  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch next page when page changes
  useEffect(() => {
    if (page > 0 && selectedCategory) {
      fetchQuestions(selectedCategory, page);
    }
  }, [page, selectedCategory, fetchQuestions]);


  useEffect(() => {
  if (selectedCategory) {
    setSearchQuery(""); // clear search when category changes
    setPage(0);
    fetchQuestions(selectedCategory, 0);
  }
}, [selectedCategory, fetchQuestions]);


const handleDelete = async (category, id) => {
  if (!window.confirm("Are you sure you want to delete this question?")) return;

  try {
    const res = await fetch(`http://localhost:8000/api/realpages/${category}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setQuestionsByCategory((prev) => ({
        ...prev,
        [category]: prev[category].filter((q) => q._id !== id),
      }));
      alert("Question deleted successfully!");
    } else {
      alert("Failed to delete the question.");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("An error occurred while deleting.");
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
          <h2>Total Uploaded Details</h2>

          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
  <label style={{ fontWeight: "bold" }}>Select Category:</label>
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    {DEFAULT_CATEGORIES.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <input
    type="text"
    placeholder="Search questions..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{
      padding: "6px 10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      flex: "1",
    }}
  />
</div>


          {selectedCategory && questionsByCategory[selectedCategory] ? (
            <>
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Page Number</th>
                    <th>Level</th>
                    <th>Created At</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q, index) => {

                    const isLast =
                      index === questionsByCategory[selectedCategory].length - 1;
                    return (
                      <tr key={q._id || index} ref={isLast ? lastRowRef : null}>
                        <td>{index + 1}</td>
                        <td>{q.title || "No Title"}</td>
                        <td>{q.pageNumber || "-"}</td>
                        <td>{q.level || "-"}</td>
                        <td>
                          {q.createdAt
                            ? new Date(q.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                          <td>
                            <button
                              onClick={() => handleDelete(selectedCategory, q._id)}
                              style={{
                                backgroundColor: "#ffffff05",
                                color: "red",
                                border: "none",
                                padding: "0px 10px",
                                cursor: "pointer"
                              }}
                            >
                              delete
                            </button>
                          </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {loading && <p>Loading more...</p>}
              {!hasMore && <p>No more questions.</p>}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default TotalPostedQuestions;

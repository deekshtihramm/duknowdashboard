import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import styles from "./postquestions.module.css";


const Postquestions = () => {
  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({});
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const skipRef = useRef(0);
  const limit = 50;
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  const categories = [
    { value: "general", label: "General" },
    { value: "computer", label: "Computer" },
    { value: "scientists", label: "Science" },
    { value: "space", label: "Space" },
    { value: "history", label: "History" },
    { value: "sports", label: "Sports" },
    { value: "movies", label: "Biography" },
    { value: "gk", label: "Gk" },
    { value: "environment", label: "Environment" },
    { value: "food", label: "Food" },
    { value: "technology", label: "Technology" },
    { value: "geography", label: "Geography" },
    { value: "economy", label: "Economy" },
    { value: "aptitude", label: "Aptitude" },
    { value: "coding", label: "Coding" }
  ];

  const fetchCounts = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/realpages/count/getallcount`);
      const data = await response.json();
      setCounts(data || {});
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  const fetchCategoryData = async (selectedCategory, skipValue = 0, isNewCategory = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const latestPageNumber = counts[selectedCategory] || 0;
      const response = await fetch(
        `http://localhost:8000/api/realpages/questions/all?category=${selectedCategory}&pageNumber=${latestPageNumber}&skip=${skipValue}&limit=${limit}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const sortedData = data.sort((a, b) => b.pageNumber - a.pageNumber);
        setQuestions(prev => (isNewCategory ? sortedData : [...prev, ...sortedData]));
        skipRef.current = skipValue + data.length;
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/realpages/${category}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuestions(prev => prev.filter(q => q._id !== id));
      } else {
        alert("Failed to delete question");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const fetchMongoPage = async (category, pageNumber) => {
  try {
    const response = await fetch(`http://localhost:8000/api/realpages/mongo/${category}/pagenumber/${pageNumber}`);
    if (!response.ok) {
      throw new Error("Page not found in MongoDB");
    }
    const data = await response.json();
    console.log("MongoDB page data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching MongoDB page:", err);
    return null;
  }
};


  useEffect(() => {
    skipRef.current = 0;
    setQuestions([]);
    setHasMore(true);
    fetchCounts();
    fetchCategoryData(category, 0, true);
  }, [category]);

  const handleScroll = useCallback(() => {
    if (!hasMore || loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      fetchCategoryData(category, skipRef.current);
    }
  }, [hasMore, loading, category]);

  useEffect(() => {
    const debounceScroll = () => {
      clearTimeout(window.scrollDebounce);
      window.scrollDebounce = setTimeout(handleScroll, 150);
    };
    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll);
  }, [handleScroll]);

  const filteredQuestions = questions.filter((q) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      q.title?.toLowerCase().includes(lowerSearch) ||
      q.pageNumber?.toString().includes(lowerSearch) ||
      new Date(q.updatedAt).toLocaleDateString().includes(lowerSearch)
    );
  });

  return (
    <div className={styles.container}>
      <div style={{ maxWidth: "100%", paddingBottom: "20px", marginTop: "-20px" }}>
        <h4 style={{ textAlign: "center", fontSize: "1.2rem", color: "#333" }}>All Category Counts</h4>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center"
        }}>
          {Object.entries(counts).map(([cat, count]) => (
            <span key={cat} style={{
              background: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "0.95rem",
              fontWeight: "500",
              color: "#444",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
              minWidth: "100px",
              textAlign: "center",
              flex: "1 1 auto"
            }}>
              {cat}: <b>{count}</b>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by title, page number, or date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
      </div>


      {loading && questions.length === 0 ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Updated At</th>
              <th>Page Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredQuestions.map((item, index) => (
    <tr
      key={index}
      onClick={async () => {
        const mongoData = await fetchMongoPage(category, item.pageNumber);
        if (mongoData) {
          // Navigate to a detail page and pass the data if you want
          navigate(`/question/${item._id}`, { state: { mongoData } });
        } else {
          alert("Page not found in MongoDB");
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <td>{index + 1}</td>
      <td>{item.title}</td>
      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
      <td>{item.pageNumber}</td>
      <td>
        <button
          onClick={(e) => { e.stopPropagation(); deleteQuestion(item._id); }}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
      {loading && questions.length > 0 && <p className={styles.loading}>Loading more...</p>}
      {!hasMore && <p style={{ textAlign: "center", margin: "20px 0" }}>No more questions</p>}
    </div>
  );
};

export default Postquestions;

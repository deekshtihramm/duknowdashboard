import React, { useEffect, useState } from "react";
import styles from "./postquestions.module.css";

const Postquestions = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { value: "general", label: "General" },
    { value: "Computer", label: "Computer" },
    { value: "Science", label: "Science" },
    { value: "space", label: "Space" },
    { value: "history", label: "History" },
    { value: "sports", label: "Sports" },
    { value: "Movie", label: "Biography" },
    { value: "gk", label: "Gk" },
    { value: "reasoning", label: "Reasoning" },
    { value: "english", label: "English" },
    { value: "environment", label: "Environment" },
    { value: "food", label: "Food" },
    { value: "technology", label: "Technology" },
    { value: "current", label: "Current Affairs" },
    { value: "geography", label: "Geography" },
    { value: "economy", label: "Economy" },
    { value: "aptitude", label: "Aptitude" },
    { value: "ethics", label: "Ethics" },
    { value: "software", label: "Software" },
    { value: "chemistry", label: "Chemistry" },
    { value: "coding", label: "Coding" },
    { value: "polity", label: "Polity" },
    { value: "companies", label: "Companies" },
  ];

  const fetchCategoryData = async (selectedCategory) => {
    setLoading(true);
    try {
      const response = await fetch(`https://web.backend.duknow.in/api/${selectedCategory}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.warn("Unexpected response format:", data);
        setQuestions([]);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setQuestions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryData(category);
  }, [category]);

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
      <h3 className={styles.heading}>Questions - Only Titles</h3>

      <div className={styles.controls}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
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

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Updated At</th>
              <th>Page Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td>{item.pageNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Postquestions;

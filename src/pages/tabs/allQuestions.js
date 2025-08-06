import React, { useEffect, useState } from "react";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://web.backend.duknow.in/api/general")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);

        // ✅ Extract array from 'questions' key
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          console.warn("Unexpected format:", data);
          setQuestions([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>General Questions (Line by Line)</h3>
      <ul style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
        {questions.map((q, index) => (
          <li key={index}>
            <strong>{q.title || `Title ${index + 1}`}</strong><br />
            {q.matter || "No matter provided"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;

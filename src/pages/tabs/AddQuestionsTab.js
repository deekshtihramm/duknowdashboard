import React, { useState } from "react";

const AddQuestionsTab = ({
  question,
  setQuestion,
  category,
  setCategory,
  handleAddQuestion,
}) => {
  const [mockJson, setMockJson] = useState("");

  // ✅ Set base URL here
const baseUrl = "https://web.backend.duknow.in"; // ✅ Your backend base URL

  const handleAddMockTest = async () => {
    try {
      const data = JSON.parse(mockJson); // Validate JSON format
      const res = await fetch(`${baseUrl}/api/mocktest/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Mock test added successfully!");
        setMockJson(""); // Clear after success
      } else {
        alert("❌ Failed to add mock test.");
      }
    } catch (err) {
      alert("⚠️ Invalid JSON format");
      console.error(err);
    }
  };

  return (
    <div className="tab-content">
      <h3>Add Questions</h3>
      <textarea
        placeholder="Enter multiple basic questions (separated by new lines)"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={8}
        cols={160}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        {[
          "general", "space", "food", "movies", "sports", "history", "science",
          "technology", "gk", "current affairs", "polity", "computer", "geography",
          "economy", "reasoning", "aptitude", "english", "ethics", "environment",
          "coding", "chemistry", "software", "companies",
        ].map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
      <button onClick={handleAddQuestion} style={{ marginLeft: "10px" }}>
        Add Question
      </button>

      <hr />

      <h3>Add Mock Test Questions (JSON Format)</h3>
      <textarea
        placeholder={`{
  "testTitle": "Polity Practice Test",
  "subject": "Polity",
  "questions": [
    {
      "questionText": "Who is the President of India?",
      "options": [
        { "option": "Narendra Modi", "isCorrect": false },
        { "option": "Droupadi Murmu", "isCorrect": true },
        { "option": "Ram Nath Kovind", "isCorrect": false },
        { "option": "Amit Shah", "isCorrect": false }
      ],
      "explanation": "Droupadi Murmu became President in 2022."
    }
  ]
}`}
        value={mockJson}
        onChange={(e) => setMockJson(e.target.value)}
        rows={12}
        cols={160}
      />
      <button onClick={handleAddMockTest} style={{ marginTop: "10px" }}>
        Add Mock Test
      </button>
    </div>
  );
};

export default AddQuestionsTab;

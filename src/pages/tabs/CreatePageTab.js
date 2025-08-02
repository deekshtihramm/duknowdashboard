import React, { useState, useEffect } from "react";
import "./CreatePageTab.css";

const BASE_URL = "https://web.backend.duknow.in"; // ✅ Base URL added

const CreatePageTab = () => {
  const [pageNumber, setPageNumber] = useState("");
  const [title, setTitle] = useState("");
  const [matter, setMatter] = useState("");
  const [longmatter, setLongmatter] = useState("");
  const [categoryQuestions, setCategoryQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const sampleImages = [
    "https://via.placeholder.com/100?text=1",
    "https://via.placeholder.com/100?text=2",
    "https://via.placeholder.com/100?text=3",
    "https://via.placeholder.com/100?text=4",
  ];

  const [selectedPageCategory, setSelectedPageCategory] = useState("");
  const [titleTelugu, setTitleTelugu] = useState("");
  const [matterTelugu, setMatterTelugu] = useState("");
  const [longmatterTelugu, setLongmatterTelugu] = useState("");
  const [titleHindi, setTitleHindi] = useState("");
  const [matterHindi, setMatterHindi] = useState("");
  const [longmatterHindi, setLongmatterHindi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [level, setLevel] = useState("simple");
  const [updateField, setUpdateField] = useState("");

  const handleImageUrlChange = (e) => {
    let input = e.target.value;
    let extractedUrl = input;

    if (input.includes("mediaurl=")) {
      const urlParams = new URLSearchParams(input.split("?")[1]);
      const mediaurl = urlParams.get("mediaurl");
      if (mediaurl) {
        extractedUrl = decodeURIComponent(mediaurl);
      }
    }

    setImageUrl(extractedUrl);
  };

  const handleSubmit = () => {
    if (!title || !matter || !longmatter || !pageNumber) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      pageNumber,
      title,
      matter,
      longmatter,
      titleTelugu,
      matterTelugu,
      longmatterTelugu,
      titleHindi,
      matterHindi,
      longmatterHindi,
      imageUrl,
      category: selectedPageCategory || "Computer",
      level,
      update: updateField || null,
    };

    console.log("Payload ready for submission:", payload);
    alert("Payload ready. Connect this to your backend POST request.");
  };

  useEffect(() => {
    if (selectedPageCategory) {
      fetchCategoryQuestions(selectedPageCategory);
    }
  }, [selectedPageCategory]);

  const fetchCategoryQuestions = async (category) => {
    try {
      const response = await fetch(`${BASE_URL}/api/randomquestions/random/${category}`);
      const data = await response.json();
      const questions = Array.isArray(data)
        ? data
        : data.question
        ? [data]
        : [];

      setCategoryQuestions(questions);

      if (questions.length > 0) {
        setTitle(questions[0].question);
        setCurrentQuestionId(questions[0]._id);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setCategoryQuestions([]);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!currentQuestionId) return alert("No question to delete.");
    const confirmDelete = window.confirm("Delete this question?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/randomquestions/delete/${currentQuestionId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        alert("Deleted successfully.");
        setTitle("");
        fetchCategoryQuestions(selectedPageCategory);
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="tab-content">
      <div style={{ marginBottom: "10px" }}>
        <label>Select Category: </label>
        <select value={selectedPageCategory} onChange={(e) => setSelectedPageCategory(e.target.value)}>
          <option value="general">-- Select --</option>
          <option value="general">General</option>
          <option value="Computer">Computer</option>
          <option value="Science">Science</option>
          <option value="space">Space</option>
          <option value="history">History</option>
          <option value="sports">Sports</option>
          <option value="Movie">Biography</option>
          <option value="gk">Gk</option>
          <option value="reasoning">Reasoning</option>
          <option value="english">English</option>
          <option value="environment">Environment</option>
          <option value="food">Food</option>
          <option value="technology">Technology</option>
          <option value="current">Current Afffairs</option>
          <option value="geography">Geography</option>
          <option value="economy">Economy</option>
          <option value="aptitude">Aptitude</option>
          <option value="ethics">Ethics</option>
          <option value="software">Software</option>
          <option value="chemistry">Chemistry</option>
          <option value="coding">Coding</option>
          <option value="polity">Polity</option>
          <option value="companies">Companies</option>
        </select>
      </div>

      {Array.isArray(categoryQuestions) && categoryQuestions.length > 0 && (
        <div style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "5px" }}>
          <h4>Retrieved Question ({selectedPageCategory})</h4>
          <ul>
            {categoryQuestions.map((q, index) => (
              <li key={q._id || index} style={{ marginBottom: "6px" }}>
                {q.question || "No question text available"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="input-row">
        <label className="input-label">Title:</label>
        <input
          type="text"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="icon-button button change" onClick={() => fetchCategoryQuestions(selectedPageCategory)}>
          🔁
        </button>

        <button className="icon-button button delete" onClick={handleDeleteQuestion}>
          🗑️
        </button>

        <label>Level: </label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="simple">Simple</option>
          <option value="hard">Hard</option>
          <option value="pro">Pro</option>
          <option value="pro max">Pro Max</option>
        </select>
      </div>

      <div className="translation-row">
        <input
          type="text"
          className="title-field"
          placeholder="Title (Telugu)"
          value={titleTelugu}
          onChange={(e) => setTitleTelugu(e.target.value)}
        />
        <button className="icon-button button ">&#8635;</button>

        <input
          type="text"
          className="title-field"
          placeholder="Title (Hindi)"
          value={titleHindi}
          onChange={(e) => setTitleHindi(e.target.value)}
        />
        <button className="icon-button button">&#8635;</button>
      </div>

      <div className="matter-section">
        <div className="matter-column">
          <label>Matter:</label>
          <textarea className="matter-input" value={matter} onChange={(e) => setMatter(e.target.value)} rows={2} />
          <button className="explain-button">AI Explanation</button>

          <label>Long Matter:</label>
          <textarea className="matter-input" value={longmatter} onChange={(e) => setLongmatter(e.target.value)} rows={4} />
          <button className="explain-button">AI Explanation</button>
        </div>

        <div className="matter-column">
          <label>Matter (Telugu):</label>
          <textarea className="matter-input" value={matterTelugu} onChange={(e) => setMatterTelugu(e.target.value)} rows={2} />
          <button className="explain-button">AI Explanation</button>

          <label>Long Matter (Telugu):</label>
          <textarea className="matter-input" value={longmatterTelugu} onChange={(e) => setLongmatterTelugu(e.target.value)} rows={4} />
          <button className="explain-button">AI Explanation</button>
        </div>

        <div className="matter-column">
          <label>Matter (Hindi):</label>
          <textarea className="matter-input" value={matterHindi} onChange={(e) => setMatterHindi(e.target.value)} rows={2} />
          <button className="explain-button">AI Explanation</button>

          <label>Long Matter (Hindi):</label>
          <textarea className="matter-input" value={longmatterHindi} onChange={(e) => setLongmatterHindi(e.target.value)} rows={4} />
          <button className="explain-button">AI Explanation</button>
        </div>
      </div>

      <div className="image-section">
        <div className="image-controls">
          <button className="ai-button">AI Creation</button>
          <label>URL:</label>
          <input type="text" className="image-url-input" placeholder="Enter or paste image URL" value={imageUrl} onChange={handleImageUrlChange} />
          <label className="upload-button">
            Select
            <input
              type="file"
              accept="image/*"
              className="image-upload-input"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImageUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>

        <div className="image-frame-grid">
          {sampleImages.map((img, i) => (
            <div key={i} className="image-frame-clickable" onClick={() => setImageUrl(img)}>
              <img src={img} alt={`Sample ${i + 1}`} />
            </div>
          ))}
        </div>

        <div className="selected-image-preview">
          {imageUrl && <img src={imageUrl} alt="Selected" className="preview-image" />}
        </div>
      </div>

      <button onClick={handleSubmit} style={{ padding: "8px 16px", marginTop: "15px" }}>
        Submit Page Data
      </button>
    </div>
  );
};

export default CreatePageTab;

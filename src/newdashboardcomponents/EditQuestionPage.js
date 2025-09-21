import React, { useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const EditQuestionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const mongoData = location.state?.mongoData || {};

  const [title, setTitle] = useState(mongoData.title || "");
  const [matter, setMatter] = useState(mongoData.matter || "");
  const [longMatter, setLongMatter] = useState(mongoData.longmatter || "");
  const [titleHindi, setTitleHindi] = useState(mongoData.titleHindi || "");
  const [matterHindi, setMatterHindi] = useState(mongoData.matterHindi || "");
  const [longMatterHindi, setLongMatterHindi] = useState(mongoData.longmatterHindi || "");
  const [titleTelugu, setTitleTelugu] = useState(mongoData.titleTelugu || "");
  const [matterTelugu, setMatterTelugu] = useState(mongoData.matterTelugu || "");
  const [longMatterTelugu, setLongMatterTelugu] = useState(mongoData.longmatterTelugu || "");
  const [comments, setComments] = useState(mongoData.comments?.join("\n") || "");
  const [category, setCategory] = useState(mongoData.category || "");
  const [pageNumber, setPageNumber] = useState(mongoData.pageNumber || 0);
  const [place, setPlace] = useState(mongoData.place || "");
  const [level, setLevel] = useState(mongoData.level || "");
  const [update, setUpdate] = useState(mongoData.update || "");
  const [imageUrl, setImageUrl] = useState(mongoData.imageUrl || "");

  const [loading, setLoading] = useState({
    title: false,
    matter: false,
    longMatter: false,
    translateTitle: false,
    translateMatter: false,
    translateLong: false,
    explainMatter: false,
    explainLong: false,
    image: false,
  });

  const id = mongoData._id;
  if (!id) return <p style={{ textAlign: "center", marginTop: "50px" }}>No data found</p>;

  // -------------- AI Helpers ----------------
  const callGeminiAPI = async (prompt) => {
    try {
      const response = await fetch(
        `${GEMINI_BASE_URL}v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (error) {
      console.error("Gemini API error:", error);
      return "";
    }
  };

  const translate = async (text, type) => {
    if (!text) return "";
    let lang = type.includes("Telugu") ? "Telugu" : "Hindi";
    const prompt = `Translate the following English text into clear, natural, fluent, and modern ${lang}. Use everyday ${lang}, avoid overly formal translations. Just return the text:\n\n${text}`;
    return await callGeminiAPI(prompt);
  };

  // -------------- FIELD AI FUNCTIONS ---------------
  const generateField = async (field) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    let prompt = "";
    if (field === "title") prompt = `Generate a concise English title for: ${title}`;
    else if (field === "matter") prompt = `Provide a concise English explanation (1000–2000 chars) for: ${title}`;
    else if (field === "longMatter") prompt = `Provide a detailed English explanation (3000–4000 chars) for: ${title}`;
    const result = await callGeminiAPI(prompt);

    if (field === "title") setTitle(result);
    else if (field === "matter") setMatter(result);
    else if (field === "longMatter") setLongMatter(result);
    setLoading(prev => ({ ...prev, [field]: false }));
  };

  const translateField = async (field) => {
    setLoading(prev => ({ ...prev, [field]: true }));
    let resultTel = "", resultHin = "";
    if (field === "title") {
      resultTel = await translate(title, "titleTelugu");
      resultHin = await translate(title, "titleHindi");
      setTitleTelugu(resultTel);
      setTitleHindi(resultHin);
    } else if (field === "matter") {
      resultTel = await translate(matter, "shortTelugu");
      resultHin = await translate(matter, "shortHindi");
      setMatterTelugu(resultTel);
      setMatterHindi(resultHin);
    } else if (field === "longMatter") {
      resultTel = await translate(longMatter, "longTelugu");
      resultHin = await translate(longMatter, "longHindi");
      setLongMatterTelugu(resultTel);
      setLongMatterHindi(resultHin);
    }
    setLoading(prev => ({ ...prev, [field]: false }));
  };

  const explainField = async (field) => {
    setLoading(prev => ({ ...prev, [field === "matter" ? "explainMatter" : "explainLong"]: true }));
    const content = field === "matter" ? matter : longMatter;
    const prompt = field === "matter"
      ? `Explain concisely (1000–2000 chars) the following text:\n\n${content}`
      : `Explain in detail (3000–4000 chars) the following text:\n\n${content}`;
    const explanation = await callGeminiAPI(prompt);
    if (field === "matter") setMatter(`${matter}\n\nExplanation: ${explanation}`);
    else setLongMatter(`${longMatter}\n\nExplanation: ${explanation}`);
    setLoading(prev => ({ ...prev, [field === "matter" ? "explainMatter" : "explainLong"]: false }));
  };

  const generateTitleImage = async () => {
    if (!title) return alert("Enter a title first!");
    setLoading(prev => ({ ...prev, image: true }));
    try {
      const response = await axios.post("http://localhost:4000/api/ai/image", { prompt: title });
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Failed to generate AI image.");
    } finally {
      setLoading(prev => ({ ...prev, image: false }));
    }
  };

  // ---------------- SAVE -------------------
  const handleSave = async () => {
    try {
      const updatedData = {
        title,
        matter,
        longmatter: longMatter,
        titleHindi,
        matterHindi,
        longmatterHindi: longMatterHindi,
        titleTelugu,
        matterTelugu,
        longmatterTelugu: longMatterTelugu,
        comments: comments.split("\n"),
        category,
        pageNumber,
        place,
        level,
        update,
        imageUrl,
      };
      const response = await axios.put(`http://localhost:4000/api/questions/${id}`, updatedData);
      alert("Question updated successfully!");
      navigate("/question-detail", { state: { mongoData: response.data } });
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question.");
    }
  };

  // ---------------- STYLES ------------------
  const labelStyle = { fontWeight: "600", padding: "8px", width: "180px", background: "#f7f7f7" };
  const inputStyle = { padding: "8px", width: "100%", boxSizing: "border-box" };
  const buttonStyle = { padding: "6px 12px", marginRight: "5px", cursor: "pointer" };

  // ---------------- RENDER ------------------
  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`} style={{ flex: 1, padding: "20px" }}>
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Question</h1>

            {imageUrl && <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img src={imageUrl} alt={title} style={{ maxWidth: "100%", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
            </div>}

            {/* Title Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (English)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
                <div style={{ marginTop: "5px" }}>
                  <button style={buttonStyle} onClick={() => generateField("title")} disabled={loading.title}>
                    {loading.title ? "Generating..." : "Generate"}
                  </button>
                  <button style={buttonStyle} onClick={() => translateField("title")} disabled={loading.translateTitle}>
                    {loading.translateTitle ? "Translating..." : "Translate"}
                  </button>
                  <button style={buttonStyle} onClick={generateTitleImage} disabled={loading.image}>
                    {loading.image ? "Generating..." : "Image"}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (Hindi)</label>
                <input type="text" value={titleHindi} onChange={e => setTitleHindi(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (Telugu)</label>
                <input type="text" value={titleTelugu} onChange={e => setTitleTelugu(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Matter Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (English)</label>
                <textarea value={matter} onChange={e => setMatter(e.target.value)} rows={4} style={inputStyle} />
                <div style={{ marginTop: "5px" }}>
                  <button style={buttonStyle} onClick={() => generateField("matter")} disabled={loading.matter}>
                    {loading.matter ? "Generating..." : "Generate"}
                  </button>
                  <button style={buttonStyle} onClick={() => translateField("matter")} disabled={loading.translateMatter}>
                    {loading.translateMatter ? "Translating..." : "Translate"}
                  </button>
                  <button style={buttonStyle} onClick={() => explainField("matter")} disabled={loading.explainMatter}>
                    {loading.explainMatter ? "Explaining..." : "Explain"}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (Hindi)</label>
                <textarea value={matterHindi} onChange={e => setMatterHindi(e.target.value)} rows={4} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (Telugu)</label>
                <textarea value={matterTelugu} onChange={e => setMatterTelugu(e.target.value)} rows={4} style={inputStyle} />
              </div>
            </div>

            {/* Long Matter Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (English)</label>
                <textarea value={longMatter} onChange={e => setLongMatter(e.target.value)} rows={4} style={inputStyle} />
                <div style={{ marginTop: "5px" }}>
                  <button style={buttonStyle} onClick={() => generateField("longMatter")} disabled={loading.longMatter}>
                    {loading.longMatter ? "Generating..." : "Generate"}
                  </button>
                  <button style={buttonStyle} onClick={() => translateField("longMatter")} disabled={loading.translateLong}>
                    {loading.translateLong ? "Translating..." : "Translate"}
                  </button>
                  <button style={buttonStyle} onClick={() => explainField("longMatter")} disabled={loading.explainLong}>
                    {loading.explainLong ? "Explaining..." : "Explain"}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (Hindi)</label>
                <textarea value={longMatterHindi} onChange={e => setLongMatterHindi(e.target.value)} rows={4} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (Telugu)</label>
                <textarea value={longMatterTelugu} onChange={e => setLongMatterTelugu(e.target.value)} rows={4} style={inputStyle} />
              </div>
            </div>

            {/* Comments */}
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Comments</label>
              <textarea value={comments} onChange={e => setComments(e.target.value)} rows={4} style={{ ...inputStyle, width: "100%" }} />
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button onClick={handleSave} style={{ padding: "10px 30px", fontSize: "16px", cursor: "pointer", borderRadius: "5px", background: "#28a745", color: "#fff" }}>
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditQuestionPage;

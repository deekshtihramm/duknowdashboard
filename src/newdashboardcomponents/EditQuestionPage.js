import React, { useState } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDetails.css";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const EditQuestionPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const mongoData = location.state?.mongoData || {};

  const backend_URL2 = "http://localhost:4000"; // or your actual backend


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
  titleHindi: false,
  titleTelugu: false,
  matter: false,
  translateMatter: false,
  longMatter: false,
  translateLong: false,
  image: false,
  explainMatter: false,
  explainLong: false
});

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
    // Set loading for this specific field
    setLoading(prev => ({ ...prev, [field]: true }));

    try {
      let result;

      if (field === "titleHindi") {
        result = await translate(title, "titleHindi");
        setTitleHindi(result);
      } 
      else if (field === "titleTelugu") {
        result = await translate(title, "titleTelugu");
        setTitleTelugu(result);
      }
      else if (field === "matter") {
        const resultTel = await translate(matter, "shortTelugu");
        const resultHin = await translate(matter, "shortHindi");
        setMatterTelugu(resultTel);
        setMatterHindi(resultHin);
      }
      else if (field === "matterHindi") {
        result = await translate(matter, "shortHindi");
        setMatterHindi(result);
      }
      else if (field === "matterTelugu") {
        result = await translate(matter, "shortTelugu");
        setMatterTelugu(result);
      }
      else if (field === "longMatter") {
        const resultTel = await translate(longMatter, "longTelugu");
        const resultHin = await translate(longMatter, "longHindi");
        setLongMatterTelugu(resultTel);
        setLongMatterHindi(resultHin);
      }
      else if (field === "longMatterHindi") {
        result = await translate(longMatter, "longHindi");
        setLongMatterHindi(result);
      }
      else if (field === "longMatterTelugu") {
        result = await translate(longMatter, "longTelugu");
        setLongMatterTelugu(result);
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      // Make sure to reset loading for this field
      setLoading(prev => ({ ...prev, [field]: false }));
    }
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

  const compressImage = (base64, maxSizeKB = 600) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;
      const maxDim = 1024;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else {
          width = (width * maxDim) / height;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9; // start with high quality
      let compressed = canvas.toDataURL("image/jpeg", quality);

      // prevent over-compression (keep clarity)
      while ((compressed.length * (3 / 4)) / 1024 > maxSizeKB && quality > 0.7) {
        quality -= 0.05;
        compressed = canvas.toDataURL("image/jpeg", quality);
      }

      resolve(compressed);
    };
  });

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const [imageFile, setImageFile] = useState(null);

  // ---------------- SAVE -------------------
const handleSave = async () => {
  if (!title || !matter || !longMatter) {
    alert("Please fill in all required fields");
    return;
  }

  setLoading(prev => ({ ...prev, image: true }));

  let uploadedImageUrl = imageUrl; // default to current image

  try {
    // 🔑 1. Upload new image to AWS if it's a File object (user changed it)
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`${backend_URL2}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.url) throw new Error("Image upload failed");
      
      console.log("Uploaded image URL:", data.url);
      uploadedImageUrl = data.url || "";
    }

    // 🔑 2. If imageUrl is still base64, compress and upload
    if (uploadedImageUrl.startsWith("data:image")) {
      const compressedBase64 = await compressImage(uploadedImageUrl, 600);
      const file = dataURLtoFile(compressedBase64, "generated.jpg");

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${backend_URL2}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploadedImageUrl = data.url || "";
    }

    // 🔑 3. Prepare payload
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
      place,
      level,
      update,
      imageUrl: uploadedImageUrl || "",
    };

    // 🔑 4. PUT request to update question
    const response = await axios.put(`http://localhost:4000/api/realpages/update/${category}/${mongoData._id}`, updatedData);

    alert("Question updated successfully!");
    navigate("/question-detail", { state: { mongoData: response.data } });

  } catch (error) {
    console.error("Error updating question:", error);
    alert("Failed to update question.");
  } finally {
    setLoading(prev => ({ ...prev, image: false }));
  }
};
  // --------------- STYLES ------------------
  const labelStyle = { fontWeight: "600", padding: "8px", width: "180px", background: "#f7f7f7" };
  const inputStyle = { padding: "8px", width: "100%", boxSizing: "border-box" };
  const buttonStyle = { padding: "6px 12px", marginRight: "5px", cursor: "pointer" };

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);


  // At the top of your component
  const [rotation, setRotation] = useState(0);    // for rotate left/right
  const [flipH, setFlipH] = useState(false);      // flip horizontal
  const [flipV, setFlipV] = useState(false);      // flip vertical

  // Helper to download image
  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  {/* Inline Control Button Style */}
  const controlButtonStyle = {
    flex: 1,
    margin: "0 5px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s"
  };

   const id = mongoData._id;
  if (!id) return <p style={{ textAlign: "center", marginTop: "50px" }}>No data found</p>;


  // ---------------- ReNDER ------------------
  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        <main className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`} style={{ flex: 1, padding: "20px" }}>
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Question</h1>

            {/* {imageUrl && <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img src={imageUrl} alt={title} style={{ maxWidth: "100%", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
            </div>} */}

            {/* ================= IMAGE SECTION ================= */}
            <div style={{
              display: "flex",
              gap: "30px",
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              marginBottom: "30px"
            }}>

              {/* Left: Image Preview / Cropper */}
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {imageUrl && !cropping && (
                  <img
                    src={imageUrl}
                    alt={title}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  />
                )}

                {cropping && (
                  <div style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "400px",
                    height: "400px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#222"
                  }}>
                    <Cropper
                      image={imageUrl}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={16 / 9}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(croppedArea, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                    />

                    {/* Save / Cancel buttons */}
                    <div style={{
                      position: "absolute",
                      bottom: "15px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "10px"
                    }}>
                      <button
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#218838"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#28a745"}
                        onClick={async () => {
                          if (!croppedAreaPixels) return;
                          try {
                            const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, zoom, rotation, flipH, flipV);
                            setImageUrl(croppedImage);
                            setCropping(false);
                          } catch (err) { console.error(err); }
                        }}
                      >
                        Save Crop
                      </button>

                      <button
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#6c757d",
                          color: "#fff",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#5a6268"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#6c757d"}
                        onClick={() => setCropping(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Controls */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px"
              }}>
                {/* Upload / URL */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setImageFile(file); // save raw file for backend
                    const reader = new FileReader();
                    reader.onload = () => setImageUrl(reader.result); // preview
                    reader.readAsDataURL(file);
                  }}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "80%",
                    outline: "none"
                  }}
                />

                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "80%",
                    outline: "none"
                  }}
                />

                {/* Main Actions */}
                {imageUrl && !cropping && (
                  <>
                    <button
                      style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        width: "80%",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = "#0069d9"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = "#007bff"}
                      onClick={() => setCropping(true)}
                    >
                      Crop Image
                    </button>

                    <button
                      style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        width: "80%",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = "#c82333"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = "#dc3545"}
                      onClick={() => setImageUrl("")}
                    >
                      Remove Image
                    </button>
                  
                  </>
                )}

                {/* Cropping Controls */}
                {cropping && (
                  <>
                    {/* Zoom Slider */}
                    <div style={{ width: "80%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <label style={{ fontWeight: "600", marginBottom: "5px" }}>Zoom</label>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={e => setZoom(Number(e.target.value))}
                        style={{ width: "100%" }}
                      />
                    </div>

                    {/* Rotation Buttons */}
                    <div style={{ width: "80%", display: "flex", justifyContent: "space-between" }}>
                      <button style={controlButtonStyle} onClick={() => setRotation(rotation - 90)}>⟲ Rotate Left</button>
                      <button style={controlButtonStyle} onClick={() => setRotation(rotation + 90)}>⟳ Rotate Right</button>
                    </div>

                    {/* Reset */}
                    <button
                      style={{
                        padding: "10px 16px",
                        width: "80%",
                        borderRadius: "6px",
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "10px"
                      }}
                      onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); setRotation(0); setFlipH(false); setFlipV(false); }}
                    >
                      Reset Crop
                    </button>

                    {/* Download */}
                    <button
                      style={{
                        padding: "10px 16px",
                        width: "80%",
                        borderRadius: "6px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "10px"
                      }}
                      onClick={() => downloadImage(imageUrl)}
                    >
                      Download Image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ================= OTHER FIELDS ================= */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={inputStyle}
                  placeholder="Category"
                />
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Page Number</label>
                <input
                  type="number"
                  value={pageNumber || ""}
                  onChange={e => setPageNumber(Number(e.target.value))}
                  style={inputStyle}
                  placeholder="Page number"
                />
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Place</label>
                <input
                  type="text"
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  style={inputStyle}
                  placeholder="Place"
                />
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Level</label>
                <input
                  type="text"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  style={inputStyle}
                  placeholder="Level"
                />
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Update</label>
                <input
                  type="text"
                  value={update}
                  onChange={e => setUpdate(e.target.value)}
                  style={inputStyle}
                  placeholder="Update info"
                />
              </div>
            </div>

            {/* Title Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              {/* English Title */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (English)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Hindi Title */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (Hindi)</label>
                <input
                  type="text"
                  value={titleHindi}
                  onChange={e => setTitleHindi(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("titleHindi")}
                    disabled={loading.titleHindi}
                  >
                    {loading.titleHindi ? "Translating..." : "Translate"}
                  </button>
                </div>
              </div>

              {/* Telugu Title */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Title (Telugu)</label>
                <input
                  type="text"
                  value={titleTelugu}
                  onChange={e => setTitleTelugu(e.target.value)}
                  style={inputStyle}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("titleTelugu")}
                    disabled={loading.titleTelugu}
                  >
                    {loading.titleTelugu ? "Translating..." : "Translate"}
                  </button>
                </div>
              </div>
            </div>

            {/* Matter Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              {/* English Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (English)</label>
                <textarea
                  value={matter}
                  onChange={e => setMatter(e.target.value)}
                  rows={4}
                  style={inputStyle}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => generateField("matter")}
                    disabled={loading.matter}
                  >
                    {loading.matter ? "Generating..." : "Generate"}
                  </button>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("matter")}
                    disabled={loading.translateMatter}
                  >
                    {loading.translateMatter ? "Translating..." : "Translate"}
                  </button>
                  <button
                    style={buttonStyle}
                    onClick={() => explainField("matter")}
                    disabled={loading.explainMatter}
                  >
                    {loading.explainMatter ? "Explaining..." : "Explain"}
                  </button>
                </div>
              </div>

              {/* Hindi Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (Hindi)</label>
                <textarea
                  value={matterHindi}
                  onChange={e => setMatterHindi(e.target.value)}
                  rows={4}
                  style={inputStyle}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("matterHindi")}
                    disabled={loading.matterHindi}
                  >
                    {loading.matterHindi ? "Translating..." : "Translate"}
                  </button>
                </div>
              </div>

              {/* Telugu Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Matter (Telugu)</label>
                <textarea
                  value={matterTelugu}
                  onChange={e => setMatterTelugu(e.target.value)}
                  rows={4}
                  style={inputStyle}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("matterTelugu")}
                    disabled={loading.matterTelugu}
                  >
                    {loading.matterTelugu ? "Translating..." : "Translate"}
                  </button>
                </div>
              </div>
            </div>

            {/* Long Matter Fields */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
              {/* English Long Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (English)</label>
                <textarea
                  value={longMatter}
                  onChange={e => setLongMatter(e.target.value)}
                  rows={4}
                  style={{minHeight: "150px", ...inputStyle}}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => generateField("longMatter")}
                    disabled={loading.longMatter}
                  >
                    {loading.longMatter ? "Generating..." : "Generate"}
                  </button>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("longMatter")}
                    disabled={loading.translateLong}
                  >
                    {loading.translateLong ? "Translating..." : "Translate"}
                  </button>
                  <button
                    style={buttonStyle}
                    onClick={() => explainField("longMatter")}
                    disabled={loading.explainLong}
                  >
                    {loading.explainLong ? "Explaining..." : "Explain"}
                  </button>
                </div>
              </div>

              {/* Hindi Long Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (Hindi)</label>
                <textarea
                  value={longMatterHindi}
                  onChange={e => setLongMatterHindi(e.target.value)}
                  rows={4}
                  style={{minHeight: "150px", ...inputStyle}}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("longMatterHindi")}
                    disabled={loading.longMatterHindi}
                  >
                    {loading.longMatterHindi ? "Translating..." : "Translate"}
                  </button>
                </div>
              </div>

              {/* Telugu Long Matter */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <label style={labelStyle}>Long Matter (Telugu)</label>
                <textarea
                  value={longMatterTelugu}
                  onChange={e => setLongMatterTelugu(e.target.value)}
                  rows={4}
                  style={{minHeight: "150px", ...inputStyle}}
                />
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => translateField("longMatterTelugu")}
                    disabled={loading.longMatterTelugu}
                  >
                    {loading.longMatterTelugu ? "Translating..." : "Translate"}
                  </button>
                </div>
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

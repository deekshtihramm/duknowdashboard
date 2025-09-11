import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";

const AllImagesPage = () => {
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImagesStream = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/realpages/image/all/images`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let first = true;
        const grouped = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // parse objects between { ... }
          let startIdx;
          while ((startIdx = buffer.indexOf("{")) !== -1 && buffer.indexOf("}", startIdx) !== -1) {
            const endIdx = buffer.indexOf("}", startIdx);
            const chunk = buffer.slice(startIdx, endIdx + 1);
            buffer = buffer.slice(endIdx + 1);

            try {
              const img = JSON.parse(chunk);
              if (img.url) {
                if (!grouped[img.category]) grouped[img.category] = [];
                grouped[img.category].push({
                  url: img.url,
                  pageNumber: img.pageNumber,
                  _id: img.id || img._id
                });

                // ✅ update state incrementally
                setImagesByCategory({ ...grouped });
                if (first) {
                  setSelectedCategory(img.category);
                  first = false;
                }
              }
            } catch (err) {
              // ignore incomplete chunks
            }
          }
        }

      } catch (err) {
        console.error("Error streaming images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImagesStream();
  }, []);

  const fetchMongoPage = async (category, pageNumber) => {
    try {
      const response = await fetch(`${BASE_URL}/api/realpages/mongo/${category}/pagenumber/${pageNumber}`);
      if (!response.ok) throw new Error("Page not found in MongoDB");
      return await response.json();
    } catch (err) {
      console.error("Error fetching MongoDB page:", err);
      return null;
    }
  };

  const categories = Object.keys(imagesByCategory);
  const filteredImages = imagesByCategory[selectedCategory]?.filter((img) =>
    img.pageNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div style={{ padding: "0px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#ffffffff", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "25px", color: "#333", fontSize: "28px", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
        All Uploaded Images
      </h2>

      {categories.length === 0 ? (
        loading ? (
          <p style={{ color: "#777", fontSize: "16px" }}>Loading (streaming)...</p>
        ) : (
          <p style={{ color: "#777", fontSize: "16px" }}>No images found.</p>
        )
      ) : (
        <>
          {/* Category Select */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
            <div>
              <label htmlFor="categorySelect" style={{ marginRight: "12px", fontWeight: "600", color: "#555" }}>Select Category:</label>
              <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <input
                type="text"
                placeholder="Search by Page Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                  width: "200px",
                }}
              />
            </div>
          </div>

          {/* Images */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {filteredImages.length === 0 ? (
              <p style={{ color: "#777", fontSize: "16px" }}>No images match your search.</p>
            ) : (
              filteredImages.map((imgObj) => (
                <div
                  key={imgObj._id}
                  style={{
                    width: "200px",
                    textAlign: "center",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={imgObj.url}
                    alt={`Uploaded ${selectedCategory}`}
                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                    onClick={async () => {
                      const mongoData = await fetchMongoPage(selectedCategory, imgObj.pageNumber);
                      if (mongoData) navigate(`/question/${imgObj._id}`, { state: { mongoData } });
                      else alert("Page not found in MongoDB");
                    }}
                  />
                  <p style={{ margin: "10px 0 5px 0", fontWeight: "500", color: "#333", fontSize: "14px" }}>
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </p>
                  <p style={{ margin: "0 0 10px 0", fontWeight: "400", color: "#555", fontSize: "13px" }}>
                    Page: {imgObj.pageNumber}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllImagesPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllImagesPage = () => {
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/realpages/image/all/images");
        const images = res.data.images || [];
        const grouped = images.reduce((acc, img) => {
          if (!acc[img.category]) acc[img.category] = [];
          acc[img.category].push({ url: img.url, pageNumber: img.pageNumber, _id: img._id || img.id });
          return acc;
        }, {});
        setImagesByCategory(grouped);

        const categories = Object.keys(grouped);
        if (categories.length > 0) setSelectedCategory(categories[0]);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const fetchMongoPage = async (category, pageNumber) => {
    try {
      const response = await fetch(`http://localhost:8000/api/realpages/mongo/${category}/pagenumber/${pageNumber}`);
      if (!response.ok) throw new Error("Page not found in MongoDB");
      return await response.json();
    } catch (err) {
      console.error("Error fetching MongoDB page:", err);
      return null;
    }
  };

  const categories = Object.keys(imagesByCategory);
  const filteredImages = imagesByCategory[selectedCategory]?.filter((img) =>
    img.pageNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div style={{ padding: "0px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#ffffffff", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "25px", color: "#333", fontSize: "28px", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
        All Uploaded Images
      </h2>

      {categories.length === 0 ? (
        loading ? (
          <p style={{ color: "#777", fontSize: "16px" }}>Loading...</p>
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

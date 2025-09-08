import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utility/cropImage";

export default function WikimediaImageSearch() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [includeCelebs, setIncludeCelebs] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const celebrities = [
    "Priyanka Chopra",
    "Tom Cruise",
    "Shah Rukh Khan",
    "Angelina Jolie",
  ];

  const buildApiUrl = (q) => {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `intitle:${q}`,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url",
      pithumbsize: "400",
      origin: "*",
    });
    return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  };

  const fetchForQuery = async (q) => {
    try {
      const res = await fetch(buildApiUrl(q));
      const data = await res.json();
      if (!data.query || !data.query.pages) return [];
      return Object.values(data.query.pages)
        .map((p) => {
          const info = (p.imageinfo && p.imageinfo[0]) || {};
          return {
            id: p.pageid,
            title: p.title,
            thumb: info.thumburl || info.url || null,
            sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(
              p.title
            )}`,
          };
        })
        .filter((r) => r.thumb);
    } catch (err) {
      console.error("Fetch error", err);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    setError(null);
    setLoading(true);
    setResults([]);

    const queries = [title.trim()];
    if (includeCelebs) queries.push(...celebrities);

    try {
      const allResults = [];
      for (const q of queries) {
        const items = await fetchForQuery(q);
        allResults.push(...items);
      }
      setResults(allResults);
    } catch (e) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Store the cropped area when user stops moving crop box
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
    setCroppedImage(croppedImg);
    setCropping(false);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 980,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h2>Wikimedia Image Search</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter search title (e.g., Tiger)"
          style={{ flex: 1, padding: "8px 10px", fontSize: 16 }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ padding: "8px 14px", fontSize: 16 }}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <label
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          type="checkbox"
          checked={includeCelebs}
          onChange={(e) => setIncludeCelebs(e.target.checked)}
        />
        Include celebrities
      </label>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {results.map((r) => (
          <img
            key={r.id}
            src={r.thumb}
            alt={r.title}
            onClick={() => {
              setSelectedImage(r.thumb);
              setCropping(true);
            }}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              borderRadius: 8,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Cropping Overlay */}
      {cropping && selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 300,
              height: 300,
              background: "#000",
            }}
          >
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button
              onClick={handleCropSave}
              style={{
                padding: "8px 14px",
                fontSize: 16,
                background: "green",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Crop & Save
            </button>
            <button
              onClick={() => setCropping(false)}
              style={{
                padding: "8px 14px",
                fontSize: 16,
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cropped Image Preview */}
      {croppedImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Cropped Image Preview</h3>
          <img
            src={croppedImage}
            alt="Cropped Preview"
            style={{ width: 200, borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}

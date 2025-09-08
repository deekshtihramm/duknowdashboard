import React, { useState, useEffect,useCallback  } from "react";
import "./CreatePageTab.css";
import { useNavigate } from "react-router-dom";
  import Cropper from 'react-easy-crop';
import getCroppedImg from "../../utility/cropImage";





const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/";
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;


const backend_URL = "https://web.backend.duknow.in"; // ✅ Base URL added

const backend_URL2  = "http://localhost:8000";

const backend_URL3 = "https://app.backend.duknow.in";

const CreatePageTab = () => {
  const [successMessage, setSuccessMessage] = useState("");
  // const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState("");
  const [title, setTitle] = useState("");
  const [matter, setMatter] = useState("");
  const [longmatter, setLongmatter] = useState("");
  const [categoryQuestions, setCategoryQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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
  const [uploadedImageURL,setUploadedImageURL] = useState("");
  // const [selectedPrompt, setSelectedPrompt] = useState(""); // for short
  // const [selectedLongPrompt, setSelectedLongPrompt] = useState(""); // for long
  const [totlaloading, settotaloading] = useState(false);
  const [fetchedImages, setFetchedImages] = useState([]); // Google/Unsplash images store cheyadaniki
  const [selectedImage, setSelectedImage] = useState(null); // User select chesina image store cheyadaniki
  const [selectedPrompt, setSelectedPrompt] = useState(""); // Short
  const [selectedLongPrompt, setSelectedLongPrompt] = useState(""); // Long

const [crop, setCrop] = useState({ x: 0, y: 0 });
const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
const [showCropper, setShowCropper] = useState(false);

  const [croppedImage, setCroppedImage] = useState(null);

  const [cropping, setCropping] = useState(false);


  const [loading, setLoading] = useState({
  shortEng: false,
  longEng: false,
  titleTelugu: false,
  titleHindi: false,
  matterTelugu: false,
  longmatterTelugu: false,
  matterHindi: false,
  longmatterHindi: false,
  image: false
});
      
  // Add this inside the CreatePageTab component
useEffect(() => {
  if (!title) return;

  let isMounted = true; // Prevent multiple triggers

  (async () => {
    try {
      handleAIImage(); // Start image generation (async, non-blocking)

      const [shortEng, longEng] = await Promise.all([
        handleExplain(title, setMatter, "English", "short", "shortEng"),
        handleExplain(title, setLongmatter, "English", "long", "longEng"),
      ]);

      if (!isMounted) return;

      const [
        titleTel,
        titleHin,
        matterTel,
        matterHin,
        longmatterTel,
        longmatterHin
      ] = await Promise.all([
        translate(title, "Telugu", "titleTelugu"),
        translate(title, "Hindi", "titleHindi"),
        translate(shortEng, "Telugu", "shortTelugu"),
        translate(shortEng, "Hindi", "shortHindi"),
        translate(longEng, "Telugu", "longTelugu"),
        translate(longEng, "Hindi", "longHindi"),
      ]);

      setTitleTelugu(titleTel);
      setTitleHindi(titleHin);
      setMatterTelugu(matterTel);
      setMatterHindi(matterHin);
      setLongmatterTelugu(longmatterTel);
      setLongmatterHindi(longmatterHin);
    } catch (error) {
      console.error("Auto generation failed:", error);
    }
  })();

  return () => { isMounted = false; };
}, [title]);

useEffect(() => {
  if (!matter && !longmatter) return; // Only run when there is content

  const autoTranslate = async () => {
    try {
      if (matter) {
        const [matterTel, matterHin] = await Promise.all([
          translate(matter, "Telugu","shortTelugu"),
          translate(matter, "Hindi","shortHindi"),
        ]);
        setMatterTelugu(matterTel);
        setMatterHindi(matterHin);
      }

      if (longmatter) {
        const [longTel, longHin] = await Promise.all([
          translate(longmatter, "Telugu","longTelugu"),
          translate(longmatter, "Hindi","longHindi"),
        ]);
        setLongmatterTelugu(longTel);
        setLongmatterHindi(longHin);
      }
    } catch (error) {
      console.error("Auto translation failed:", error);
    }
  };

  autoTranslate();
}, [matter, longmatter]); // Runs whenever English matter changes


// Gemini setup
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const handleTranslate = async (text, lang, setter,content) => {
  const translated = await translate(text, lang,content);
  setter(translated);
};


const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict";

const handleAIImage = async () => {
  setLoading(prev => ({ ...prev, image: true }));
  const body = {
    instances: [{ prompt: `Create a high-quality image of: ${title} sharp and clean without text` }],
    parameters: { sampleCount: 4 }
  };

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const newImages = data?.predictions?.map(
      p => `data:image/png;base64,${p.bytesBase64Encoded}`
    ) || [];

    // Prepend new images to show them first
    setImages(prevImages => [...newImages, ...prevImages]);
  } catch (error) {
    console.error("Image generation failed:", error);
  } finally {
    setLoading(prev => ({ ...prev, image: false }));
  }
};


// Compress base64 image to target size/quality
  const compressImage = (base64, maxSizeKB = 500) =>
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

        let quality = 0.9;
        let compressed = canvas.toDataURL("image/jpeg", quality);

        while (compressed.length / 1024 > maxSizeKB && quality > 0.1) {
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



// const generateImagesFromPrompt = async (prompt) => {
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;

//   const requests = Array.from({ length: 4 }, () =>
//     fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           { role: "user", parts: [{ text: `Create a 1024x1024 image: ${prompt}` }] }
//         ],
//         generationConfig: { response_mime_type: "text/plain" }
//       }),
//     }).then(res => res.json())
//   );

//   const responses = await Promise.all(requests);

//   return responses
//     .map(res => {
//       const base64 = res?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
//       return base64 ? `data:image/png;base64,${base64}` : null;
//     })
//     .filter(Boolean);
// };



// Fast and optimized Gemini API content generation
const handleExplain = async (text, setter, language, type, fieldKey) => {
  if (!text) return "";
  setLoading(prev => ({ ...prev, [fieldKey]: true }));
if(type === "short"){
    setMatterHindi("");
    setMatterTelugu(" ");
}
else {
  setLongmatterTelugu(" ");
  setLongmatterHindi("");
}

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${type === "short" ? "Provide a concise but complete answer to the following question in under 500 characters above 100 characters" : "Provide a detailed response to the following question using 2000 to 3000 characters. Avoid unnecessary empty lines or spaces"} about "${text}" in ${language}`
                }
              ]
            }
          ]
        }),
      }
    );


    //Provide a concise but complete answer to the following question in under 500 characters above 100 characters : \"$title\", $selectedLevel"

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    setter(result);
    return result;
  } catch (error) {
    console.error(`handleExplain (${language}, ${type}) error:`, error);
    setter("");
    return "";
  } finally {
    setLoading(prev => ({ ...prev, [fieldKey]: false }));
  }
};


const translate = async (text, language, content) => {
  if (!text) return "";

  let prompt = "";

  if (content === "shortTelugu") {

    prompt = `Translate the following English text into clear, natural, fluent, and modern Telugu — as it would appear in a popular blog or news article. Use everyday Telugu, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Telugu text, nothing else:\n\n${text}.`;
  }
  else if(content === "longTelugu"){

    prompt = `Translate the following English text into clear, natural, fluent, and modern Telugu — as it would appear in a popular blog or news article. Use everyday Telugu, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Telugu text, nothing else.
:\n\n${text}.`;

  }
  else if(content === "shortHindi"){

    prompt = `Translate the following English text into clear, natural, fluent, and modern Hindi — as it would appear in a popular blog or news article. Use everyday Hindi, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Hindi text, nothing else:\n\n${text}.`;

  }
  else if(content === "longHindi"){

    prompt = `Translate the following English text into clear, natural, fluent, and modern Hindi — as it would appear in a popular blog or news article. Use everyday Hindi, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Hindi text, nothing else.
:\n\n${text}.`;

  }
  else if(content === "titleTelugu"){
    prompt =`Translate the following English text into clear, natural, fluent, and modern Telugu — as it would appear in a popular blog or news article. Use everyday Telugu, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Telugu text, nothing else.
:\n\n${text}.`
  }
  else if(content === "titleHindi"){
    prompt = `Translate the following English text into clear, natural, fluent, and modern Hindi — as it would appear in a popular blog or news article. Use everyday Hindi, avoid overly formal or literal translations, and maintain a smooth, native tone. Just return the translated Hindi text, nothing else.
:\n\n${text}.`
  }
  // Add more conditions if needed
  // else if (content === "shorthindi") { ... }

  try {
    const response = await fetch(
      `${GEMINI_BASE_URL}v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (error) {
    console.error(`Translation (${language}) error:`, error);
    return "";
  }
};


const [images, setImages] = useState([]);

// const handleGenerateImages = async () => {
//   const result = await generateImagesFromPrompt(title); // or any prompt
//   setImages(result);
// };

// const generateImagesFromPrompt = async (prompt) => {
//   const url = `${GEMINI_BASE_URL}v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [
//         { role: "user", parts: [{ text: `Give me 4 unique image descriptions for: ${prompt}` }] }
//       ]
//     })
//   });

//   const data = await response.json();
//   return data?.candidates?.[0]?.content?.parts?.[0]?.text?.split("\n") || [];
// };


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

  //posting image in aws and posting page detials in fire store and mongodb
const handleSubmit = async () => {
  if (!title || !matter || !longmatter) {
    alert("Please fill in all required fields");
    return;
  }

  settotaloading(true);
  let uploadedImageUrl = imageUrl;

  if (imageUrl && croppedAreaPixels) {
    try {
      const { blob } = await getCroppedImage(imageUrl, croppedAreaPixels);
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${backend_URL2}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploadedImageUrl = data.url || "";
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  if (uploadedImageUrl && uploadedImageUrl.startsWith("data:image")) {
    try {
      const compressedBase64 = await compressImage(uploadedImageUrl, 500);
      const file = dataURLtoFile(compressedBase64, "generated.jpg");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${backend_URL2}/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      uploadedImageUrl = data.url || "";
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const payload = {
    pageNumber,
    title: title || "Untitled",
    matter: matter || "No content",
    longmatter: longmatter || "No content",
    titleTelugu: titleTelugu || "No content",
    matterTelugu: matterTelugu || "No content",
    longmatterTelugu: longmatterTelugu || "No content",
    titleHindi: titleHindi || "No content",
    matterHindi: matterHindi || "No content",
    longmatterHindi: longmatterHindi || "No content",
    imageUrl: uploadedImageUrl || "",
    category: selectedPageCategory || "No Category",
    level: level || "simple",
    update: updateField || "false",
    place: "India",
  };

  try {
    // Post to both APIs
    await Promise.all([
      fetch(`${backend_URL3}/api/${selectedPageCategory}page/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      fetch(`${backend_URL2}/api/realpages/create/${selectedPageCategory}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    ]);

    setSuccessMessage("Page data submitted successfully!");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setSuccessMessage(""), 3000);

    // Delete the question automatically
    if (currentQuestionId) {
      try {
        await fetch(`${BASE_URL}/api/randomquestions/delete/${currentQuestionId}`, {
          method: "DELETE",
        });
        console.log(`Question ${currentQuestionId} deleted successfully.`);
      } catch (deleteErr) {
        console.error("Auto-delete failed:", deleteErr);
      }
    }

    // Refresh category questions
    fetchCategoryQuestions(selectedPageCategory);

  } catch (error) {
    console.error("Error submitting data:", error);
    alert("Submission failed!");
  } finally {
    settotaloading(false);
  }
};


const getCroppedImage = (imageSrc, crop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Enforce 2:1 ratio
      let cropWidth = crop.width;
      let cropHeight = crop.width / 4; // 2:1 ratio

      // Ensure crop doesn't go outside image
      if (crop.y + cropHeight > image.height) {
        cropHeight = image.height - crop.y;
        cropWidth = cropHeight * 4;
      }
      if (crop.x + cropWidth > image.width) {
        cropWidth = image.width - crop.x;
        cropHeight = cropWidth / 4;
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpg';
        const fileUrl = URL.createObjectURL(blob);
        resolve({ blob, fileUrl });
      }, 'image/jpeg');
    };
    image.onerror = error => reject(error);
  });
};

// New states for Wikimedia
const [wikimediaResults, setWikimediaResults] = useState([]);
const [includeCelebs, setIncludeCelebs] = useState(false);

const celebrities = [
  "Priyanka Chopra",
  "Tom Cruise",
  "Shah Rukh Khan",
  "Angelina Jolie",
];

const buildWikimediaApiUrl = (q) => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `intitle:${q}`,
    gsrnamespace: "6",
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url",
    pithumbsize: "400",
    origin: "*",
  });
  return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
};

const fetchWikimediaImages = async (query) => {
  try {
    const res = await fetch(buildWikimediaApiUrl(query));
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];
    return Object.values(data.query.pages)
      .map(p => {
        const info = (p.imageinfo && p.imageinfo[0]) || {};
        return {
          id: p.pageid,
          title: p.title,
          thumb: info.thumburl || info.url || null,
          sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title)}`,
        };
      })
      .filter(r => r.thumb);
  } catch (err) {
    console.error("Wikimedia fetch failed", err);
    return [];
  }
};

useEffect(() => {
  if (!title) {
    setWikimediaResults([]);
    return;
  }

  const fetchImages = async () => {
    let queries = [title];
    if (includeCelebs) queries = [...queries, ...celebrities];

    const allResults = [];
    for (const q of queries) {
      const items = await fetchWikimediaImages(q);
      allResults.push(...items);
    }
    setWikimediaResults(allResults);
  };

  fetchImages();
}, [title, includeCelebs]);




//fetch images from googel based on the title
// Add this inside CreatePageTab, below your other state variables

// Unsplash API
const UNSPLASH_ACCESS_KEY = "y94_AOhsoxMo6A8JIq6hGPgGhxHR-nEuVHT9FBWVa2E";

const fetchUnsplashImages = async (query) => {
  if (!query) return [];
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=30`
    );
    const data = await res.json();
    return data.results.map(img => img.urls.small);
  } catch (err) {
    console.error("Unsplash fetch failed:", err);
    return [];
  }
};

// Trigger Unsplash search whenever the title changes
useEffect(() => {
  if (!title) {
    setFetchedImages([]);
    return;
  }

  const fetchImages = async () => {
    const imgs = await fetchUnsplashImages(title);
    setFetchedImages(imgs); // Replace old images
  };

  fetchImages();
}, [title]);




  useEffect(() => {
    if (selectedPageCategory) {
      fetchCategoryQuestions(selectedPageCategory);
    }
  }, [selectedPageCategory]);


  //fetching questions from mongodb
  const fetchCategoryQuestions = async (category) => {
    try {

      setMatter(" ");
      setLongmatter(" ");
      setTitle(" ");
      setTitleTelugu(" ");
      setTitleHindi(" ");
      setMatterTelugu(" ");
      setLongmatterTelugu(" ");
      setMatterHindi(" ");
      setLongmatterHindi(" ");
      
      const response = await fetch(`${backend_URL}/api/randomquestions/random/${category}`);
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

  //
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


  const prompts = [
    "explain more",
    "in programming",
    "name, ceo, year, hq, industry, products, company estimated Net Worth and Company Purpose explain",
    "explain this software",
    "Why is this software used",
    "explain in simple words",
    "biography",
    "history",
    "explain in points wise",
    "simple explanation with out caluclations",
  ];
 const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropAndSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
    setCroppedImage(croppedImg);
    setCropping(false);
  };

return (
  <div className="tab-content">
    {/* Category Selector */}
    <div style={{ marginBottom: "10px" }}>
      <label>Select Category: </label>
      <select
        value={selectedPageCategory}
        onChange={(e) => setSelectedPageCategory(e.target.value)}
      >
        <option value="general">-- Select --</option>
        <option value="general">General</option>
        <option value="Computer">Computer</option>
        <option value="Science">Science</option>
        <option value="space">Space</option>
        <option value="history">History</option>
        <option value="sports">Sports</option>
        <option value="Movies">Biography</option>
        <option value="gk">Gk</option>
        <option value="reasoning">Reasoning</option>
        <option value="english">English</option>
        <option value="environment">Environment</option>
        <option value="food">Food</option>
        <option value="technology">Technology</option>
        <option value="current">Current Affairs</option>
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

    {/* Retrieved Questions */}
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

    {/* Title, Category Reload, Delete, Level */}
    <div className="input-row"><br />
      <label className="input-label">Title:</label><br /><br />
      <input
        type="text"
        className="text-field"
        placeholder="English Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="icon-button button change"
        onClick={() => fetchCategoryQuestions(selectedPageCategory)}
      >
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

    {/* Translations */}
    <div className="translation-row">
      <input
        type="text"
        className="title-field"
        placeholder="Title (Telugu)"
        value={titleTelugu}
        onChange={(e) => setTitleTelugu(e.target.value)}
      />
      <button onClick={() => handleTranslate(title, "Telugu", setTitleTelugu,"titleTelugu")} className="icon-button button">
        &#8635;
      </button>

      <input
        type="text"
        className="title-field"
        placeholder="Title (Hindi)"
        value={titleHindi}
        onChange={(e) => setTitleHindi(e.target.value)}
      />
      <button onClick={() => handleTranslate(title, "Hindi", setTitleHindi,"titleHindi")} className="icon-button button">
        &#8635;
      </button>
    </div>

    {/* Matter Sections */}
    <div className="matter-section">
      {/* English */}
      <div className="matter-column">
        <label>Matter:</label>

       <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <textarea
          className="matter-input"
          value={matter}
          onChange={(e) => setMatter(e.target.value)}
          rows={2}
        />
              <button
                  onClick={() =>
                    handleExplain(
                      `${selectedPrompt ? selectedPrompt + ": " : ""}${title}`,
                      setMatter,
                      "English",
                      "short",
                      "shortEng"
                    )
                  }
                >
                  {loading.shortEng ? "Generating..." : "AI Explanation (Short)"}
                </button>

        <label>Long Matter:</label>

        <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <textarea
          className="matter-input"
          value={longmatter}
          onChange={(e) => setLongmatter(e.target.value)}
          rows={4}
        />
        <button
            onClick={() =>
              handleExplain(
                `${selectedLongPrompt ? selectedLongPrompt + ": " : ""}${title}`,
                setLongmatter,
                "English",
                "long",
                "longEng"
              )
            }
          >
            {loading.longEng ? "Generating..." : "AI Explanation (Long)"}
          </button>
      </div>

      {/* Telugu */}
      <div className="matter-column">
        <label>Matter (Telugu):</label>

        <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>


        <textarea
          className="matter-input"
          value={matterTelugu}
          onChange={(e) => setMatterTelugu(e.target.value)}
          rows={2}
        />
        <button
          onClick={() => handleExplain(matter, setMatterTelugu, "Telugu", "short")}
        >
          {loading.shortTel ? "Generating..." : "AI Explanation (Short - Telugu)"}
        </button>

        <label>Long Matter (Telugu):</label>

       <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <textarea
          className="matter-input"
          value={longmatterTelugu}
          onChange={(e) => setLongmatterTelugu(e.target.value)}
          rows={4}
        />
        <button
          onClick={() => handleExplain(matter, setLongmatterTelugu, "Telugu", "long")}
        >
          {loading.longTel ? "Generating..." : "AI Explanation (Long - Telugu)"}
        </button>
      </div>

      {/* Hindi */}
      <div className="matter-column">
        <label>Matter (Hindi):</label>

        <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <textarea
          className="matter-input"
          value={matterHindi}
          onChange={(e) => setMatterHindi(e.target.value)}
          rows={2}
        />
        <button
          onClick={() => handleExplain(matter, setMatterHindi, "Hindi", "short")}
        >
          {loading.shortHin ? "Generating..." : "AI Explanation (Short - Hindi)"}
        </button>

        <label>Long Matter (Hindi):</label>

       <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)}>
          <option value="" disabled>— Select Prompt —</option>
          {prompts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <textarea
          className="matter-input"
          value={longmatterHindi}
          onChange={(e) => setLongmatterHindi(e.target.value)}
          rows={4}
        />
        <button
          onClick={() => handleExplain(matter, setLongmatterHindi, "Hindi", "long")}
        >
          {loading.longHin ? "Generating..." : "AI Explanation (Long - Hindi)"}
        </button>
      </div>
    </div>

<div className="image-section">
  <div className="image-controls">
    <button className="ai-button" onClick={handleAIImage}>
      {loading.image ? "Generating..." : "AI Creation (4 Images)"}
    </button>
    <label>URL:</label>
    <input
      type="text"
      className="image-url-input"
      placeholder="Enter or paste image URL"
      value={imageUrl}
      onChange={handleImageUrlChange}
    />
    {/* <label className="upload-button">
      Select */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImageFile(file); // store the File object
            const reader = new FileReader();
            reader.onloadend = () => setImageUrl(reader.result); // show preview
            reader.readAsDataURL(file);
          }
        }}
      />
    {/* </label> */}
  </div>

  <div className="image-frame-grid">
    {images.length > 0 ? (
      images.map((img, index) => (
        <div
          key={index}
          className="image-frame-clickable"
          onClick={() => setImageUrl(img)}
        >
          <img src={img} alt={`Generated ${index + 1}`} />
        </div>
      ))
    ) : (
      <p>No AI images generated yet</p>
    )}
  </div>


<div className="unsplash-gallery ">
  <h4>UNSPLASH Images for "{title}"</h4>
  <div className="image-frame-grid">
    {fetchedImages.length > 0 ? (
      fetchedImages.map((img, index) => (
        <div
          key={index}
          className={`image-frame-clickable ${selectedImage === img ? "selected" : ""}`}
          onClick={() => {
            setImageUrl(img); // set as selected
            setSelectedImage(img);
          }}
        >
          <img src={img} alt={`Unsplash ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
        </div>
      ))
    ) : (
      <p>No images found for this title</p>
    )}
  </div>
</div>

{/* Toggle Wikimedia celebrity mode */}
<label style={{ display: "flex", gap: 8, alignItems: "center", margin: "10px 0" }}>
  <input
    type="checkbox"
    checked={includeCelebs}
    onChange={(e) => setIncludeCelebs(e.target.checked)}
  />
  Include celebrities in Wikimedia search
</label>

{/* Wikimedia Images */}
<div className="image-frame-grid">
  {wikimediaResults.map((r) => (
    <a key={r.id} rel="noreferrer">
      <img
        src={r.thumb}
        alt={r.title}
        style={{
          width: "100%",
          height: 180,
          borderRadius: 8,
          cursor: "pointer",
          border: selectedImage === r.thumb ? "3px solid blue" : "1px solid #ccc"
        }}
        onClick={() => setImageUrl(r.thumb)} 
      />
    </a>
  ))}
</div>







  <div className="selected-image-preview">
    {imageUrl && <img src={imageUrl} alt="Selected" className="preview-image" />}
  </div>
</div>

<div style={{width:"70%",height:"50%",alignContent:"center" }}>
{imageUrl && showCropper && (
  <div className="crop-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
    <Cropper
      image={imageUrl}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3} // or any ratio
      onCropChange={setCrop}
      onZoomChange={setZoom}
      onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
    />
  </div>
)}
<button onClick={() => setShowCropper(true)}>Crop Image</button>



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
          <div style={{ position: "relative", width: 300, height: 300, background: "#000" }}>
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
              onClick={handleCropAndSave}
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
 {croppedImage && (
        <div style={{ marginTop: 20 }}>
          <h3>Cropped Image Preview</h3>
          <img
            src={croppedImage}
            alt="Cropped Preview"
            style={{ width: 300, borderRadius: 8 }}
          />
        </div>
      )}
  </div>

    {/* Submit */}
    <button onClick={handleSubmit} style={{ padding: "8px 16px", marginTop: "15px" }}>
      {!totlaloading ? "Submit Page Data" : "Loading"
      }
    </button>
  </div>
);

};

export default CreatePageTab;  
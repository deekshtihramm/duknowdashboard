import React, { useRef, useState, useEffect } from "react";
import NewHeader from "./newHeader";
import NewSidebar from "./newSidebar";
import "./UserDetails.css";
import image1 from '../images/IMG-20250917-WA0026.jpg';
import image2 from '../images/IMG-20250917-WA0027.jpg';
import image3 from '../images/IMG-20250917-WA0028.jpg';
import image4 from '../images/IMG-20250917-WA0029.jpg';
import image5 from '../images/IMG-20250917-WA0030.jpg';
import image6 from '../images/IMG-20250917-WA0027.jpg';
import image7 from '../images/IMG-20250917-WA0031.jpg';
import image8 from '../images/IMG-20250917-WA0032.jpg';
import image10 from '../images/IMG-20250917-WA0034.jpg';
import image11 from '../images/IMG-20250917-WA0035.jpg';
import image12 from '../images/IMG-20250917-WA0036.jpg';
import image13 from '../images/IMG-20250917-WA0037.jpg';
import image14 from '../images/IMG-20250917-WA0038.jpg';
import image15 from '../images/IMG-20250917-WA0039.jpg';
import image16 from '../images/IMG-20250917-WA0040.jpg';
import image18 from '../images/IMG-20250917-WA0042.jpg';
import image20 from '../images/IMG-20250917-WA0044.jpg';
import image21 from '../images/IMG-20250917-WA0045.jpg';
import image22 from '../images/IMG-20250917-WA0046.jpg';
import image23 from '../images/IMG-20250917-WA0047.jpg';
import image24 from '../images/IMG-20250917-WA0048.jpg';
import image25 from '../images/IMG-20250917-WA0049.jpg';
import image26 from '../images/IMG-20250917-WA0050.jpg';
import image27 from '../images/IMG-20250917-WA0051.jpg';
import image28 from '../images/IMG-20250917-WA0052.jpg';
import image33 from '../images/IMG-20250917-WA0057.jpg';
import image34 from '../images/IMG-20250917-WA0058.jpg';
import image38 from '../images/IMG-20250917-WA0062.jpg';
import image39 from '../images/IMG-20250917-WA0063.jpg';
import image41 from '../images/IMG-20250917-WA0065.jpg';
import image46 from '../images/IMG-20250917-WA0070.jpg';
import image47 from '../images/IMG-20250917-WA0071.jpg';
import image48 from '../images/IMG-20250917-WA0072.jpg';
import image49 from '../images/IMG-20250917-WA0073.jpg';
import image50 from '../images/IMG-20250917-WA0074.jpg';
import image51 from '../images/IMG-20250917-WA0075.jpg';
import image52 from '../images/IMG-20250917-WA0076.jpg';
import image53 from '../images/IMG-20250917-WA0077.jpg';
import image54 from '../images/IMG-20250917-WA0078.jpg';




    
    const DEFAULT_CANVAS = { width: 1200, height: 630 }; // default poster size
    
    const fontList = [
      "Arial",
      "Verdana",
      "Tahoma",
      "Trebuchet MS",
      "Georgia",
      "Times New Roman",
      "Courier New",
      "Lucida Console",
      "Impact",
      "Comic Sans MS",
      "Segoe UI",
      "Helvetica",
      "Garamond",
      "Palatino",
      "Brush Script MT",
    ];
    
    const stickerList = ["⭐", "🔥", "✅", "🎯", "💡", "📌", "✨", "🖼️", "🚀"];
    
const AdvancedTextToImage = () => {
      const canvasRef = useRef(null);
      const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS);
    
      // Text states
      const [text, setText] = useState("Hi DuKnow \nCreate awesome Image!");
      const [fontFamily, setFontFamily] = useState("Georgia");
      const [fontSize, setFontSize] = useState(64);
      const [fontColor, setFontColor] = useState("#111111");
      const [isBold, setIsBold] = useState(true);
      const [isItalic, setIsItalic] = useState(false);
      const [textAlign, setTextAlign] = useState("center"); // left, center, right
      const [lineHeight, setLineHeight] = useState(1.1);
    
      // Position & rotation
      const [textX, setTextX] = useState(canvasSize.width / 2);
      const [textY, setTextY] = useState(canvasSize.height / 2);
      const [angle, setAngle] = useState(0); // degrees
    
      // Effects
      const [useShadow, setUseShadow] = useState(true);
      const [shadowColor, setShadowColor] = useState("rgba(0,0,0,0.4)");
      const [shadowOffsetX, setShadowOffsetX] = useState(6);
      const [shadowOffsetY, setShadowOffsetY] = useState(6);
      const [shadowBlur, setShadowBlur] = useState(10);
    
      const [useStroke, setUseStroke] = useState(false);
      const [strokeColor, setStrokeColor] = useState("#000000");
      const [strokeWidth, setStrokeWidth] = useState(3);
    
      // Background
      const [bgMode, setBgMode] = useState("solid"); // solid | linear | radial | image
      const [bgColor, setBgColor] = useState("#ffffff");
      const [bgColor2, setBgColor2] = useState("#87cefa"); // for gradients
      const [bgAngle, setBgAngle] = useState(45); // degrees for linear gradient
      const [bgImageFile, setBgImageFile] = useState(null);
      const [bgImageObjectURL, setBgImageObjectURL] = useState(null);
      const [bgFilterBlur, setBgFilterBlur] = useState(0);
      const [bgFilterBrightness, setBgFilterBrightness] = useState(100); // percent
    
      // Stickers
      const [stickers, setStickers] = useState([]); // {id, emoji, x, y, size}
      const [selectedStickerId, setSelectedStickerId] = useState(null);
    
      // Misc
      const [imageUrl, setImageUrl] = useState("");
      const [isDraggingText, setIsDraggingText] = useState(false);
      const [isDraggingSticker, setIsDraggingSticker] = useState(false);
    
      // internal drag trackers
      const dragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, type: null, stickerId: null });
    
      // Update objectURL when bgImageFile changes
     // --- Add this near top ---
const defaultBgImages = [
  `${image1}`,
  `${image2}`,
  `${image3}`,
  `${image4}`,
  `${image5}`,
  `${image6}`,
  `${image7}`,
  `${image8}`,
  `${image10}`,
  `${image11}`,
  `${image12}`,
  `${image13}`,
  `${image14}`,
  `${image15}`,
  `${image16}`,
  `${image18}`,
  `${image20}`,
  `${image21}`,
  `${image22}`,
  `${image23}`,
  `${image24}`,
  `${image25}`,
  `${image26}`,
  `${image27}`,
  `${image28}`,
  `${image33}`,
  `${image34}`,
  `${image38}`,
  `${image39}`,
  `${image41}`,
  `${image46}`,
  `${image47}`,
  `${image48}`,
  `${image49}`,
  `${image50}`,
  `${image51}`,
  `${image52}`,
  `${image53}`,
  `${image54}`,
];

// ---- Inside Component ----

// state add cheyyali
const [selectedDefaultBg, setSelectedDefaultBg] = useState(defaultBgImages[0]);

// update useEffect for bgImageObjectURL
useEffect(() => {
  if (bgImageFile) {
    const url = URL.createObjectURL(bgImageFile);
    setBgImageObjectURL(url);
    return () => URL.revokeObjectURL(url);
  } else if (selectedDefaultBg) {
    setBgImageObjectURL(selectedDefaultBg);
  } else {
    setBgImageObjectURL(null);
  }
}, [bgImageFile, selectedDefaultBg]);

      // Draw function
      const draw = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
    
        // set real canvas size (pixel size)
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
    
        // clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // apply background filters via an offscreen draw if using image
        // Draw background
        if (bgMode === "image" && bgImageObjectURL) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = bgImageObjectURL;
          await new Promise((resolve) => {
            img.onload = () => {
              // optionally apply fit/cover: we'll cover entire canvas
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              // apply basic filters (blur/brightness) via globalComposite? canvas doesn't have CSS filters directly --
              // We'll simulate brightness by drawing a translucent white/black layer if needed.
              if (bgFilterBrightness !== 100) {
                const brightnessFactor = bgFilterBrightness / 100;
                ctx.globalCompositeOperation = "source-atop";
                ctx.fillStyle = `rgba(255,255,255,${1 - brightnessFactor})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "source-over";
              }
              // blur can't be applied easily without CSS filters; we skip heavy blur here (could use stackblur library).
              resolve();
            };
            img.onerror = () => resolve();
          });
        } else if (bgMode === "linear") {
          const rad = (bgAngle * Math.PI) / 180;
          // representation: create gradient across diagonal using angle
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          const len = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
          const x1 = cx + Math.cos(rad + Math.PI) * len;
          const y1 = cy + Math.sin(rad + Math.PI) * len;
          const x2 = cx + Math.cos(rad) * len;
          const y2 = cy + Math.sin(rad) * len;
          const g = ctx.createLinearGradient(x1, y1, x2, y2);
          g.addColorStop(0, bgColor);
          g.addColorStop(1, bgColor2);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (bgMode === "radial") {
          const g = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            10,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height)
          );
          g.addColorStop(0, bgColor);
          g.addColorStop(1, bgColor2);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // solid
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
        // Draw stickers (below text)
        for (const s of stickers) {
          ctx.save();
          ctx.font = `${s.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(s.emoji, s.x, s.y);
          ctx.restore();
        }
    
        // Draw text with rotation + effects
        ctx.save();
        // move origin to textX/textY
        ctx.translate(textX, textY);
        ctx.rotate((angle * Math.PI) / 180);
    
        // Build font style
        const fontStyle = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${fontSize}px ${fontFamily}`;
        ctx.font = fontStyle;
        ctx.fillStyle = fontColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = "middle";
    
        // shadow
        if (useShadow) {
          ctx.shadowColor = shadowColor;
          ctx.shadowOffsetX = shadowOffsetX;
          ctx.shadowOffsetY = shadowOffsetY;
          ctx.shadowBlur = shadowBlur;
        } else {
          ctx.shadowColor = "transparent";
        }
    
        // split lines and autoscale if needed
        const lines = text.split("\n");
        const padding = 60; // safe padding both sides
        const maxWidth = Math.max(50, canvas.width - padding * 2);
        let effectiveFontSize = fontSize;
    
        // Autoscale loop: reduce font size until all lines fit (only if too wide)
        // We'll measure with a temporary font size variable
        const measureFits = (fs) => {
          ctx.font = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${fs}px ${fontFamily}`;
          for (let line of lines) {
            const m = ctx.measureText(line);
            if (m.width > maxWidth) return false;
          }
          return true;
        };
    
        // If any line is too wide, reduce font size until fits or min size
        if (!measureFits(effectiveFontSize)) {
          let fs = effectiveFontSize;
          while (fs > 8 && !measureFits(fs)) {
            fs = Math.floor(fs * 0.95);
          }
          effectiveFontSize = Math.max(8, fs);
        }
    
        // apply that font
        ctx.font = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${effectiveFontSize}px ${fontFamily}`;
    
        // compute multi-line block height
        const measured = ctx.measureText("M"); // for rough height
        const approxLineHeight = effectiveFontSize * lineHeight;
        const blockHeight = approxLineHeight * lines.length;
    
        // vertical starting point (centered around origin)
        const startY = -blockHeight / 2 + approxLineHeight / 2;
    
        // draw lines
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const y = startY + i * approxLineHeight;
          // fill
          ctx.fillText(line, 0, y);
          // stroke
          if (useStroke) {
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = strokeColor;
            ctx.strokeText(line, 0, y);
          }
        }
    
        ctx.restore();
        // done
      };
    
      // redraw on state changes
      useEffect(() => {
        draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        text,
        fontFamily,
        fontSize,
        fontColor,
        isBold,
        isItalic,
        textAlign,
        lineHeight,
        textX,
        textY,
        angle,
        useShadow,
        shadowColor,
        shadowOffsetX,
        shadowOffsetY,
        shadowBlur,
        useStroke,
        strokeColor,
        strokeWidth,
        bgMode,
        bgColor,
        bgColor2,
        bgImageObjectURL,
        stickers,
        canvasSize,
      ]);
    
      // Mouse handlers for dragging text and stickers
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const getMousePos = (evt) => {
          const rect = canvas.getBoundingClientRect();
          return {
            x: ((evt.clientX - rect.left) / rect.width) * canvas.width,
            y: ((evt.clientY - rect.top) / rect.height) * canvas.height,
          };
        };
    
        const isInsideText = (mx, my) => {
          // Transform mouse point into text local coordinates by reversing translate & rotate
          const cx = mx - textX;
          const cy = my - textY;
          const rad = (-angle * Math.PI) / 180; // reverse rotate
          const lx = cx * Math.cos(rad) - cy * Math.sin(rad);
          const ly = cx * Math.sin(rad) + cy * Math.cos(rad);
    
          // approximate bounding box:
          const ctx = canvas.getContext("2d");
          ctx.font = `${isItalic ? "italic " : ""}${isBold ? "bold " : ""}${fontSize}px ${fontFamily}`;
          const lines = text.split("\n");
          const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));
          const h = fontSize * lineHeight * lines.length;
          // textAlign influences x dims; we approximate with centered box width = maxW
          const left = -maxW / 2 - 10;
          const right = maxW / 2 + 10;
          const top = -h / 2 - 10;
          const bottom = h / 2 + 10;
          return lx >= left && lx <= right && ly >= top && ly <= bottom;
        };
    
        const findStickerAt = (mx, my) => {
          for (let i = stickers.length - 1; i >= 0; i--) {
            const s = stickers[i];
            const dx = mx - s.x;
            const dy = my - s.y;
            const r = s.size / 2 + 8;
            if (dx * dx + dy * dy <= r * r) return s.id;
          }
          return null;
        };
    
        const onMouseDown = (e) => {
          const pos = getMousePos(e);
          // check sticker first
          const stId = findStickerAt(pos.x, pos.y);
          if (stId) {
            dragRef.current = { startX: pos.x, startY: pos.y, originX: 0, originY: 0, type: "sticker", stickerId: stId };
            const s = stickers.find((s) => s.id === stId);
            dragRef.current.originX = s.x;
            dragRef.current.originY = s.y;
            setIsDraggingSticker(true);
            setSelectedStickerId(stId);
            return;
          }
          // check text area
          if (isInsideText(pos.x, pos.y)) {
            dragRef.current = { startX: pos.x, startY: pos.y, originX: textX, originY: textY, type: "text", stickerId: null };
            setIsDraggingText(true);
            return;
          }
          // else clear selection
          setSelectedStickerId(null);
        };
    
        const onMouseMove = (e) => {
          if (!dragRef.current.type) return;
          const pos = getMousePos(e);
          const dx = pos.x - dragRef.current.startX;
          const dy = pos.y - dragRef.current.startY;
          if (dragRef.current.type === "text") {
            setTextX(dragRef.current.originX + dx);
            setTextY(dragRef.current.originY + dy);
          } else if (dragRef.current.type === "sticker") {
            setStickers((prev) =>
              prev.map((s) => (s.id === dragRef.current.stickerId ? { ...s, x: dragRef.current.originX + dx, y: dragRef.current.originY + dy } : s))
            );
          }
        };
    
        const onMouseUp = () => {
          dragRef.current = { startX: 0, startY: 0, originX: 0, originY: 0, type: null, stickerId: null };
          setIsDraggingText(false);
          setIsDraggingSticker(false);
        };
    
        canvas.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    
        // cleanup
        return () => {
          canvas.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [textX, textY, angle, stickers, fontSize, isBold, isItalic, fontFamily, text, lineHeight]);
    
      // Add sticker
      const addSticker = (emoji) => {
        const id = Date.now() + Math.random().toString(36).slice(2, 7);
        setStickers((s) => [
          ...s,
          { id, emoji, x: canvasSize.width / 2 + Math.random() * 80 - 40, y: canvasSize.height / 2 + Math.random() * 80 - 40, size: 72 },
        ]);
      };
    
      const removeSticker = (id) => setStickers((s) => s.filter((x) => x.id !== id));
    
      // Download image
      const download = (type = "png") => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const mime = type === "jpg" ? "image/jpeg" : "image/png";
        const dataUrl = canvas.toDataURL(mime, type === "jpg" ? 0.92 : 1.0);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `text-image.${type === "jpg" ? "jpg" : "png"}`;
        link.click();
      };
    
      // Quick reset
      const resetAll = () => {
        setText("Hi Duknow \nCreate awesome images!");
        setFontFamily("Georgia");
        setFontSize(64);
        setFontColor("#111111");
        setIsBold(true);
        setIsItalic(false);
        setTextAlign("center");
        setTextX(DEFAULT_CANVAS.width / 2);
        setTextY(DEFAULT_CANVAS.height / 2);
        setAngle(0);
        setBgMode("solid");
        setBgColor("#ffffff");
        setBgColor2("#87cefa");
        setBgImageFile(null);
        setStickers([]);
      };
  const [isCollapsed, setIsCollapsed] = useState(true);


  return (
    <div className="user-details">
      <NewHeader />
      <div className="user-details-content" style={{ display: "flex" }}>
        <NewSidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <main
          className={`new-dashboard-main ${isCollapsed ? "collapsed" : ""}`}
          style={{ flex: 1, padding: "20px" }}
        >
 <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 12, boxSizing: "border-box" }}>
      <h2 style={{ margin: "6px 0" }}>Pro Text → Image Generator</h2>

      <div style={{ display: "flex", gap: 18 }}>
        {/* Left: controls */}
        <div style={{ width: 380, maxHeight: "140vh", overflowY: "auto", padding: 12, borderRadius: 8, border: "1px solid #eee" }}>
          <label style={{ fontWeight: "600" }}>Text (multi-line):</label>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6, boxSizing: "border-box", resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Font family</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ width: "100%", marginTop: 6 }}>
                {fontList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: 120 }}>
              <label>Font size</label>
              <input
                type="number"
                min={8}
                max={240}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: "100%", marginTop: 6 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
            <label>Color</label>
            <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
            <label style={{ marginLeft: 8 }}>
              <input type="checkbox" checked={isBold} onChange={() => setIsBold((v) => !v)} /> Bold
            </label>
            <label style={{ marginLeft: 8 }}>
              <input type="checkbox" checked={isItalic} onChange={() => setIsItalic((v) => !v)} /> Italic
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
            <label>Align</label>
            <select value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>

            <label style={{ marginLeft: 8 }}>Line height</label>
            <input type="number" step="0.05" min="0.8" max="2.5" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} style={{ width: 80 }} />
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div>
            <label style={{ fontWeight: 600 }}>Effects</label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <label>
                <input type="checkbox" checked={useShadow} onChange={() => setUseShadow((v) => !v)} /> Shadow
              </label>
              <label>
                <input type="checkbox" checked={useStroke} onChange={() => setUseStroke((v) => !v)} /> Outline
              </label>
            </div>

            {useShadow && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label>Shadow color</label>
                  <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <div>
                    <label>Offset X</label>
                    <input type="number" value={shadowOffsetX} onChange={(e) => setShadowOffsetX(Number(e.target.value))} style={{ width: 80 }} />
                  </div>
                  <div>
                    <label>Offset Y</label>
                    <input type="number" value={shadowOffsetY} onChange={(e) => setShadowOffsetY(Number(e.target.value))} style={{ width: 80 }} />
                  </div>
                  <div>
                    <label>Blur</label>
                    <input type="number" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} style={{ width: 80 }} />
                  </div>
                </div>
              </div>
            )}

            {useStroke && (
              <div style={{ marginTop: 8 }}>
                <label>Stroke color</label>
                <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
                <div style={{ marginTop: 6 }}>
                  <label>Stroke width</label>
                  <input type="number" min={1} max={20} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} style={{ width: 80 }} />
                </div>
              </div>
            )}
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div>
            <label style={{ fontWeight: 600 }}>Position & Rotation</label>
            <div style={{ marginTop: 8 }}>
              <label>Rotate (degrees)</label>
              <input type="range" min={-180} max={180} value={angle} onChange={(e) => setAngle(Number(e.target.value))} style={{ width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <small>{-180}</small>
                <small>{angle}°</small>
                <small>{180}</small>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <div>
                  <label>Text X</label>
                  <input type="number" value={Math.round(textX)} onChange={(e) => setTextX(Number(e.target.value))} style={{ width: 100 }} />
                </div>
                <div>
                  <label>Text Y</label>
                  <input type="number" value={Math.round(textY)} onChange={(e) => setTextY(Number(e.target.value))} style={{ width: 100 }} />
                </div>
              </div>

              <p style={{ marginTop: 6, fontSize: 12, color: "#555" }}>Or drag the text directly on canvas</p>
            </div>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div>
            <div>
              <label style={{ fontWeight: 600 }}>Background</label>
              <select
                value={bgMode}
                onChange={(e) => setBgMode(e.target.value)}
                style={{ marginLeft: 8 }}
              >
                <option value="solid">Solid</option>
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
                <option value="image">Image</option>
              </select>

              {bgMode === "solid" && (
                <div style={{ marginTop: 8 }}>
                  <label>Color</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ marginLeft: 8 }}
                  />
                </div>
              )}

              {bgMode === "linear" || bgMode === "radial" ? (
                <div style={{ marginTop: 8 }}>
                  <label>Color 1</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                  <label style={{ marginLeft: 8 }}>Color 2</label>
                  <input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} />
                  {bgMode === "linear" && (
                    <div style={{ marginTop: 8 }}>
                      <label>Angle</label>
                      <input
                        type="number"
                        value={bgAngle}
                        onChange={(e) => setBgAngle(Number(e.target.value))}
                        style={{ width: 80, marginLeft: 8 }}
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {bgMode === "image" && (
                <div style={{ marginTop: 8 }}>
                  <label>Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBgImageFile(e.target.files[0] || null)}
                  />

                  <p style={{ marginTop: 8 }}>Or choose default:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {defaultBgImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`bg${i}`}
                        onClick={() => {
                          setBgImageFile(null);
                          setSelectedDefaultBg(img);
                        }}
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                          cursor: "pointer",
                          border: selectedDefaultBg === img ? "2px solid blue" : "1px solid #ccc",
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <select value={bgMode} onChange={(e) => setBgMode(e.target.value)}>
                <option value="solid">Solid</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
                <option value="image">Image</option>
              </select>
              <label style={{ marginLeft: "8px" }}>Canvas size</label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "16:9") setCanvasSize({ width: 1200, height: 675 });
                  else if (val === "social") setCanvasSize({ width: 1080, height: 1080 });
                  else if (val === "story") setCanvasSize({ width: 1080, height: 1920 });
                  else setCanvasSize(DEFAULT_CANVAS);
                }}
              >
                <option value="default">1200 × 630</option>
                <option value="16:9">1200 × 675 (16:9)</option>
                <option value="social">1080 × 1080 (square)</option>
                <option value="story">1080 × 1920 (story)</option>
              </select>
            </div>

            <div style={{ marginTop: 8 }}>
              <label>Primary color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />

              {(bgMode === "linear" || bgMode === "radial") && (
                <>
                  <label style={{ marginLeft: 8 }}>Secondary color</label>
                  <input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} />
                </>
              )}

              {bgMode === "linear" && (
                <>
                  <label style={{ marginLeft: 8 }}>Angle</label>
                  <input type="number" value={bgAngle} onChange={(e) => setBgAngle(Number(e.target.value))} style={{ width: 80 }} />
                </>
              )}

              {bgMode === "image" && (
                <div style={{ marginTop: 8 }}>
                  <input type="file" accept="image/*" onChange={(e) => setBgImageFile(e.target.files?.[0] || null)} />
                  <div style={{ marginTop: 6 }}>
                    <label>Brightness</label>
                    <input type="range" min={50} max={150} value={bgFilterBrightness} onChange={(e) => setBgFilterBrightness(Number(e.target.value))} />
                    <label style={{ marginLeft: 8 }}>Blur (not applied heavily)</label>
                    <input type="range" min={0} max={20} value={bgFilterBlur} onChange={(e) => setBgFilterBlur(Number(e.target.value))} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div>
            <label style={{ fontWeight: 600 }}>Stickers</label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {stickerList.map((s) => (
                <button key={s} onClick={() => addSticker(s)} style={{ padding: 6, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
            {stickers.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <small>Click a sticker on canvas to select. Remove selected sticker:</small>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => selectedStickerId && removeSticker(selectedStickerId)} disabled={!selectedStickerId}>
                    Remove Selected
                  </button>
                  <button
                    onClick={() =>
                      setStickers((prev) =>
                        prev.map((s) => (s.id === selectedStickerId ? { ...s, size: Math.max(16, s.size - 8) } : s))
                      )
                    }
                    disabled={!selectedStickerId}
                    style={{ marginLeft: 6 }}
                  >
                    Shrink
                  </button>
                  <button
                    onClick={() =>
                      setStickers((prev) =>
                        prev.map((s) => (s.id === selectedStickerId ? { ...s, size: s.size + 8 } : s))
                      )
                    }
                    disabled={!selectedStickerId}
                    style={{ marginLeft: 6 }}
                  >
                    Enlarge
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => draw()}>Preview</button>
            <button onClick={() => download("png")}>Download PNG</button>
            <button onClick={() => download("jpg")}>Download JPG</button>
            <button onClick={resetAll}>Reset</button>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
            Tip: Drag the text or stickers on the canvas to position them. Use rotation slider for tilt.
          </div>
        </div>

        {/* Right: canvas preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: 6, overflow: "hidden", position: "relative" }}>
            <div style={{ background: "#f7f7f7", padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Preview</strong>
                <span style={{ marginLeft: 8, color: "#555", fontSize: 13 }}>{canvasSize.width} × {canvasSize.height}</span>
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>{isDraggingText ? "Dragging text..." : isDraggingSticker ? "Dragging sticker..." : "Click & drag on canvas"}</div>
            </div>

            <div style={{ background: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: 12 }}>
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                  width: "100%",
                  maxWidth: 900,
                  height: "auto",
                  display: "block",
                  border: "1px solid #ccc",
                  cursor: "move",
                  userSelect: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Generated Image</label>
            <div style={{ marginTop: 8 }}>
              <img src={canvasRef.current?.toDataURL?.() || ""} alt="generated" style={{ maxWidth: "100%", border: "1px solid #eee" }} />
            </div>
          </div>
        </div>
      </div>
    </div>         
        </main>
      </div>
    </div>
  );
};

export default AdvancedTextToImage;

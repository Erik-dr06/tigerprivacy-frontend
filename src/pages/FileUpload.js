import React, { useState, useContext, useEffect } from "react";
import JSZip from "jszip";
import { useNavigate } from "react-router-dom";
import GradientText from "../components/GradientText";
import BurgerMenu from "./BurgerMenu";
import Loader from "../Loader";
import { ThemeContext } from "../App";

export default function FileUpload() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sendToAI, setSendToAI] = useState(false); // AI usage set to false by default
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // Add this state variable
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);

  // Show welcome popup on component mount
  useEffect(() => {
    setShowWelcomePopup(true);
  }, []);

  // 🔧 Fix UTF-8 issues
  const fixUtf8String = (str) => {
    try {
      const bytes = str.replace(/\\u00([\da-f]{2})/gi, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
      return new TextDecoder("utf-8").decode(
        Uint8Array.from(bytes, (c) => c.charCodeAt(0))
      );
    } catch {
      return str;
    }
  };

  const handleFileUpload = async (event) => {
    setError("");
    setName("");
    setMetrics(null);
    setLoading(true);
    setProgress(0);

    const file = event.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }

    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file containing the required HTML or JSON file.");
      setLoading(false);
      return;
    }

    try {
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Remove the "messages/" folder entirely to reduce memory and processing time
      Object.keys(zip.files).forEach((filename) => {
        if (filename.startsWith("your_instagram_activity/messages/")) {
          delete zip.files[filename];
        }
      });

      const htmlPath = "personal_information/personal_information/personal_information.html";
      const jsonPath = "personal_information/personal_information/personal_information.json";

      let nameValue = "";

      setProgress(50);
      const jsonFile = zip.file(jsonPath);
      if (jsonFile) {
        const binaryData = await jsonFile.async("uint8array");
        const decoded = new TextDecoder("utf-8").decode(binaryData);
        const data = JSON.parse(decoded);

        let nameFromJson =
          data?.profile_user?.[0]?.string_map_data?.Name?.value || "";
        let usernameFromJson =
          data?.profile_user?.[0]?.string_map_data?.Username?.value || "";

        nameFromJson = fixUtf8String(nameFromJson);
        usernameFromJson = fixUtf8String(usernameFromJson);

        if (nameFromJson) {
          nameValue = nameFromJson;
        } else if (usernameFromJson) {
          nameValue = usernameFromJson;
        } else {
          setError("JSON file found, but neither 'Name' nor 'Username' field could be found.");
        }
      } else {
        const htmlFile = zip.file(htmlPath);
        if (htmlFile) {
          const htmlContent = await htmlFile.async("text");
          const regex =
            /<td\s+colspan=["']2["']\s+class=["']_2pin\s+_a6_q["']>\s*Name\s*<div>\s*<div>(.*?)<\/div>/i;
          const match = htmlContent.match(regex);

          if (match && match[1]) {
            nameValue = match[1].trim();
          } else {
            setError("Could not find a name in the HTML file.");
          }
        } else {
          setError("Neither HTML nor JSON personal_information file found in the ZIP.");
        }
      }

      if (nameValue) setName(nameValue);

      //Create a smaller ZIP without "your_instagram_activity/messages/"
      const newZip = new JSZip();
      for (const [filename, entry] of Object.entries(zip.files)) {
        if (!filename.startsWith("your_instagram_activity/messages/")) {
          console.log("Found /messages/");
          const content = await entry.async("arraybuffer");
          newZip.file(filename, content);
        }
      }

      setProgress(70);
      const optimizedBlob = await newZip.generateAsync({ type: "blob" });
      const optimizedFile = new File(
        [optimizedBlob],
        file.name.replace(".zip", "_no_messages.zip"),
        { type: "application/zip" }
      );

      const formData = new FormData();
      formData.append("zipfile", optimizedFile);
      formData.append("sendToAI", sendToAI ? "true" : "false");

      setProgress(85);
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(95);
      const result = await response.json();

      if (result.success) {
        setMetrics(result.aggregated);
        setProgress(100);

        //Navigate to ViewData page with the parsed data
        setTimeout(() => {
          navigate("/viewdata", { state: { metrics: result.aggregated, name: nameValue } });
        }, 500);
      } else {
        setError(result.error || "Failed to process metrics");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error reading or processing the ZIP file.");
      setLoading(false);
    }
  };

  // 🧩 Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload({ target: { files: [file] } });
  };

  // Welcome Popup Component
  const WelcomePopup = () => {
    if (!showWelcomePopup) return null;

    return (
      <div className={`popup-overlay ${theme}`}>
        <div className={`popup-content ${theme}`}>
          <button 
            className="close-button" 
            onClick={() => setShowWelcomePopup(false)}
            aria-label="Close welcome message"
          >
            &times;
          </button>
          <h3>AI Processing Notice</h3>
          <p>To provide accurate AI-generated summaries, certain portions of your data may be securely transmitted to OpenAI’s servers for processing.</p>
          <p>We only send the minimum information required, and no data is stored beyond what is necessary to generate your summary.</p>
          <button 
            className="got-it-button"
            onClick={() => setShowWelcomePopup(false)}
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <BurgerMenu />
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
      <center style={{ flex: 1, display: "flex", justifyContent: "center" }}>
       
          <h1
            className="upload-title"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Take Control of Your Digital Footprint
          </h1>
      </center>

        <button
          type="button"
          className="toggle-theme-btn"
          style={{ position: "absolute", top: "20px", right: "20px" }}
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
      <center>
        
        <p className="upload-subtitle">Please upload the .zip provided by Instagram</p>

        <button className="requestInfo" onClick={() => setShowPopup(true)}>
          How do I request my data?
        </button>

        // This is for the AI opt-in/out feature. Just shows the option and what you are opting into
        <div style={{ marginTop: "20px", marginBottom: "10px", textAlign: "center" }}>
          <label style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Enable AI summary (optional)
          </label>
          <p style={{ fontSize: "0.8rem", color: "#bbbbbb", marginTop: "4px" }}>
            When enabled, limited statistical data (not your photos or messages) is sent to OpenAI to generate a privacy summary.
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-zone${dragActive ? " active" : ""}`}
        >
          <p className="helper-text">Drag & drop the ZIP here or click below:</p>
          <label htmlFor="file-upload" className="file-label">
            📁 Choose ZIP File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="visually-hidden-input"
          />
        </div>

        {error && <p className="error-text">{error}</p>}
        {name && (
          <div className="hello-container">
            <p className="hello-text">
              <GradientText 
                text={`Hello, ${name}`}
                className="text-2xl font-bold"
              />
            </p>
          </div>
        )}
        
        {/* Replace the custom loading animation with Loader component */}
        {loading && (
          <Loader 
            loading={loading} 
            progress={progress}
            text="Processing your Instagram data..." 
          />
        )}
        
        {metrics && (
          <div className="metrics-container">
            <h3 className="metrics-title">Your Instagram Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4 className="metric-title metric-title--posts">Posts</h4>
                <p className="metric-value">{metrics.numPosts}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--stories">Stories</h4>
                <p className="metric-value">{metrics.numStories}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--reels">Reels</h4>
                <p className="metric-value">{metrics.numReels}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--followers">Followers</h4>
                <p className="metric-value">{metrics.numFollowers}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--following">Following</h4>
                <p className="metric-value">{metrics.numFollowing}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--pending">Pending Requests</h4>
                <p className="metric-value">{metrics.numPendingFollowRequests}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title">Recently Unfollowed</h4>
                <p className="metric-value">{metrics.numRecentlyUnfollowed}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title">Ads Clicked</h4>
                <p className="metric-value">{metrics.adsClicked}</p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--ads-viewed">Ads Viewed</h4>
                <p className="metric-value">{metrics.adsViewed}</p>
              </div>
            </div>

            {/* Locations of Interest */}
            {metrics.locationsOfInterest && metrics.locationsOfInterest.length > 0 && (
              <div className="locations-section">
                <h3 className="locations-title">Locations of Interest</h3>
                <ul className="locations-list">
                  {metrics.locationsOfInterest.map((loc, index) => (
                    <li key={index} className="location-item">
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recently Viewed Ads */}
            {Array.isArray(metrics.recentAdsViewed) && metrics.recentAdsViewed.length > 0 && (
              <div className="ads-section">
                <h3 className="ads-title">Recently Viewed Ads</h3>
                <ul className="ads-list">
                  {metrics.recentAdsViewed.slice(0, 5).map((ad, index) => {
                    const timestamp =
                      typeof ad.timestamp === "string"
                        ? Date.parse(ad.timestamp)
                        : ad.timestamp && ad.timestamp > 1e12
                        ? ad.timestamp
                        : ad.timestamp * 1000;

                    const formattedTime = timestamp
                      ? new Date(timestamp).toLocaleString()
                      : "Unknown time";

                    return (
                      <li key={index} className="ad-item">
                        <strong>
                          {ad.author && ad.author !== "Unknown" ? (
                            <a
                              href={`https://instagram.com/${ad.author}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {ad.author}
                            </a>
                          ) : (
                            ad.author || "Unknown Advertiser"
                          )}
                        </strong>{" "}
                        — {formattedTime}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ✅ Restored popup */}
        {showPopup && (
          <div className="popup-overlay" onClick={() => setShowPopup(false)}>
            <div
              className="popup-content glass rounded-2xl shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                How to Request Your Instagram Data
              </h2>
              <ol className="text-left text-muted-foreground mb-6 list-decimal list-inside space-y-2">
                <li><a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer">Follow this link to Instagram Accounts Center.</a></li>
                <li>Select <b>Create export</b>, then <b>Export to device.</b></li>
                <li>Click <b>Format</b>, and select the <b>JSON</b> option.</li>
                <li>Ensure <b>Date Range</b> is set to <b>All Time</b> for accuracy.</li>
                <li>Select <b>Start export</b>, and <b>enter your password</b>.</li>
                <li><a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer">After a few minutes, your data will be available to download at this link.</a></li>
              </ol>
              <button className="got-it" onClick={() => setShowPopup(false)}>
                Got it!
              </button>
            </div>
          </div>
        )}
      </center>
      <WelcomePopup /> 
    </div>
  );
}
import React, { useContext } from "react";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import SlidingNumber from "../components/SlidingNumber";
import PrivacyScore from "../components/PrivacyScore";
import LineChart from "../components/LineChart";
import AdvertisersGrid from "../components/AdvertisersGrid";
import AreasOfWeakness from "../components/AreasOfWeakness";
import AiPrivacyAdvice from "../components/AiPrivacyAdvice";
import tigerImg from "../assets/imagetwo.png";
import { ThemeContext } from "../App";


export default function ViewData() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  if (!state || !state.metrics) {
    // If user tries to access this page directly, redirect back
    return <Navigate to="/fileupload" replace />;
  }

  const { metrics, name } = state;

  return (
    <div className="ViewDataPage">
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 py-5 md:py-6 flex justify-between items-center">
          <div  onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src={tigerImg} alt="Tiger" className="w-8 h-8 md:w-10 md:h-10 inline-block align-middle text-primary" style={{ width: 55, height: 55 }} />
            <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight leading-none" style={{ color: '#f97316' }}>Tiger Privacy</span>
          </div>
          <button
            type="button"
            className="toggle-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>
      <center>
        <h1>Hello, {name}</h1>
        <h2>Your Instagram Metrics</h2>

        {metrics && (
          <div className="metrics-container">
            <h3 className="metrics-title">Your Instagram Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4 className="metric-title metric-title--posts">Posts</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numPosts} 
                    duration={1200} 
                    delay={100}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--stories">Stories</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numStories} 
                    duration={1200} 
                    delay={200}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--reels">Reels</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numReels} 
                    duration={1200} 
                    delay={300}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--followers">Followers</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numFollowers} 
                    duration={1200} 
                    delay={400}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--following">Following</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numFollowing} 
                    duration={1200} 
                    delay={500}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--pending">Pending Requests</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numPendingFollowRequests} 
                    duration={1200} 
                    delay={600}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--unfollowed">Recently Unfollowed</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.numRecentlyUnfollowed} 
                    duration={1200} 
                    delay={700}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--ads-clicked">Ads Clicked</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.adsClicked} 
                    duration={1200} 
                    delay={800}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--ads-viewed">Ads Viewed</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.adsViewed} 
                    duration={1200} 
                    delay={900}
                    className="metric-number"
                  />
                </p>
              </div>
              <div className="metric-card">
                <h4 className="metric-title metric-title--liked-posts">Liked Posts</h4>
                <p className="metric-value">
                  <SlidingNumber 
                    number={metrics.likedPosts} 
                    duration={1200} 
                    delay={1000}
                    className="metric-number"
                  />
                </p>
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

        <br/>
        <br/>
        <br/>
        <div className="analytics-row">
          <div className="analytics-item">
            <LineChart followerGainTimestamps={metrics.followerGainTimestamps} />
          </div>
          {typeof metrics.privacyScore === "number" && (
            <div className="analytics-item">
              <PrivacyScore score={metrics.privacyScore} />
            </div>
          )}
        </div>

        <br/>
        <br/>
        

        {metrics.areasOfWeakness && (
          <div style={{ marginTop: "2rem", maxWidth: 900 }}>
            <AreasOfWeakness areas={metrics.areasOfWeakness} />
          </div>
        )}

        {/* Advertisers Grid */}
        {metrics.advertisers && metrics.advertisers.length > 0 && (
          <div style={{ marginTop: "7rem" }}>
            <AdvertisersGrid advertisersData={metrics.advertisers} />
          </div>
        )}
        
        {/* AI Privacy Advice (assistant summary) */}
        <div style={{ marginTop: "2rem", maxWidth: 960 }}>
          <AiPrivacyAdvice
            message={metrics.aiMessage}
            metrics={{
              advertisers: metrics.advertisers,
              locationalDataTrue: metrics.locationalDataTrue,
              hasPhoneConfirmed: metrics.hasPhoneConfirmed,
              aiOptIn: metrics.aiOptIn,
              }}
              />
        </div>
        
        <Link
        to="/fileupload"
        className="back-button"
        onClick={() => window.scrollTo(0, 0)}
        >⬅ Back to Upload</Link>
        <br/>
        <br/>
      </center>
    </div>
  );
} 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eye from "../assets/images/eye.png";
import graph from "../assets/images/graph.png";
import lock from "../assets/images/lock.png";

export default function About() {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);

  const popupContent = {
    privacy: {
      title: "Privacy Visibility",
      description: "See exactly what data each platform has collected about you in one unified dashboard. Our advanced scanning technology analyzes your data exports to give you a comprehensive view of your digital footprint across all connected platforms.",
      features: [
        "Unified dashboard for all your data",
        "Cross-platform data aggregation",
        "Real-time privacy monitoring",
        "Historical data tracking"
      ]
    },
    risk: {
      title: "Risk Analysis",
      description: "Get a personalized privacy risk score and understand where you're most vulnerable. Our algorithm evaluates multiple factors to provide actionable insights about your digital security posture.",
      features: [
        "Personalized risk assessment",
        "Vulnerability identification",
        "Actionable security recommendations",
        "Risk trend analysis"
      ]
    },
    encryption: {
      title: "End-to-End Encryption",
      description: "Your data is encrypted client-side before it ever leaves your device. Total privacy guaranteed. We use military-grade encryption to ensure your personal information remains secure and private.",
      features: [
        "Client-side encryption",
        "Zero-knowledge architecture",
        "Military-grade security",
        "Local data processing"
      ]
    }
  };

  const styles = {
    aboutContainer: {
      minHeight: "100vh",
      padding: "20px",
      position: "relative"
    },
    backButton: {
      background: "linear-gradient(45deg, #3820d6, #5a31ec, #7a4cf0)",
      border: "none",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      marginBottom: "30px",
      transition: "all 0.3s ease",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(56, 32, 214, 0.3)"
    },
    aboutTitle: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      background: "linear-gradient(45deg, #3820d6, #5a31ec, #7a4cf0, #8061f3, #9083e9)",
      backgroundSize: "300% 300%",
      animation: "gradientShift 0.8s ease infinite",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },
    aboutSubtitle: {
      fontSize: "1.2rem",
      color: "#94a3b8",
      marginBottom: "3rem"
    },
    popupOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(10px)"
    },
    popupContent: {
      background: "linear-gradient(135deg, rgba(56, 32, 214, 0.1), rgba(90, 49, 236, 0.1))",
      padding: "40px",
      borderRadius: "20px",
      position: "relative",
      maxWidth: "600px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
    },
    closeButton: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      fontSize: "1.5rem",
      color: "white",
      cursor: "pointer",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)"
    },
    featuresList: {
      background: "rgba(255, 255, 255, 0.05)",
      padding: "20px",
      borderRadius: "12px",
      borderLeft: "4px solid #5a31ec",
      marginBottom: "20px",
      backdropFilter: "blur(10px)"
    },
    gotItButton: {
      background: "linear-gradient(45deg, #3820d6, #5a31ec)",
      border: "none",
      color: "white",
      padding: "12px 30px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      width: "100%",
      marginTop: "10px"
    },
    card: {
      cursor: "pointer",
      transition: "all 0.3s ease"
    },
    clickIndicator: {
      marginTop: "16px",
      fontSize: "14px",
      fontWeight: "500",
      background: "linear-gradient(45deg, #3820d6, #5a31ec)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    }
  };

  return (
    <div style={styles.aboutContainer}>
      <button 
        style={styles.backButton}
        onMouseOver={(e) => {
          e.target.style.background = "linear-gradient(45deg, #5a31ec, #7a4cf0)";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(56, 32, 214, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "linear-gradient(45deg, #3820d6, #5a31ec, #7a4cf0)";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 15px rgba(56, 32, 214, 0.3)";
        }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <center>
        <h1 style={styles.aboutTitle}>About Our Features</h1>
        <p style={styles.aboutSubtitle}>
          Learn more about how we protect your digital privacy
        </p>
      </center>

      <div className="grid md:grid-cols-3 gap-8 mt-8 max-w-6xl mx-auto">
        <div 
          className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300"
          style={styles.card}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-5px)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => setActivePopup('privacy')}
        >
          <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
            <img src={eye} alt="" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Privacy Visibility</h3>
          <p className="text-muted-foreground">
            See exactly what data each platform has collected about you in one unified dashboard.
          </p>
          <div style={styles.clickIndicator}>
            Click to learn more →
          </div>
        </div>

        <div 
          className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300"
          style={styles.card}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-5px)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => setActivePopup('risk')}
        >
          <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
            <img src={graph} alt="" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Risk Analysis</h3>
          <p className="text-muted-foreground">
            Get a personalized privacy risk score and understand where you're most vulnerable.
          </p>
          <div style={styles.clickIndicator}>
            Click to learn more →
          </div>
        </div>

        <div 
          className="glass p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300"
          style={styles.card}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-5px)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => setActivePopup('encryption')}
        >
          <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
            <img src={lock} alt="" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">End-to-End Encryption</h3>
          <p className="text-muted-foreground">
            Your data is encrypted client-side before it ever leaves your device. Total privacy guaranteed.
          </p>
          <div style={styles.clickIndicator}>
            Click to learn more →
          </div>
        </div>
      </div>

      {activePopup && (
        <div style={styles.popupOverlay} onClick={() => setActivePopup(null)}>
          <div
            style={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={styles.closeButton}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onClick={() => setActivePopup(null)}
            >
              ×
            </button>
            
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              background: "linear-gradient(45deg, #3820d6, #5a31ec)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              {popupContent[activePopup].title}
            </h2>
            
            <p style={{
              color: "#e2e8f0",
              marginBottom: "1.5rem",
              fontSize: "1.1rem",
              lineHeight: "1.6"
            }}>
              {popupContent[activePopup].description}
            </p>

            <div style={styles.featuresList}>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.75rem",
                color: "white"
              }}>
                Key Features:
              </h3>
              <ul style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
                {popupContent[activePopup].features.map((feature, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#10b981", marginRight: "0.5rem" }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              style={styles.gotItButton}
              onMouseOver={(e) => {
                e.target.style.background = "linear-gradient(45deg, #5a31ec, #7a4cf0)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "linear-gradient(45deg, #3820d6, #5a31ec)";
                e.target.style.transform = "translateY(0)";
              }}
              onClick={() => setActivePopup(null)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

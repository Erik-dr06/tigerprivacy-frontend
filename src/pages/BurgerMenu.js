import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BurgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const isGuest = localStorage.getItem("guest") === "true";


  const buttonStyle = {
    background: "linear-gradient(45deg, #3820d6, #5a31ec, #7a4cf0)",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: "15px",
    width: "100%",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(56, 32, 214, 0.3)"
  };

  const handleHover = (e, hover = true) => {
    if (hover) {
      e.target.style.background =
        "linear-gradient(45deg, #5a31ec, #7a4cf0, #9083e9)";
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 6px 20px rgba(56, 32, 214, 0.4)";
    } else {
      e.target.style.background =
        "linear-gradient(45deg, #3820d6, #5a31ec, #7a4cf0)";
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 15px rgba(56, 32, 214, 0.3)";
    }
  };

  return (
    <>
      <div
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          width: "35px",
          height: "30px",
          cursor: "pointer",
          zIndex: 1101,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            height: "4px",
            width: "100%",
            background: "#5a31ec",
            borderRadius: "2px",
            transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
            transition: "0.3s",
          }}
        ></span>
        <span
          style={{
            height: "4px",
            width: "100%",
            background: "#5a31ec",
            borderRadius: "2px",
            opacity: menuOpen ? 0 : 1,
            transition: "0.3s",
          }}
        ></span>
        <span
          style={{
            height: "4px",
            width: "100%",
            background: "#5a31ec",
            borderRadius: "2px",
            transform: menuOpen ? "rotate(-45deg) translate(6px,-6px)" : "none",
            transition: "0.3s",
          }}
        ></span>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "230px",
          height: "100%",
          background: "rgba(255,255,255,0.97)",
          boxShadow: menuOpen ? "2px 0 10px rgba(0,0,0,0.2)" : "none",
          padding: "60px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          transition: "transform 0.35s ease, box-shadow 0.3s ease",
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: 1100,
          overflow: "hidden",
        }}
      >
     <button
        style={buttonStyle}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
        onClick={() => {
          if (isGuest) {
            // Guest - go to login page
            navigate("/");
          } else {
            // Signed-in user - log out properly
            localStorage.removeItem("auth");
            localStorage.removeItem("user");
            navigate("/");
          }
        }}
      >
        {isGuest ? "Log In" : "Log Out"}
      </button>



        <button
          style={buttonStyle}
          onMouseOver={(e) => handleHover(e, true)}
          onMouseOut={(e) => handleHover(e, false)}
          onClick={() => navigate("/about")}
        >
          About Us
        </button>
      </div>

      {menuOpen && (
        <div
          onClick={toggleMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1099,
          }}
        />
      )}
    </>
  );
}

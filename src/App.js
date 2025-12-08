import React, { createContext, useState, useEffect } from "react";
import "./App.css";
import FileUpload from "./pages/FileUpload";
import ViewData from "./pages/ViewData";
import About from "./pages/About"; // Add this import
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const ThemeContext = createContext();

export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://backend-project-7qgd.onrender.com";


function App() {
  
  // Use initial theme preference from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <div className="App">
          <br />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/fileupload" element={<FileUpload />} />
            <Route path="/viewdata" element={<ViewData />} />
            <Route path="/about" element={<About />} /> {/* Add About route */}
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
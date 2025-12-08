import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";
import tigerImg from "../assets/imagetwo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("auth", "true");
      localStorage.removeItem("guest");
      localStorage.setItem("user", email);


      navigate("/fileupload");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password.");
    }
  };

  return (
    
    <div className="Login">
      <div className="header-wrapper">
        <h1 className="header-title">Welcome Back To</h1>
      </div>
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl"
      >
        

        <div className="flex justify-center mb-8">
          <img
            src={tigerImg}
            alt="Tiger Logo"
            className="w-24 h-24 animate-bounce-slow"
          />
        </div>
        <br/>
        <div className="mb-8">
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="mb-8">
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        <button 
          type="submit"
          className="loginButton"
        >
          Sign In
        </button>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <div className="text-center">
          <span className="signup-text">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/CreateAccount")}
              className="signup-link"
            >
              Create account
            </button>
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/resetpassword")}
          className="loginButton"
        >
          Forgot password?
        </button>
        <button 
        type="button"
        onClick={() => {
          localStorage.setItem("guest", "true");
          navigate("/fileupload");
        }}
        className="loginButton"
      >
        Continue as Guest
      </button>


      </form>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow 80s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}

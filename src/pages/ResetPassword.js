import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../App.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent! Please check your inbox and spam.");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      console.error(error);
      setMessage("Error: Could not send reset email. Check the address.");
    }
  };

  return (
    <div className="reset-container">
      <h1 className="header-title">Reset Password</h1>

      <form onSubmit={handleSubmit} className="reset-form">
        <input
          type="email"
          placeholder="Enter your email:"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />

        <button type="submit" className="reset-btn">
          Send Reset Link
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="back-link"
        >
          Back to Login
        </button>
      </form>

      {/* Show status messages */}
      {message && <p className="reset-message">{message}</p>}
    </div>
  );
}

export default ResetPassword;

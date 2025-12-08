import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // make sure this file exports your Firebase auth instance
import "../App.css";

function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // ✅ Create new user using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      alert(`Account created for: ${email}`);
      navigate("/"); // redirect to login after signup
    } catch (err) {
      console.error("Error creating account:", err.message);
      setError("Failed to create account. " + err.message);
    }
  };

  return (
    <div className="create-account-container">
      <center>
        <h1 className="header-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="create-account-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-medium mb-4">{error}</p>
          )}

          <button type="submit" className="create-account-btn">
            Sign Up
          </button>
          <br></br>
          <button type="back" className="create-account-btn" onClick={() => navigate("/")} >
            Back to Login
          </button>
        </form>
      </center>
    </div>
  );
}

export default CreateAccount;
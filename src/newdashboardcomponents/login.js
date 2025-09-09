import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Your backend URL

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  const handleGetProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`Logged in as: ${res.data.user.email}`);
    } catch {
      setMessage("Access denied or token expired");
    }
  };

  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <h2>Sign Up / Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <div>
        <button onClick={handleSignup} style={{ marginRight: "10px" }}>
          Sign Up
        </button>
        <button onClick={handleLogin}>Login</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGetProfile}>Get Profile</button>
      </div>
      <p>{message}</p>
    </div>
  );
}

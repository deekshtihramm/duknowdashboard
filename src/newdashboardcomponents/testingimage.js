import React, { useState } from "react";
import logo from "../images/logoimg.png";
import logo2 from "../images/logo2.png";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function ProfessionalSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email");
    if (!password.trim()) return setError("Please enter your password");

    try {
      setLoading(true);

      const res = await fetch("https://web.backend.duknow.in/api/dashboard/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, remember }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed");

      // ✅ Save token/email if provided by API
      if (data.token) localStorage.setItem("duknowToken", data.token);
      if (remember) localStorage.setItem("duknowEmail", email.trim());

      alert("Account created successfully!");
      navigate("/"); // redirect to login or dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lp-root">
      <div className="lp-card" role="main">
        <div className="lp-left">
          <center>
            <h1 className="lp-brand" style={{ color: "#242424ff" }}>
              <img
                src={logo}
                alt="Duknow Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              Duknow
            </h1>
          </center>

          <form className="lp-form" onSubmit={submit} noValidate>
            <label className="lp-label">
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="lp-input"
                required
                aria-label="Full Name"
              />
            </label>

            <label className="lp-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="lp-input"
                required
                aria-label="Email"
              />
            </label>

            <label className="lp-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="lp-input"
                required
                aria-label="Password"
              />
            </label>

            <div className="lp-row">
              <label className="lp-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            {error && <div className="lp-error" role="alert">{error}</div>}

            <button className="lp-submit" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="lp-signup">
              Already have an account?{" "}
              <a href="/login">Sign in</a>
            </p>
          </form>
        </div>

        <div className="lp-right" aria-hidden="true">
          <div className="lp-graphic">
            <img
              src={logo2}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Welcome graphic"
              className="lp-graphic-img"
            />
          </div>
        </div>
      </div>

      <footer className="lp-footer">
        © {new Date().getFullYear()} Duknow — All rights reserved
      </footer>
    </div>
  );
}

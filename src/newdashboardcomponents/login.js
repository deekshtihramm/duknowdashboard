import React, { useState } from 'react';
import logo from '../images/logoimg.png';
import logo2 from '../images/logo2.png';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

export default function ProfessionalLoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem('duknowEmail') || '');
  const [remember, setRemember] = useState(() => !!localStorage.getItem('duknowEmail'));


async function submit(e) {
  e.preventDefault();
  setError('');

  if (!email.trim()) return setError('Please enter your email');
  if (!password.trim()) return setError('Please enter your password');

  try {
    setLoading(true);

    const res = await fetch('https://web.backend.duknow.in/api/dashboard/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password, remember }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Login failed');

    // ✅ Save token and email in localStorage
    if (data.token) localStorage.setItem('duknowToken', data.token);
    if (remember) {
      localStorage.setItem('duknowEmail', email.trim());
    } else {
      localStorage.removeItem('duknowEmail');
    }

    if (onLogin) onLogin(data);
    else console.log('Login success:', data);

    navigation('/newdashboard');
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
                style={{ width: '60px', height: '60px', marginRight: '8px', verticalAlign: 'middle' }}
              />
              Duknow
            </h1>
          </center>

          <form className="lp-form" onSubmit={submit} noValidate>
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
                placeholder="Enter your password"
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

              <a className="lp-forgot" href="#">Forgot?</a>
            </div>

            {error && <div className="lp-error" role="alert">{error}</div>}

            <button className="lp-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="lp-signup">Don't have an account? <a href="#">Create one</a></p>
          </form>
        </div>

        <div className="lp-right" aria-hidden="true">
          <div className="lp-graphic">
            <img
              src={logo2}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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

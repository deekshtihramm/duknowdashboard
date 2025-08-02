import React, { useState } from 'react';
import './ampauthui.css';
import { useNavigate } from 'react-router-dom';

const Empauthui = () => {
  const [view, setView] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      view === 'register'
        ? 'https://web.backend.duknow.in/dashboard/register'
        : 'https://web.backend.duknow.in/dashboard/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Server Error:', data);
        alert(data.message || 'Something went wrong');
      } else {
        alert(data.message);

        if (view === 'login') {
          navigate('/dashboard'); // Redirect to dashboard after login
        } else {
          // Optionally switch to login view after successful registration
          setView('login');
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'employee'
          });
        }
      }
    } catch (err) {
      console.error('Network Error:', err);
      alert('Network error: Could not connect to server');
    }
  };

  return (
    <div className="container">
      <h1>{view === 'login' ? 'Employee Login' : 'Register New Employee'}</h1>

      <form onSubmit={handleSubmit}>
        {view === 'register' && (
          <>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {view === 'register' && (
          <>
            <label>Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit">{view === 'login' ? 'Login' : 'Register'}</button>
      </form>

      <p>
        {view === 'login' ? (
          <span>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => setView('register')}>
              Register
            </button>
          </span>
        ) : (
          <span>
            Already registered?{' '}
            <button type="button" onClick={() => setView('login')}>
              Login
            </button>
          </span>
        )}
      </p>
    </div>
  );
};

export default Empauthui;

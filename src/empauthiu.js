import React, { useState } from 'react';
import './ampauthui.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "./config";


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
        : 'http://localhost:8000/dashboard/login';

   try {
  console.log('Sending request to:', url);
  console.log('Request payload:', formData);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  console.log('Response status:', res.status);
  console.log('Response headers:', Object.fromEntries(res.headers.entries()));

  const data = await res.json().catch(err => {
    console.error('Failed to parse JSON response:', err);
    throw new Error('Invalid JSON response');
  });

  console.log('Response data:', data);

  if (!res.ok) {
    console.error('Server Error:', data);
    alert(data.message || 'Something went wrong');
  } else {
    alert(data.message);

    if (view === 'login') {
      // Store JWT tokens (access & refresh) in localStorage
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        console.log('Tokens stored successfully');
      } else {
        console.warn('Tokens missing in response');
      }
      sessionStorage.setItem('username', data.user.name);
      navigate('/dashboard'); // Redirect to dashboard after login
    } else {
      // Switch to login view after successful registration
      setView('login');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee'
      });
      console.log('Switched to login view after registration');
    }
  }
} catch (err) {
  console.error('Network or unexpected error occurred:', err);
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
              className='nameinput'
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
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
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

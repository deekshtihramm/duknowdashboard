// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Empauthui from './empauthiu';
import Dashboard from './dashboard';
import Dataentry from "./pages/dataentry.js";
import Sales from "./pages/Sales.js";
import Reports from "./pages/Reports.js";
import Settings from "./pages/Settings.js";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Empauthui />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataentry" element={<Dataentry />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

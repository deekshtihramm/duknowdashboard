// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Empauthui from './empauthiu';
import Dashboard from './dashboard';
import Dataentry from "./pages/dataentry.js";
import Community from "./pages/community.js";
import Reports from "./pages/Reports.js";
import Settings from "./pages/Settings.js";
import Analytics from "./pages/analytics.js";
import UserListPage from "./pages/userpages/userlistlpage.js";
import EmailListPage from './pages/userpages/emailistpage.js';
import UserDetailPage from './pages/userpages/userdetials.js';
import Users from './pages/overviewpages/installview.js';

//new dashboard
import Dashboard2 from './newdashboard.js';
import Totalusers from './newdashboardcomponents/totalusers.js';
import Activeusers from './newdashboardcomponents/activeusers.js';
import UserDetails from "./newdashboardcomponents/UserDetails";







const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Empauthui />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataentry" element={<Dataentry />} />
        <Route path="/community" element={<Community />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<UserListPage/>}/>
        <Route path="/emailusers" element={<EmailListPage />} />
        <Route path='/user-detail' element={<UserDetailPage/>}/>
        <Route path='/dashboard/view' element={<Users />} />

        //new dashboard
        <Route path='/newdashboard' element={<Dashboard2 />} />
        <Route path='/newdashboard/users' element={<Totalusers />} />
        <Route path='/newdashboard/active-users' element={<Activeusers />} />
        <Route path="/newdashboard/userdetails/:id" element={<UserDetails />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

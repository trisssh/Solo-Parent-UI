import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Login4 from "./pages/Login4";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from './pages/ForgetPassword';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login4 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


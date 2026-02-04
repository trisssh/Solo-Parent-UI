import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import TestPage from "./pages/test";

import './App.css'

import Login3 from './pages/Login3'
import Login4 from './pages/Login4'
import UserRegister from './pages/UserRegister'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={
              <ProtectedRoute><TestPage /></ProtectedRoute>
            } path="/" exact />
            <Route element={<Login4 />} path="/login" />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App

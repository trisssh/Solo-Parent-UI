import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

import Sidebar from "./components/Sidebar";
import Login4 from "./pages/Login4";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from './pages/ForgetPassword';
import UserRegister from './pages/UserRegister';
import UserList from './pages/ListofUsers';
import EditAccount from "./pages/EditAccount";
import SuperAdminDashboard from './dashboards/superadmin/SuperAdminDashboard';
// import SuperAdminUserList from


// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<Login4 />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//             exact
//           />
//           <Route path="/forgot-password" element={<ForgetPassword />} />
//           <Route path="/user-register" element={<UserRegister />} />

//           <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Login4 />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/user-register" element={<UserRegister />} />
          {/* <Route path="/change-password" element={<ChangePassword />} /> */}

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/list-of-users"
            element={
              <ProtectedRoute>
                <ListofUsers />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/edit-account"
            element={
              <ProtectedRoute>
                <EditAccount />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


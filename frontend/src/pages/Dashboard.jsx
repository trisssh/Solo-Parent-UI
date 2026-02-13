import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Dashboards per role
import UserDashboard from "../dashboards/user/UserDashboard";
import AdminDashboard from "../dashboards/admin/AdminDashboard";
import SuperAdminDashboard from "../dashboards/superadmin/SuperAdminDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  console.log(user.is_staff);

  // useEffect(() => {
  //   // Get the role from localStorage
  //   const storedRole = localStorage.getItem("role");
  //   if (!storedRole) {
  //     // If no role, redirect to login
  //     navigate("/");
  //   } else {
  //     setRole(storedRole);
  //   }
  // }, [navigate]);

  if (!user) {
    return <p>Loading...</p>; // Optional: show spinner later
  }

  // Render dashboard based on role
  if (user.is_staff && user.is_superuser) {
    return <SuperAdminDashboard />;
  } else if (user.is_staff) {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }

  // switch (user) {
  //   case "user":
  //     return <UserDashboard />;
  //   case "admin":
  //     return <AdminDashboard />;
  //   case "superadmin":
  //     return <SuperAdminDashboard />;
  //   default:
  //     return <p>Role not recognized</p>;
  // }
}

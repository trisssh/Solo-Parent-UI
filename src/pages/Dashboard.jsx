import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Dashboards per role
import UserDashboard from "../dashboards/user/UserDashboard";
import AdminDashboard from "../dashboards/admin/AdminDashboard";
import SuperAdminDashboard from "../dashboards/superadmin/SuperAdminDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the role from localStorage
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      // If no role, redirect to login
      navigate("/");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  if (!role) {
    return <p>Loading...</p>; // Optional: show spinner later
  }

  // Render dashboard based on role
  switch (role) {
    case "user":
      return <UserDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "superadmin":
      return <SuperAdminDashboard />;
    default:
      return <p>Role not recognized</p>;
  }
}

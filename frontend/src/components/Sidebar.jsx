// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";


// export default function Sidebar() { 
//     return <div>Sidebar</div>;
// }

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      confirmButtonColor: "#DC2626",
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const navItems = {
    user: [
      { name: "Profile", link: "/user-dashboard" },
      { name: "Edit Account", link: "/user-edit" },
      { name: "Logout", action: handleLogout },
    ],

    admin: [
      { name: "Dashboard", link: "/admin-dashboard" },
      { name: "List of Parents", link: "/users-list" },
      { name: "Edit Account", link: "/admins-edit" },
      { name: "Logout", action: handleLogout },
    ],

    superadmin: [
      { name: "Dashboard", link: "/superadmin-dashboard" },
      { name: "List of Parents", link: "/users-list" },
      { name: "List of Admins", link: "/admins-list" },
      { name: "Edit Account", link: "/admins-edit" },
      { name: "Logout", action: handleLogout },
    ],
  };

  const itemsToShow = navItems[role] || [];

  return (
    <aside
      className={`fixed lg:static z-50 h-screen w-64 bg-gradient-to-b from-[var(--red-1)] to-[var(--red-3)] text-white transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-64 lg:translate-x-0"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="bg-white size-10 rounded-full border border-red-200 shadow flex justify-center items-center">
            <img src="SP.png" className="size-9 object-contain" />
          </div>
          <h2 className="text-sm font-bold uppercase">Solo Parent System</h2>
        </div>

        <button
          className="lg:hidden text-xl"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-1">
        {itemsToShow.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className="w-full text-left px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-700 transition"
              >
                {item.name}
              </button>
            );
          }

          const isActive = location.pathname === item.link;

          return (
            <Link
              key={item.name}
              to={item.link}
              className={`block px-4 py-2 rounded-md font-semibold transition
              ${
                isActive
                  ? "bg-white text-red-700"
                  : "hover:bg-white hover:text-red-700"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

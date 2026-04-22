import { useEffect, useState, useContext, Children } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logoutUser } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  let role = null;

  if (user.is_superuser) {
    role = "superadmin";
  } else if (user.is_staff) {
    role = "admin";
  } else {
    role = "user";
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      iconColor: "#DC2626",
      confirmButtonColor: "#DC2626",
      background: "#ffffff",
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
    admin: [
      { name: "Dashboard", link: "/dashboard" },
      { name: "User Management", link: "/list-of-users" },
      { name: "Change Password", link: "/edit-account" },
      { name: "Logout", action: handleLogout },
    ],

    superadmin: [
      { name: "Dashboard", link: "/dashboard" },
      {
        name: "User Managament",
        children: [
          { name: "Clients", link: "/list-of-users" },
          { name: "Admins", link: "/admins-list" },
        ],
      },
      { name: "Change Password", link: "/edit-account" },
      { name: "Logout", action: handleLogout },
    ],
  };

  const itemsToShow = navItems[role] || [];

  return (
    <aside
      className={`fixed lg:static z-50 h-screen w-64  bg-gradient-to-b from-red-700 to-red-600 text-white transition-transform duration-300
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
        {itemsToShow.map((item, index) => {
          // LOGOUT BUTTON
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

          // DROPDOWN
          if (item.children) {
            const isOpen = dropdown === index;

            return (
              <div key={item.name}>
                {/* <button
                  onClick={() => setDropdown(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-700 transition"
                >
                  {item.name}
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button> */}
                <button
                  onClick={() => setDropdown(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-red-700 transition"
                >
                  {item.name}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isActive = location.pathname === child.link;

                      return (
                        <Link
                          key={child.name}
                          to={child.link}
                          className={`block px-4 py-2 rounded-md text-sm transition font-semibold
                    ${
                      isActive
                        ? "bg-white text-red-700 "
                        : "hover:bg-white hover:text-red-700"
                    }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // NORMAL LINK
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

        {/* USER PROFILE */}
        <section className="flex items-center justify-between p-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="bg-white size-7 rounded-full border border-red-200 shadow-md flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-10 text-red-700"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold">{user?.email || "No email"}</p>
          </div>
        </section>
      </nav>
      {/* <nav className="p-3 space-y-1">
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
      </nav> */}
    </aside>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ChangePasswordForm from "../components/ChangePasswordForm";




export default function ChangePassword() {
  const { authTokens, userInfo } = useContext(AuthContext);
  const [users, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
   

    useEffect(() => {
      const storedUser = localStorage.getItem("users");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);


    //  LOGOUT
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


  return (
    <>
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="relative z-50 bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-between px-4 sm:px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
          <div className="flex items-center">
            <div className="bg-white size-12 sm:size-14 rounded-full shadow-md shadow-red-700 flex justify-center items-center">
              <img src="SP.png" className="size-12 sm:size-13 object-contain" />
            </div>

            <div className="leading-tight mx-2 md:mx-4">
              <h2 className="font-bold uppercase text-white text-base sm:text-xl">
                Solo Parent System
              </h2>
              <p className="text-white/80 text-[10px] sm:text-xs">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>

          <nav id="userDropdown" className="relative">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition"
            >
              {/* Person icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 md:hidden cursor-pointer "
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Email */}
              {/* <span className="hidden md:block font-semibold">{email}</span> */}
              <span className="hidden md:block font-semibold">
                {/* {users?.parent?.email ?? user?.email ?? "Loading..."} */}
                {user?.email || "No email"}
              </span>

              {/* Dropdown icon */}
              <svg
                className="hidden md:block w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* DROPDOWN */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-36 md:w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpenDropdown(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpenDropdown(false)}
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </header>

        <ChangePasswordForm />
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const [isEdit, setIsEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate("/");
  // };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#userDropdown")) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  // Get user info from localStorage (dummy)
  const email = localStorage.getItem("email") || "user@test.com";

  return (
    <div className="flex bg-white md:h-screen">
      {/* SIDEBAR */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="relative z-50 bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-between px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
          {/* <div>
            <h2 className="text-3xl font-bold text-white hidden md:block">
              Profile
            </h2>
            <p className="text-white/90 text-sm font-semibold hidden md:block">
              Here you can view and edit your information
            </p>
          </div> */}
          <div className="flex items-center">
            <div className="bg-white size-14 rounded-full shadow-md shadow-red-700 flex justify-center items-center">
              <img src="SP.png" className="size-13 object-contain" />
            </div>

            <div className="leading-tight mx-2 md:mx-4">
              <h2 className="font-bold uppercase text-white text-lg sm:text-xl">
                Solo Parent System
              </h2>
              <p className="text-white/80 text-xs">
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
              <span className="hidden md:block font-semibold">{email}</span>

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
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link
                      to="/edit-profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpenDropdown(false)}
                    >
                      Edit Profile
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

        <main className="flex-1 overflow-y-auto bg-gray-50 p-5 sm:p-6">
          {/* MAIN GRID */}
          <h3 className="text-2xl text- font-bold text-gray-900 mb-3">
            My Profile
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-1 space-y-4.5">
              {/* PROFILE CARD */}
              <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-center">
                {/* <img
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-red-200 shadow"
            /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 text-red-500 w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-red-300 shadow"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>

                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  Complete Name
                </h2>

                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Solo Parent
                </p>

                <div className="mt-4 flex justify-center">
                  {/* {verificationStatus ? (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  ✔ Verified
                </span>
              ) : (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  ✖ Unverified
                </span>
              )} */}
                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    Unverified
                  </span>
                </div>
              </div>

              {/* ID DETAILS */}
              <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">ID Details</h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>Read-only</p>
                  </span>
                </div>

                <p className="text-sm text-gray-400">ID Number</p>
                <p className="font-medium text-xl text-gray-800 mb-3">
                  ID xx-xxxx-xxxx
                </p>
              </div>

              {/* E-SIGNATURE */}
              <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  E-Signature
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Signature on white background
                </p>

                <div className="flex justify-center">
                  <img
                    // src={`http://localhost:5000/${info.image_name}`}
                    alt="Signature"
                    className="h-28 object-contain border rounded-lg bg-white p-2"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* BIRTHDAY NOTICE */}
              {/* {verificationStatus && birthdayNear && (
            <div className="backdrop-blur-lg bg-red-100/70 border border-red-200 rounded-2xl p-4 text-red-800 shadow">
              🎉 Your birthday is near! You may get your payout.
            </div>
          )} */}

              {/* PERSONAL INFORMATION */}
              <div className="backdrop-blur-lg bg-white border border-gray-200  rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Personal Information
                </h3>

                <div className="container">
                  {/* Full Name w/ Suffix */}
                  <div className="grid md:grid-cols-2">
                    <div>
                      <h4 className="text-sm text-gray-400">First Name</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Example
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Middle Name</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Last Name</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Suffix</h4>
                      <p className="font-medium text-xl text-gray-800 mb-3">
                        Jr
                      </p>
                    </div>
                  </div>

                  {/* Bday and Gender */}
                  <div className="grid md:grid-cols-2 ">
                    <div>
                      <h4 className="text-sm text-gray-400">Date of Birth</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        01/02/01
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Age</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        55
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Gender</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-400">Address</h4>
                    <p className="font-medium text-lg text-gray-800 mb-3">
                      031, Secret, Progreso, San Juan, Metro Manila
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="backdrop-blur-lg bg-white border border-gray-200  rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contact Information
                </h3>

                <div className="container">
                  {/* Email & Contact no */}
                  <div className="grid md:grid-cols-2">
                    <div>
                      <h4 className="text-sm text-gray-400">Email</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        user@test.com
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">Contact Number</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        09-xxxx-xxx-12
                      </p>
                    </div>
                  </div>

                  {/* Emergency Contail Details */}
                  <div className="grid md:grid-cols-2 ">
                    <div>
                      <h4 className="text-sm text-gray-400">
                        Emergency Contact's First Name
                      </h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">
                        Emergency Contact's Middle Name
                      </h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">
                        Emergency Contact's Last Name
                      </h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        Secret
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400">
                        Emergency Contact's Phone Number
                      </h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        09-xxxx-xxx-11
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

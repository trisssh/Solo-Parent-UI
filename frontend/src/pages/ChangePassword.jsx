import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function ChangePassword() {
     const [user, setUser] = useState(null);
     const [openDropdown, setOpenDropdown] = useState(false);
     const navigate = useNavigate();
      const [form, setForm] = useState({
        old_password: "",
        password: "",
        confirm: "",
      });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


     useEffect(() => {
       const storedUser = localStorage.getItem("user");
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

     //SUBMIT
      const handleSubmit = async (e) => {
        e.preventDefault();


        if (!form.password && !form.confirm) {
            showAlert({
              title: "Reminder",
              message: "Leave blank if you don’t want to change password",
              icon: "info",
            });
          return;
        }

        if (form.password !== form.confirm) {
         showAlert({
           title: "Error",
           message: "New password and confirm password do not match",
           icon: "error",
         });
          return;
        }

        if (!form.old_password) {

            showAlert({
              title: "Error",
              message: "Please enter your old password",
              icon: "error",
            });
          return;
        }

        // ---- Fake API logic ----
        // Pretend the old password is always "12345"
        if (form.old_password !== "12345") {
          showAlert({
            title: "Error",
            message: "Old password is incorrect",
            icon: "error",
          });
          return;
        }

        // Simulate success
        await new Promise((r) => setTimeout(r, 500)); // fake delay
          showAlert({
            title: "Success",
            message: "Password changed successfully!",
            icon: "success",
          });

        // Clear form
        setForm({ old_password: "", password: "", confirm: "" });
      };
    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   if (!user) {
    //     showAlert({
    //       title: "Error",
    //       message: "User not found. Please login again.",
    //       icon: "error",
    //     });
    //     return;
    //   }

    //   if (!form.password && !form.confirm) {
    //     showAlert({
    //       title: "Reminder",
    //       message: "Leave blank if you don’t want to change password",
    //       icon: "info",
    //     });
    //     return;
    //   }

    //   if (form.password !== form.confirm) {
    //     showAlert({
    //       title: "Error",
    //       message: "New password and confirm password do not match",
    //       icon: "error",
    //     });
    //     return;
    //   }

    //   if (!form.old_password) {
    //     showAlert({
    //       title: "Error",
    //       message: "Please enter your old password",
    //       icon: "error",
    //     });
    //     return;
    //   }

    //   try {
    //     const response = await fetch(
    //       `http://127.0.0.1:8000/user/password/${user.id}`,
    //       {
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //           // If may token kayo, idagdag ito:
    //           // Authorization: `Bearer ${localStorage.getItem("access")}`,
    //         },
    //         body: JSON.stringify({
    //           old_password: form.old_password,
    //           password: form.password,
    //         }),
    //       },
    //     );

    //     const data = await response.json();

    //     if (!response.ok) {
    //       showAlert({
    //         title: "Error",
    //         message: data.message || "Failed to change password",
    //         icon: "error",
    //       });
    //       return;
    //     }

    //     showAlert({
    //       title: "Success",
    //       message: "Password changed successfully!",
    //       icon: "success",
    //     });

    //     setForm({
    //       old_password: "",
    //       password: "",
    //       confirm: "",
    //     });
    //   } catch (error) {
    //     showAlert({
    //       title: "Error",
    //       message: "Server error. Please try again.",
    //       icon: "error",
    //     });
    //   }
    // };




    // ---------------------------
    // SWEET ALERT
    // ---------------------------
    const showAlert = ({ title, message, icon = "error" }) => {
        Swal.fire({
        title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
        html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
        icon,
        iconColor: "#DC2626",
        background: "#ffffff",
        showConfirmButton: true,
        confirmButtonText: "Okay",
        buttonsStyling: false,
        customClass: {
            popup: "rounded-xl px-6 py-4",
            confirmButton:
            "mt-4 bg-red-600 text-white px-6 py-2 rounded text-xl hover:bg-red-700",
        },
        });
    };

  return (
    <>
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="relative z-50 bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-between px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
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
              {/* <span className="hidden md:block font-semibold">{email}</span> */}
              <span className="hidden md:block font-semibold">
                {user?.email || "Loading..."}
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

        <div className="flex-1 flex justify-center items-center bg-gray-50">
          <form
            className="relative max-w-2xl w-full space-y-6"
            onSubmit={handleSubmit}
          >
            {/* <div className="bg-white rounded-xl border-4 border-red-300 p-5 mx-3"> */}
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6 mx-3">
              <article className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Change Password
                </h2>
                <p className="font-semibold text-sm text-gray-600 text-justify">
                  Leave blank if you don’t want to change password
                </p>
              </article>

              <div className="space-y-4 mb-6">
                <div>
                  <label
                    //   className="text-sm text-gray-600"
                    className="block text-gray-700 font-medium"
                  >
                    Old Password
                  </label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="old_password"
                    value={form.old_password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    New Password
                  </label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Confirm Password
                  </label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/dashboard"
                  className="text-center bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
  const { authTokens, user } = useContext(AuthContext);
  const [form, setForm] = useState({
    old_password: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password fields
    if (!form.password || !form.confirm) {
      showAlert({
        title: "Reminder",
        message: "Leave blank if you don’t want to change password",
        icon: "info",
      });
      return;
    }

    //Check if both password match
    if (form.password !== form.confirm) {
      showAlert({
        title: "Error",
        message: "New password and confirm password do not match",
        icon: "error",
      });
      return;
    }

    try {
const response = await fetch(
  `http://127.0.0.1:8000/api/user/password/${user.user_id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authTokens.access}`,
    },
    body: JSON.stringify({
      old_password: form.old_password,
      password: form.password,
      password_confirmation: form.confirm,
    }),
  },
);

      const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.old_password?.[0] ||
        data.password?.[0] ||
        data.password_confirmation?.[0] ||
        data.detail ||
        "Failed to change password";

      showAlert({
        title: "Error",
        message: errorMessage,
        icon: "error",
      });

      return;
    }

      // Success
      showAlert({
        title: "Success",
        message: "Password changed successfully!",
        icon: "success",
      });

      // Clear form
      setForm({ old_password: "", password: "", confirm: "" });
    } catch (error) {
      console.error("Error:", error);
      showAlert({
        title: "Error",
        message: "Server error. Please try again.",
        icon: "error",
      });
    }
  };

  // SWEET ALERT
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


  //Password Visibility
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-white">
      <form
        className="relative max-w-2xl w-full space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6 mx-3">
          <article className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 md:mb-1">
              Change Password
            </h2>
            <p className="text-xs font-semibold md:text-sm text-gray-600 text-justify">
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
              <div className="relative">
                <input
                  type={showPassword.old ? "text" : "password"}
                  name="old_password"
                  value={form.old_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />

                <button
                  type="button"
                  onClick={() => togglePassword("old")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.old ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />

                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.new ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />

                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword.confirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
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
  );
}

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showSuccess = (title, message) => {
    Swal.fire({
      icon: "success",
      iconColor: "#DC2626",
      title: title,
      html: message,
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

  const showError = (title, message) => {
    Swal.fire({
      icon: "error",
      title,
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
      text: message,
      confirmButtonText: "Okay",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        'http://127.0.0.1:8000/api/user/reset-password-request', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
        }),
      });
      if (res.ok) {
        showSuccess(
          "Password reset link sent",
          "Please check your emails.",
        );
      } else {
        showError(
          "Email required",
          "Please enter your registered email address.",
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative p-1 rounded-2xl overflow-hidden mx-3">
        <div className="bg-white drop-shadow-[0_0_0.5rem_#FF2424]  shadow-lg rounded-xl w-full max-w-md p-6">
          <div className="flex items-center justify-center mb-6">
            {/* Logo Img Example */}
            <div className="bg-white size-14 rounded-full flex justify-center items-center">
              <img src="SP.png" className="size-14" />
            </div>
            <div className="ml-2 md:ml-6 text-center">
              <h2 className="font-bold uppercase text-base sm:text-xl text-gray-800">
                Solo Parent System
              </h2>
              <p className="capitalize font-semibold text-xs md:text-right tracking-wide text-gray-600 ">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>

          <div>
            <article className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Forgot Password
              </h2>
              <p className="font-semibold text-base text-gray-600 text-justify">
                Please provide your registered email address to reset your password.
              </p>
            </article>

            {/* Email */}
            <form onSubmit={handleSubmit} className="relative w-full my-6 rounded-lg">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md"
                placeholder=""
                name="email"
              />
              <label
                htmlFor="email"
                className="absolute text-2xl font-bold text-[var(--gray-2)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Email
              </label>

              <button
                type="submit"
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-full py-2 rounded-lg"
              >
                Send Email
              </button>
            </form>

            <Link
              to="/"
              className="font-semibold flex justify-center my-2 text-xs hover:underline hover:text-gray-700 text-gray-600"
            >
              Go back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
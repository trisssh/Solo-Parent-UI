import { useState } from "react";
import Swal from "sweetalert2";


// Swal.fire({
//   title: "Are you sure?",
//   text: "You are about to edit your profile.",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonColor: "#DC2626", // red
//   cancelButtonColor: "#6B7280", // gray
//   confirmButtonText: "Yes, edit",
// });

export default function Login4() {
  //USESTATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //handleLogin function (UI-only logic)
  const handleLogin = () => {
    if (!email || !password) {
      showAlert({
        title: "Login Failed",
        message: "Please enter your email and password.",
        icon: "error",
      });
      return;
    }

    // UI-only success (no backend yet)
    showAlert({
      title: "Login Successful",
      message: "Welcome! You may now access your account.",
      icon: "success",
    });
  };

  // ---------------------------
  // SWEET ALERT (POP-UP)
  // ---------------------------
  const showAlert = ({ title, message, icon = "error" }) => {
    Swal.fire({
      title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
      html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
      icon,
      iconColor: "#d33",
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
    <div className="flex justify-center items-center gap-6 md:gap-12 min-h-screen">
      {/* Left Section */}
      <div className="hidden md:block bg-white flex flex-col justify-center items-center text-center p-10 relative overflow-hidden rounded-2xl">
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Logo Img Example */}
          <img
            src="spc.png"
            className="size-90 drop-shadow-[0_0_0.5rem_#A6A6A6]"
          />

          {/* Title */}
          <div className="text-gray-800 text-center flex flex-col">
            <h3 className="text-2xl md:text-4xl font-bold uppercase">
              Solo Parent System
            </h3>
            <p className="text-gray-700 text-sm md:mx-14 leading-relaxed text-justify md:text-center">
              City of San Juan, Metro Manila
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="flex flex-col justify-center items-center gap-6 mx-4">
        <div className="relative p-1 rounded-2xl overflow-hidden ">
          {/* Animated Border */}
          <div
            className="absolute inset-1 rounded-2xl 
            bg-[conic-gradient(from_0deg,#ff2424,#ff9a9a,#ff2424)]
            animate-[spin_10s_linear_infinite]"
          ></div>
      

          {/* Content */}
          <div className="relative bg-white drop-shadow-[0_0_0.5rem_#FF2424] rounded-2xl p-2">
          
            <div className="p-4 sm:p-8 md:p-10 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="bg-fireicon bg-white size-14 rounded-full flex justify-center items-center ">
                  {/* Logo Img Example */}
                  <img src="spc.png" className="size-14" />
                </div>
                <div className="ml-2 md:ml-6 text-center">
                  <h2 className="font-bold  uppercase text-lg sm:text-2xl text-gray-800">
                    Solo Parent System
                  </h2>
                  <p className="capitalize font-semibold text-xs md:text-right tracking-wide text-gray-600 hidden lg:block">
                    City of San Juan, Metro Manila
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md mt-4 md:mt-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Log in to your Account
                </h2>

                {/* Email */}
                <div className="relative w-full mt-4 rounded-lg">
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
                    className="absolute text-2xl font-bold text-[#A6A6A6] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
                  >
                    Email
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative w-full mt-4 rounded-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md pr-10"
                    placeholder=" "
                    name="password"
                  />

                  <label
                    htmlFor="password"
                    className="absolute text-2xl font-bold text-[#A6A6A6] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
                  >
                    Password
                  </label>

                  {/* Eye icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <span className="text-xs underline hover:text-red-600 text-red-500 cursor-pointer">
                    <a href="#">Forgot Password?</a>
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="text-base uppercase font-bold tracking-widest mt-6 w-full py-3 rounded bg-gradient-to-r from-[#D7263D] to-red-600 text-white font-semibold hover:from-[#D7263D] hover:to-red-700 transition-all duration-300 hover:scale-105 cursor-pointer shadow shadow-gray-700"
                >
                  Login
                </button>

                {/* Footer */}
                <div className="mt-2 text-center text-sm text-gray-600">
                  Don’t have an account?
                  <a
                    href="#"
                    className="text-[#D7263D] ml-1 font-bold hover:underline"
                  >
                    Create an account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

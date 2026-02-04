import { useState } from "react";
import Swal from "sweetalert2";

// Swal.fire({
//   title: "Success!",
//   text: "SweetAlert2 is working 🎉",
//   icon: "success",
//   confirmButtonText: "OK",
// });

Swal.fire({
  title: "Are you sure?",
  text: "You are about to edit your profile.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#DC2626", // red
  cancelButtonColor: "#9CA3AF", // gray
  confirmButtonText: "Yes, edit",
});


export default function Login4() {
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <div className="flex justify-center items-center gap-6 md:gap-12 min-h-screen">
      {/* Left Section */}
      <div className="hidden md:block bg-white flex flex-col justify-center items-center text-center p-10 relative overflow-hidden rounded-2xl">
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Avatar */}
          {/* <div className="flex justify-center sm:justify-start">
            <div className="size-20 md:size-72 rounded-full bg-white flex items-center justify-center shadow-lg filter drop-shadow-[0_0_0.25rem_#242424]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-20 md:size-64 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div> */}
          {/* Logo Img Example */}
          <img
            src="spc.png"
            className="size-90 drop-shadow-[0_0_0.5rem_#A6A6A6]"
          />
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
          {/* <div className="w-64 h-64 bg-[conic-gradient(red,yellow,blue,red)]"></div> */}

          {/* Content */}
          <div className="relative bg-white drop-shadow-[0_0_0.5rem_#FF2424] rounded-2xl">
            {/* <div className="relative bg-white drop-shadow-[0_0_0.5rem_#FF2424] rounded-2xl m-2"> */}
            <div className="p-6 md:p-10 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="bg-fireicon bg-white size-14 rounded-full flex justify-center items-center ">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#FF2424] "
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                      clipRule="evenodd"
                    />
                  </svg> */}
                  {/* Logo Img Example */}
                  <img src="spc.png" className="size-14" />
                </div>
                <div className="ml-2 md:ml-6 text-center">
                  <h2 className="font-bold md:tracking-widest uppercase text-xl sm:text-2xl text-gray-800">
                    Solo Parent System
                  </h2>
                  <p className="capitalize font-semibold text-xs md:text-right tracking-wide text-gray-600 ">
                    City of San Juan, Metro Manila
                  </p>
                </div>
              </div>

              <div className="w-full max-w-md mt-4 md:mt-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Log in to your Account
                </h2>

                {/* Email Input */}
                {/* <div className="relative w-full mt-4 rounded-lg">
                  <input
                    type="email"
                    id="username"
                    className="block px-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded border-2 border-red-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
                    placeholder=""
                    name="username"
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-xl font-semibold text-red-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
                  >
                    Email
                  </label>
                </div> */}
                <div className="relative w-full mt-4 rounded-lg">
                  <input
                    type="email"
                    id="email"
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
                {/* <div className="relative w-full mt-4 rounded-lg">
                  <input
                    type="password"
                    id="password"
                    className="block px-3 pb-2.5 pt-3 w-full text-sm text-[#A6A6A6] bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border--[#A6A6A6] focus:border-gray-500 peer shadow-md"
                    placeholder=""
                    name="password"
                  />

                  <label
                    htmlFor="password"
                    className="absolute text-xl font-bold text-[#A6A6A6] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
                  >
                    Password
                  </label>
                </div> */}
                <div className="relative w-full mt-4 rounded-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
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

                {/* 
                <div>
                  <label className="block text-gray-700 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex justify-end">
                   
                    <a
                   
                      className="text-xs text-red-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div> */}

                {/* Forgot Password Link */}
                <div className="text-right">
                  <span className="text-xs underline hover:text-red-600 text-red-500 cursor-pointer">
                    <a href="#">Forgot Password?</a>
                  </span>
                </div>

                {/* Login Button */}
                <button className="mt-6 w-full py-3 rounded bg-gradient-to-r from-[#D7263D] to-red-600 text-white font-semibold hover:from-[#D7263D] hover:to-red-700 transition-all duration-300 hover:scale-105 cursor-pointer shadow shadow-gray-700">
                  <h2 className="text-base uppercase font-bold tracking-widest">
                    Login
                  </h2>
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

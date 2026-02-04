export default function Login3() {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 min-h-screen bg-gray-50">
      {/* Left Section */}
      <div className="bg-gradient-to-t from-[#8B1E2F] to-[#FF2424] flex flex-col justify-center items-center text-center p-10 relative overflow-hidden border-8 border-white rounded-2xl">
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* <div className="bg-fireicon bg-white size-25 md:size-50 rounded-full flex justify-center items-center shadow shadow-red-300"></div> */}
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#FF2424] size-45 hidden md:block filter drop-shadow-[2px_2px_4px_#f7f7f7]"
          >
            <path
              fillRule="evenodd"
              d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.54 7 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
              clipRule="evenodd"
            />
          </svg> */}

          <div className="bg-fireicon bg-white size-45 rounded-full flex justify-center items-center filter drop-shadow-[2px_2px_4px_#2b2b2b] hidden md:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#FF2424]"
            >
              <path
                fillRule="evenodd"
                d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-white text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-4 ">
              Senior Citizen System
            </h3>
            <p className="text-gray-300 text-sm md:mx-14 leading-relaxed text-justify md:text-center">
              Senior Citizen's Birthday Cash Gift System
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="flex flex-col justify-center items-center p-10 md:px-16 bg-white gap-6">
        <div className="flex items-center">
          <div className="bg-fireicon bg-white size-13 rounded-full flex justify-center items-center shadow shadow-red-600">
            <svg
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
            </svg>
          </div>
          <div className="mx-2  text-center">
            <h2 className="font-bold tracking-widest uppercase text-lg md:text-2xl text-gray-800">
              Senior Citizen System
            </h2>
            <p className="capitalize font-semibold text-right tracking-wide text-gray-600">
              Senior Citizen's Birthday Cash Gift System
            </p>
          </div>
        </div>

        <div className="w-full max-w-md md:py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Log in to your Account
          </h2>

          {/* Email Input */}
          <div className="relative w-full mt-4 rounded-lg">
            <input
              type="email"
              id="username"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded border-2 border-red-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
              placeholder=""
              name="username"
            />
            <label
              htmlFor="email"
              className="absolute text-xl font-semibold text-red-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
            >
              Email
            </label>
          </div>

          {/* Password Input */}
          <div className="relative w-full mt-4 rounded-lg">
            <input
              type="email"
              id="password"
              className="block px-3 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded border-2 border-red-600 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
              placeholder=""
              name="password"
            />
            <label
              htmlFor="email"
              className="absolute text-xl font-semibold text-red-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
            >
              Password
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mt-2">
            <span className="text-sm underline text-[#8B1E2F] cursor-pointer">
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
          {/* <div className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?
            <a href="#" className="text-[#D7263D] hover:underline">
              Sign up
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

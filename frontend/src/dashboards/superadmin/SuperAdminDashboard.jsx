import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-white md:h-screen">
      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        <header className="bg-white border-b border-gray-200 flex flex-row items-center justify-center md:justify-start lg:justify-between md:px-6 md:py-2.5 p-2 shadow-sm">
          <button
            className="lg:hidden text-gray-800 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* HEADER TITLE */}
          <article className="hidden md:block">
            <h2 className="text-2xl font-bold text-gray-800 hidden md:block">
              Superadmin Dashboard
            </h2>
            <p className="text-gray-600 text-sm font-medium hidden md:block">
              Full access to all system features and settings
            </p>
          </article>

          <div className="flex items-center md:hidden">
            <div className="bg-red-600 border border-gray-400 size-14 rounded-md shadow flex justify-center items-center">
              <img src="SP.png" className="size-12 object-contain" />
            </div>

            <div className="leading-tight mx-2">
              <h2 className="font-bold uppercase text-gray-900 text-sm sm:text-base">
                Solo Parent System
              </h2>
              <p className="text-gray-500 text-xs">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white p-5 sm:p-6">
          <div className="md:hidden">
            <h3 className="text-xl text- font-bold text-gray-900 mb-0">
              Superadmin Dashboard
            </h3>
            <p className="text-gray-600 text-xs font-medium mb-3">
              Full access to all system features and settings
            </p>
          </div>

          {/* WELCOME SECTION */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-red-700 to-red-600 text-white p-5 sm:p-6 shadow-md mb-4">
            <h2 className="text-xl md:text-4xl font-bold tracking-tight">
              Welcome back!
            </h2>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur rounded-lg p-2 md:p-4">
                <p className="text-cyan-100">Email</p>
                <p className="font-semibold break-all">test6@test.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-2 md:p-4">
                <p className="text-cyan-100">Role</p>
                <p className="font-semibold uppercase">Superadmin</p>
              </div>
            </div>

            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          </section>

          {/* STATS SECTION - CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">7</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Admins
              </p>
            </div>
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">67</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Parents
              </p>
            </div>
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">7</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Verified
              </p>
            </div>
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">67</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Unverified
              </p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { use } from "react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [barangay, setBarangay] = useState([]);
  const [loading, setLoading] = useState(false);

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
              Admin Dashboard
            </h2>
            <p className="text-gray-600 text-sm font-medium hidden md:block">
              Here you can manage users and view system stats
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
              Admin Dashboard
            </h3>
            <p className="text-gray-600 text-xs font-medium mb-3">
              Here you can manage users and view system stats
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
                <p className="font-semibold break-all">test4@test.com</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-2 md:p-4">
                <p className="text-cyan-100">Role</p>
                <p className="font-semibold uppercase">Admin</p>
              </div>
            </div>

            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          </section>

          {/* STATS SECTION - CARDS */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">405</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Solo Parents
              </p>
            </div>
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">31</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Average Age of Solo Parents
              </p>
            </div>

            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">28</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total of Male Solo Parent
              </p>
            </div>

            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">67</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total of Female Solo Parent
              </p>
            </div>
          </section>
          {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
              <h3 className="text-4xl font-mono text-gray-700">405</h3>
              <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                Total Number of Solo Parents
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
                <h3 className="text-4xl font-mono text-gray-700">28</h3>
                <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                  Total of Male Solo Parent
                </p>
              </div>
              <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl text-center font-semibold shadow-md p-4 sm:p-6">
                <h3 className="text-4xl font-mono text-gray-700">67</h3>
                <p className="uppercase text-gray-900 text-sm sm:text-base tracking-tight md:tracking-wide">
                  Total of Female Solo Parent
                </p>
              </div>
            </div>
          </section> */}

          {/* LIST STATS OF BRGY - TABLE AND CARDS */}
          <section>
            {/* TITLE*/}
            <h3 className="text-xl font-semibold text-gray-800 mb-1 md:mb-2 mt-6">
              List of Solo Parents in a Barangay
            </h3>

            {/* SEARCH */}
            <div>
              <label className="block text-sm md:text-base text-gray-500 font-medium">
                Search by Name of Barangay
              </label>
              <div className="flex justify-center items-center border border-gray-200 py-1.5 rounded-md focus:outline-red-600 px-2 mb-2">
                {/* SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-gray-500 font-semibold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  className="border-none outline-none w-full ps-2 text-gray-800"
                  type="text"
                  placeholder=""
                />
              </div>
            </div>

            {/* DESKTOP STATS TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full hidden md:block">
              {/* TABLE */}
              <div className="overflow-x-auto rounded-t-xl">
                <table className="w-full text-lg">
                  <thead className="bg-gray-100 text-gray-900 text-lg uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Barangay</th>
                      <th className="px-4 py-3 text-left">Average Age</th>
                      <th className="px-4 py-3 text-left">Female</th>
                      <th className="px-4 py-3 text-left">Male</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-red-500"></td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-gray-600 font-medium tracking-widest text-base">
                        Barangay Official Name
                      </td>
                      <td className="px-4 py-3 text-left font-mono text-gray-800">
                        404
                      </td>
                      <td className="px-4 py-3 text-left font-mono text-gray-800">
                        101
                      </td>
                      <td className="px-4 py-3 text-left font-mono text-gray-800">
                        101
                      </td>
                    </tr>

                    {/* <tr>
                        <td colSpan="4">No data found</td>
                      </tr> */}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
                {/* LEFT */}
                <div className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>

                  <span className="font-medium">
                    Total Solo Parent in San Juan, Manila: 505
                  </span>
                  {/* <span className="font-medium">
                  Total Solo Parent: {totalCount}
                </span> */}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  {/* <span className="text-xs">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </span> */}

                  <span className="text-xs">
                    Page <span className="font-medium">1</span> of{" "}
                    <span className="font-medium">3</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                    // disabled={!prevPage}
                    // onClick={() => fetchAdmins(prevPage)}
                    // className={`px-3 py-1 rounded-md text-white ${
                    //   prevPage
                    //     ? "bg-red-600 hover:bg-red-700"
                    //     : "bg-gray-300 cursor-not-allowed"
                    // }`}
                    >
                      Prev
                    </button>

                    <button
                    // disabled={!nextPage}
                    // onClick={() => fetchAdmins(nextPage)}
                    // className={`px-3 py-1 rounded-md text-white ${
                    //   nextPage
                    //     ? "bg-red-600 hover:bg-red-700"
                    //     : "bg-gray-300 cursor-not-allowed"
                    // }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE STATS CARD */}
            <div>
              <div className="md:hidden mb-3">
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div>
                    <p className="text-sm text-gray-500">Total Solo Parent</p>
                    <p className="text-lg font-bold text-gray-900">505</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    <p className="text-xs text-gray-600">San Juan, Manila</p>
                  </div>
                </div>
              </div>

              <div className="md:hidden grid gap-4">
                <div className="relative rounded-xl p-[1px] bg-white border border-gray-200 shadow-lg">
                  <div className="bg-white rounded-2xl p-5 backdrop-blur-xl">
                    {/* Title & Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18"
                          />
                        </svg>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-900">
                        Barangay Name
                      </h4>
                    </div>

                    {/* Stats */}
                    <p className="text-sm text-gray-700 mt-1">
                      Average Age: 404
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Number of Male Solo Parent:101
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      Number of Female Solo Parent: 101
                    </p>
                  </div>
                </div>
              </div>

              {/* PAGINATION */}
              <div className="md:hidden flex items-center justify-between p-1 border-t border-gray-100 text-sm text-gray-500">
                {/* <span className="text-xs">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </span> */}
                <span className="text-xs">
                  Page <span className="font-medium">1</span> of{" "}
                  <span className="font-medium">3</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                  // disabled={!prevPage}
                  // onClick={() => fetchUsers(prevPage)}
                  // className={`px-3 py-1 border rounded-md text-white ${
                  //   prevPage
                  //     ? "bg-red-600 hover:bg-red-700"
                  //     : "bg-[var(--gray-2)] text-white cursor-not-allowed"
                  // }`}
                  >
                    Prev
                  </button>

                  <button
                  // disabled={!nextPage}
                  // onClick={() => fetchUsers(nextPage)}
                  // className={`px-3 py-1 border rounded-md text-white ${
                  //   nextPage
                  //     ? "bg-red-600 hover:bg-red-700 "
                  //     : "bg-[var(--gray-2)] cursor-not-allowed"
                  // }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

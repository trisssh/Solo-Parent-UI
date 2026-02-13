import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function UserDashboard() {
  const [isEdit, setIsEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user info from localStorage (dummy)
  const email = localStorage.getItem("email") || "user@test.com";

  return (
    // <div className="p-6">
    //   <h2 className="text-2xl font-bold mb-4"> My Profile User</h2>

    //   {isEdit ? (
    //     <div className="space-y-4">
    //       <input
    //         type="text"
    //         defaultValue={email}
    //         className="border p-2 rounded w-full"
    //       />
    //       <button
    //         className="bg-green-600 text-white px-4 py-2 rounded"
    //         onClick={() => setIsEdit(false)}
    //       >
    //         Save
    //       </button>
    //     </div>
    //   ) : (
    //     <div className="space-y-4">
    //       <p>Email: {email}</p>
    //       <button
    //         className="bg-[var(--red-3)] flex gap-1 items-center shadow shadow-gray-700 text-white px-10 py-2 rounded-lg font-semibold"
    //         onClick={() => setIsEdit(true)}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           viewBox="0 0 24 24"
    //           fill="currentColor"
    //           className="size-6"
    //         >
    //           <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
    //           <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
    //         </svg>
    //         <p> Edit Profile</p>
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div className="flex bg-white md:h-screen">
      {/* SIDEBAR */}
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        {/* HEADER */}
        <header className="bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-center md:justify-between md:px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
          {/* <button
            className="md:hidden text-white mr-3"
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
          </button> */}

          <div>
            <h2 className="text-3xl font-bold text-white hidden md:block">
              Profile
            </h2>
            <p className="text-white/90 text-sm font-semibold hidden md:block">
              Here you can view and edit your information
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-white size-14 rounded-full shadow-md shadow-red-700 flex justify-center items-center">
              <img src="SP.png" className="size-13 object-contain" />
            </div>

            <div className="leading-tight mx-1 md:mx-4">
              <h2 className="font-bold uppercase text-white text-lg sm:text-xl">
                Solo Parent System
              </h2>
              <p className="text-white/80 text-xs">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>
        </header>
        {/* <header className="bg-white border-b border-red-200 flex flex-row items-center justify-center md:justify-between md:px-6 p-2 shadow-sm">
          <button
            className="md:hidden text-gray-800 mr-3"
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

          <div>
            <h2 className="text-2xl font-bold text-gray-800 hidden md:block">
              Profile
            </h2>
            <p className="text-gray-600 text-sm font-medium hidden md:block">
              View and manage your personal information
            </p>
          </div>

          <div className="flex items-center">
            <div className="bg-white size-14 rounded-full border border-red-200 shadow flex justify-center items-center">
              <img src="spc.png" className="size-12 object-contain" />
            </div>

            <div className="leading-tight mx-2 md:mx-4">
              <h2 className="font-bold uppercase text-gray-900 text-sm sm:text-base">
                Solo Parent System
              </h2>
              <p className="text-gray-500 text-xs">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>
        </header> */}

        <main className="flex-1 overflow-y-auto bg-gray-50 p-5 sm:p-6">
          {/* MAIN GRID */}
          <h3 className="text-2xl text- font-bold text-gray-900 mb-3 md:hidden block">
            My Profile
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-1 space-y-6">
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
                    <div>
                      <h4 className="text-sm text-gray-400">Address</h4>
                      <p className="font-medium text-lg text-gray-800 mb-3">
                        031, Secret, Progreso, San Juan, Metro Manila
                      </p>
                    </div>
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

              {/* ACTION BUTTONS FOR EDIT */}
              <div className="flex justify-center md:justify-end gap-3">
                {/* <div className="bg-white backdrop-blur  rounded-2xl shadow-md flex justify-end gap-3"> */}
                <div className="p-0">
                  {isEdit ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        defaultValue={email}
                        className="border p-2 rounded w-full hidden"
                      />

                      <div className="flex gap-4">
                        <button
                          className="bg-[var(--gray-1)] text-white font-semibold shadow shadow-gray-700 px-4 md:px-10 py-2 rounded-lg"
                          onClick={() => setIsEdit(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 px-6 md:px-10 py-2 rounded-lg"
                          onClick={() => setIsEdit(false)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="hidden">Email: {email}</p>
                      <div className="flex gap-3">
                        {/* <button
                          className="bg-[var(--gray-1)] text-white font-semibold shadow shadow-gray-700 px-4 md:px-10 py-2 rounded-lg hidden"
                          onClick={() => setIsEdit(true)}
                        >
                          <p>Logout</p>
                        </button> */}
                        <button
                          className="bg-white border-2 border-[var(--red-3)] text-[var(--red-3)] flex gap-1 items-center shadow shadow-gray-700 px-2  py-1.5 rounded-lg font-semibold"
                          // className="bg-[var(--red-3)] border-2 flex[var(--red-3)] gap-1 items-center shadow shadow-gray-700 text-white px-10 py-2 rounded-lg font-semibold"
                          onClick={() => setIsEdit(true)}
                        >
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                              clipRule="evenodd"
                            />
                          </svg> */}

                          <p>Change Password</p>
                        </button>
                        <button
                          className="bg-[var(--red-3)] border-2 border-white text-white flex gap-1 justify-center items-center shadow shadow-gray-700 px-11 py-1 rounded-lg font-semibold"
                          onClick={() => setIsEdit(true)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                          </svg>
                          <p> Edit Profile</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";


export default function UserDashboard() {
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showModal, setShowModal] =useState(false);
  const navigate = useNavigate();

  //View ID
    // useEffect(() => {
    //   setShowModal(true);
    // }, []);
    const toggleModal = () => {
      setShowModal(true)
    }


  //LOGOUT
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
        logoutUser();
      }
    });
  };

  //Guard the fetch on user and authTokens
const fetchUser = async () => {
  try {
    console.time("API");

    const response = await fetch(
      `http://127.0.0.1:8000/api/parent/info/${user.pk}`,
      {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      },
    );

    console.timeEnd("API");

    if (!response.ok) throw new Error("Failed to fetch user");

    const data = await response.json();
    console.log("API RESPONSE:", data);

    setUserInfo(data);
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

useEffect(() => {
  if (!user?.pk || !authTokens?.access) return;

  fetchUser();
}, [user?.pk, authTokens?.access]);
 

  //Calculate Parent's Age
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  const BASE_URL = "http://127.0.0.1:8000";

  const idImage = userInfo?.image?.find((img) => img.image_type === "id")?.image;

  const signatureImage = userInfo?.image?.find(
  (img) => img.image_type === "signature",
  )?.image;

  const idImageUrl = idImage ? `${BASE_URL}${idImage}` : null;
  const signatureImageUrl = signatureImage
  ? `${BASE_URL}${signatureImage}`
  : null;

  // console.log(userInfo?.image);

  //console test
  useEffect(() => {
    console.log("User info loaded:", userInfo);
  }, [userInfo]);

   return (
     <div className="flex bg-white md:h-screen">
       {/* SIDEBAR */}
       {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

       {/* MAIN CONTENT */}
       <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
         {/* HEADER */}
         <header className="relative z-50 bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-between px-4 sm:px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
           <div className="flex items-center">
             <div className="bg-white size-12 sm:size-14 rounded-full shadow-md shadow-red-700 flex justify-center items-center">
               <img
                 src="SP.png"
                 className="size-12 sm:size-13 object-contain"
               />
             </div>

             <div className="leading-tight mx-2 md:mx-4">
               <h2 className="font-bold uppercase text-white text-base sm:text-xl">
                 Solo Parent System
               </h2>
               <p className="text-white/80 text-[10px] sm:text-xs">
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
                 {userInfo?.parent?.email ?? user?.email ?? "Loading..."}
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

         <main className="flex-1 overflow-y-auto bg-white p-5 sm:p-6">
           {/* MAIN GRID */}
           <div>
             <h3 className="text-2xl text- font-bold text-gray-900 mb-0">
               Profile
             </h3>
             <p className="text-gray-600 text-sm font-medium mb-3">
               View all your details here
             </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* LEFT COLUMN */}
             <div className="lg:col-span-1 space-y-4">
               {/* PROFILE CARD */}
               <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-center">
                 {/* <svg
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
                 </svg> */}

                 {idImageUrl ? (
                   <img
                     src={idImageUrl}
                     alt="Signature"
                     className="size-6 text-red-500 w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-red-300 shadow"
                     //  className="h-28 object-contain border rounded-lg bg-white p-2"
                   />
                 ) : (
                   <p className="text-sm text-gray-400">ID not available</p>
                 )}

                 <h2 className="mt-4 text-xl font-semibold text-gray-800 capitalize">
                   {`${userInfo?.parent?.first_name || ""} ${userInfo?.parent?.middle_name || ""} ${userInfo?.parent?.last_name || ""}`.trim() ||
                     "Loading..."}
                 </h2>

                 <p className="text-sm text-gray-500 uppercase tracking-wide">
                   Solo Parent
                 </p>

                 <div className="mt-4 flex justify-center">
                   {/* {userInfo?.parent?.is_verified ? (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                  ✔ Verified
                </span>
              ) : (
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                  ✖ Unverified
                </span>
              )} */}
                   {/* <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    Verified
                  </span> */}

                   <span className="px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                     {userInfo?.parent?.is_verified ? "Verified" : "Unverified"}
                   </span>
                 </div>
               </div>

               {/* ID DETAILS */}
               <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="font-semibold text-gray-700">ID Details</h3>
                   <button
                     onClick={toggleModal}
                     disabled={!userInfo?.parent?.is_verified}
                     className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white
                    backdrop-blur rounded-xl shadow-sm transition
                    ${
                      userInfo?.parent?.is_verified
                        ? "bg-red-500 hover:bg-red-700 hover:shadow-md active:scale-95"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 24 24"
                       fill="currentColor"
                       className="w-4 h-4"
                     >
                       <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                       <path
                         fillRule="evenodd"
                         d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                         clipRule="evenodd"
                       />
                     </svg>

                     <span>View ID</span>
                   </button>
                 </div>

                 <p className="text-sm text-gray-400">ID Number</p>
                 <p className="font-medium text-lg text-gray-800 mb-3">
                   {userInfo?.parent?.uuid || "Loading..."}
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

                 {/* <div className="flex justify-center">
                   {signatureImageUrl ? (
                     <img
                       src={signatureImageUrl}
                       alt="Signature"
                       className="h-28 object-contain rounded-lg bg-white p-2"
                     />
                   ) : (
                     <p className="text-sm text-gray-400">
                       E-Signature not available
                     </p>
                   )}
                 </div> */}
                 <div className="flex justify-center">
                   {!signatureImageUrl ? (
                     <div className="h-28 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
                   ) : (
                     <img
                       src={signatureImageUrl}
                       alt="Signature"
                       className="h-28 object-contain rounded-lg bg-white p-2"
                     />
                   )}
                 </div>
               </div>
             </div>

             {/* RIGHT COLUMN */}
             <div className="lg:col-span-2 space-y-4 md:space-y-7">
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
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.first_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">Middle Name</h4>
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.middle_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">Last Name</h4>
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.last_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">Suffix</h4>
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.suffix || "N/A"}
                       </p>
                     </div>
                   </div>

                   {/* Bday and Gender */}
                   <div className="grid md:grid-cols-2 ">
                     <div>
                       <h4 className="text-sm text-gray-400">Date of Birth</h4>
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.birthday || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">Gender</h4>
                       <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                         {userInfo?.parent?.gender || "N/A"}
                       </p>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-sm text-gray-400">Address</h4>
                     <p className="font-medium text-lg text-gray-800 mb-3 capitalize">
                       {`${userInfo?.parent?.house || ""} ${userInfo?.parent?.street || ""} ${userInfo?.parent?.subdivision || ""} ${userInfo?.parent?.barangay || ""} ${userInfo?.parent?.city || ""} ${userInfo?.parent?.province || ""}`.trim() ||
                         "N/A"}
                     </p>
                   </div>
                 </div>
               </div>

               {/* CONTACT INFORMATION */}
               <div className="backdrop-blur-lg bg-white border border-gray-200  rounded-2xl shadow-md p-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4">
                   Contact Information
                 </h3>

                 {/* Email & Contact no */}
                 <div className="grid md:grid-cols-2">
                   <div>
                     <h4 className="text-sm text-gray-400">Email</h4>
                     <p className="font-medium text-lg text-gray-800 mb-3">
                       {userInfo?.parent?.email || user.email || "N/A"}
                     </p>
                   </div>
                   <div>
                     <h4 className="text-sm text-gray-400">Contact Number</h4>
                     <p className="font-medium text-lg text-gray-800 mb-3">
                       {userInfo?.parent?.phone || "N/A"}
                     </p>
                   </div>
                 </div>

                 <div className="container">
                   {/* Emergency Contail Details */}
                   <div className="grid md:grid-cols-2 ">
                     <div>
                       <h4 className="text-sm text-gray-400">
                         Emergency Contact's First Name
                       </h4>
                       <p className="font-medium text-lg text-gray-800 mb-3">
                         {userInfo?.contact?.first_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">
                         Emergency Contact's Middle Name
                       </h4>
                       <p className="font-medium text-lg text-gray-800 mb-3">
                         {userInfo?.contact?.middle_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">
                         Emergency Contact's Last Name
                       </h4>
                       <p className="font-medium text-lg text-gray-800 mb-3">
                         {userInfo?.contact?.last_name || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">
                         Emergency Contact's Suffix
                       </h4>
                       <p className="font-medium text-lg text-gray-800 mb-3">
                         {userInfo?.contact?.suffix || "N/A"}
                       </p>
                     </div>
                     <div>
                       <h4 className="text-sm text-gray-400">
                         Emergency Contact's Phone Number
                       </h4>
                       <p className="font-medium text-lg text-gray-800 mb-3">
                         {userInfo?.contact?.phone || "N/A"}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           {/* MODAL */}
           {showModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
               <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center">
                 <h2 className="text-xl font-semibold mb-3 text-gray-800">
                   Solo Parent ID
                 </h2>
                 <p className="text-gray-600 mb-6 text-justify">
                   Solo Parent ID coming soon<br></br>Thank you for your
                   patience.
                 </p>
                 <button
                   onClick={() => setShowModal(false)}
                   className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md"
                 >
                   Okay
                 </button>
               </div>
             </div>
           )}
         </main>
       </div>
     </div>
   );
}

import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";

export default function AdminList() {
  const { authTokens, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/api/admin/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  //Filter
//   const filteredUsers = users.filter((u) => {
//     const name = getFullName(u).toLowerCase();

//     const matchesSearch = name.includes(search.toLowerCase());

//     const matchesFilter =
//       filter === "all" ||
//       (filter === "verified" && u.is_verified) ||
//       (filter === "unverified" && !u.is_verified);

//     return matchesSearch && matchesFilter;
//   });
  return (
    <div className="flex bg-white md:h-screen">
      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
        <header className="bg-white border-b border-gray-200 flex flex-row items-center justify-center md:justify-between md:px-6 md:py-2.5 p-2 shadow-sm">
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
              User Management
            </h2>
            <p className="text-gray-600 text-sm font-medium hidden md:block">
              To manage admin accounts
            </p>
          </div>

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
          {/* PAGE TITLE */}
          <article className="md:hidden">
            <h3 className="text-xl text- font-bold text-gray-900 mb-0">
              List of Admin's Account
            </h3>
            <p className="text-gray-600 text-xs font-medium mb-3">
              To manage Admin's Account
            </p>
          </article>

       
            {/* SEARCH & FILTER & ADD Button  */}
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-sm md:text-base text-gray-700 font-medium">
                  Search by
                </label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder=""
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-1.5 outline-none"
                  />

                  <button className="bg-red-600 text-white px-6 hover:bg-red-700">
                    Search
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm md:text-base text-gray-700 font-medium">
                  Filter by
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg w-full py-1.5 px-3"
                >
                  <option value="all">All</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                // onClick={() => setOpenCreate(true)}
                className="flex items-center gap-1 justify-center md:mt-5.5 py-2 md:py-0 w-full  rounded bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add Admin Account
              </button>
            </div>
        

          {/* ADMIN LIST TABLE -- MOBILE VIEW  */}
    
          {/* <div className="md:hidden space-y-4">
            {filteredUsers.map((u) => {
              const idImage = u.image?.find(
                (img) => img.image_type === "id",
              )?.image;

              const idImageUrl = idImage
                ? `http://127.0.0.1:8000${idImage}`
                : null;

              return (
                <div
                  key={u.id}
                  className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6"
                >
                  <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
                      {idImageUrl ? (
                        <img
                          src={idImageUrl}
                          alt="ID"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-red-600">
                          {u.first_name?.[0]}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-lg text-gray-900">
                        {getFullName(u)}
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        ID: {u.uuid}
                      </div>

                      <div className="text-sm text-gray-600">
                        Birthday: {u.birthday}
                      </div>

                      <div className="text-sm text-gray-600">
                        Gender: {u.gender}
                      </div>

                      <div className="mt-2">
                        {u.is_verified ? (
                          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleView(u)}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg"
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div> */}
        </main>
      </div>
    </div>
  );
}

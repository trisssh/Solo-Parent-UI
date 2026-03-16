import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";

export default function AdminList() {
    const { authTokens, user } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    const fetchAdmins = async () => {
    try {
        const token = authTokens?.access;

        const response = await fetch("http://127.0.0.1:8000/api/admin/list", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await response.json();
        //   setAdmins(data);
        setAdmins(data.results);

        // Save pagination URLs
        setNextPage(data.next);
        setPrevPage(data.previous);

        // Save total count
        setTotalCount(data.count);
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
    // const filteredAdmins = admins.filter((u) => {
    

    //   const matchesSearch = name.includes(search.toLowerCase());

    //   const matchesFilter =
    //     filter === "all" ||
    //     (filter === "verified" && u.is_verified) ||
    //     (filter === "unverified" && !u.is_verified);

    //   return matchesSearch && matchesFilter;
    // });

  // RENDER
//   if (loading) {
//     return <p className="text-center mt-10">Loading admins...</p>;
//   }

    const getOffsetFromUrl = (url) => {
    if (!url) return 0;
    const params = new URL(url).searchParams;
    return parseInt(params.get("offset")) || 0;
    };

    const limit = admins.length || 5;

    const offset = prevPage ? getOffsetFromUrl(prevPage) + limit : 0;

    const totalPages = Math.ceil(totalCount / limit);

    const currentPage = Math.floor(offset / limit) + 1;




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
              onClick={() => setOpenCreate(true)}
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

          {/* ADMIN LIST TABLE -- DEKSTOP VIEW  */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full hidden md:block">
            {/* TABLE */}
            <div className="overflow-x-auto rounded-t-xl">
              <table className="w-full text-lg">
                <thead className="bg-gray-100 text-gray-900 text-lg uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 font-mono">
                        {admin.id}
                      </td>

                      <td className="px-4 py-3">{admin.email}</td>

                      <td className="px-4 py-3">
                        {admin.is_superuser ? (
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-pink-100 text-pink-600">
                            Superadmin
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-600">
                            Admin
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <button className="text-red-600 hover:text-red-700 text-sm hover:underline hover:cursor-pointer">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
              {/* LEFT */}
              <span className="font-medium">
                Total Admins & Superadmins: {totalCount}
              </span>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <span className="text-xs">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!prevPage}
                    onClick={() => fetchUsers(prevPage)}
                    className={`px-3 py-1 rounded-md text-white ${
                      prevPage
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Prev
                  </button>

                  <button
                    disabled={!nextPage}
                    onClick={() => fetchUsers(nextPage)}
                    className={`px-3 py-1 rounded-md text-white ${
                      nextPage
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN LIST -- MOBILE VIEW CARD */}
          <div>
            {/* ADMIN CARD */}
            <div className="md:hidden space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6"
                >
                  <div className="font-semibold text-lg text-gray-900">
                    Email: {admin.email}
                  </div>
                  <div className="mt-2">
                    {admin.is_superuser ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                        Superadmin
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Admin
                      </span>
                    )}
                  </div>

                  <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg">
                    View
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="md:hidden flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
              <span className="text-xs">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </span>
              {/* <span className="text-sm font-medium">
              {totalLabel}: {filteredUsers.length}
            </span> */}

              <div className="flex items-center gap-2">
                <button
                  disabled={!prevPage}
                  onClick={() => fetchUsers(prevPage)}
                  className={`px-3 py-1 border rounded-md text-white ${
                    prevPage
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[var(--gray-2)] text-white cursor-not-allowed"
                  }`}
                >
                  Prev
                </button>

                <button
                  disabled={!nextPage}
                  onClick={() => fetchUsers(nextPage)}
                  className={`px-3 py-1 border rounded-md text-white ${
                    nextPage
                      ? "bg-red-600 hover:bg-red-700 "
                      : "bg-[var(--gray-2)] cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {openCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div
                className="relative z-10 w-full max-w-2xl mx-4 bg-white shadow-xl rounded-xl p-8 max-h-[90vh] overflow-y-auto"
              >
                {/* Close button */}
                <button
                  onClick={() => setOpenCreate(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                {/* Modal title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  Create an account
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create an account for Admin and Superadmin
                </p>

                {/* <div
                  onSuccess={() => {
                    setOpenCreate(false);
                    fetchAdmins(); // refresh list after creating admin
                  }}
                /> */}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

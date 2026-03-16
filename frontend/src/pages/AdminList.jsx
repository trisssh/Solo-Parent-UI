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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
    

  // SWEET ALERT HELPER
  const showAlert = ({ title, message, icon = "error" }) => {
    Swal.fire({
      title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
      html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
      icon,
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
    });
  };

  // FETCH USERS
 const fetchAdmins = async (url = null) => {
   if (!authTokens?.access) return;

   if (!url) {
     url = `http://127.0.0.1:8000/api/admin/list?search=${search}`;

     if (filter === "superadmin") {
       url += "&is_superuser=true";
     } else if (filter === "admin") {
       url += "&is_superuser=false";
     }
   }

   try {
     const res = await fetch(url, {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${authTokens.access}`,
       },
     });

     if (!res.ok) throw new Error("Failed to fetch admins");

     const data = await res.json();

     setAdmins(data.results);
     setNextPage(data.next);
     setPrevPage(data.previous);
     setTotalCount(data.count);
   } catch (err) {
     console.error(err);
   } finally {
     setLoading(false);
   }
 };

  // PAGINATION RESET
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAdmins();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, filter]);

  const getOffsetFromUrl = (url) => {
    if (!url) return 0;
    const params = new URL(url).searchParams;
    return parseInt(params.get("offset")) || 0;
  };

  // FETCH CREATE
 const createAdmin = async (e) => {
   e.preventDefault();

   try {
     const res = await fetch(
       "http://127.0.0.1:8000/api/superadmin/create-admin",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${authTokens.access}`,
         },
         body: JSON.stringify({
           email: email,
           password: password,
           is_superuser: role === "superadmin",
         }),
       },
     );

     const data = await res.json();

     if (!res.ok) {
       throw new Error(data?.detail || "Failed to create admin");
     }

    showAlert({
      title: "Success",
      message: "User updated successfully",
      icon: "success",
    });

     setOpenCreate(false);
     setEmail("");
     setPassword("");
     setRole("admin");

     fetchAdmins(); // refresh table
   } catch (err) {
    showAlert({
      title: "Error",
      text: err.message,
      icon: "error",
    });
   }
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
                    onClick={() => fetchAdmins(prevPage)}
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
                    onClick={() => fetchAdmins(nextPage)}
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
                  onClick={() => fetchAdmins(prevPage)}
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
                  onClick={() => fetchAdmins(nextPage)}
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

          {/* MODAL TO CREATE ADD ADMIN ACCOUNT */}
          {openCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative z-10 w-full max-w-2xl mx-4 bg-white shadow-xl rounded-xl p-8 max-h-[90vh] overflow-y-auto">
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

                <form onSubmit={createAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder=" "
                      name="password"
                    />

                    {/* Eye icon */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-10 top-54 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

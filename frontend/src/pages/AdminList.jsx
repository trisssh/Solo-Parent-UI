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
  const [selectedUser, setSelectedUser] = useState(null);

  // SWEET ALERT HELPER
  const showAlert = ({
      title,
      message,
      icon = "error",
      showCancelButton = false,
      confirmButtonText = "Okay",
      cancelButtonText = "Cancel",
    }) => {
      return Swal.fire({
        title: `<p class="text-2xl font-semibold text-gray-800">${title}</p>`,
        html: `<p class="text-xl text-gray-600 mt-1">${message}</p>`,
        icon,
        iconColor: "#DC2626",
        background: "#ffffff",
        showConfirmButton: true,
        showCancelButton,
        cancelButtonText,
        confirmButtonText,
        buttonsStyling: false,
        customClass: {
          popup: "rounded-xl px-6 py-4",
          cancelButton:
            "mt-4 ml-2 bg-[var(--gray-1)] text-black px-6 py-2 rounded text-base text-white",
          confirmButton:
            "mt-4 bg-red-600 text-white px-6 py-2 rounded text-base hover:bg-red-700",
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
        message: "Admin account created successfully",
        icon: "success",
      });

      setOpenCreate(false);
      setEmail("");
      setPassword("");
      setRole("admin");

      fetchAdmins(); // refresh table
    } catch (err) {
       
      let errorMessage = err.message

       if (errorMessage.toLowerCase().includes("already exists")) {
         errorMessage =
           "This email is already registered. Please try another email.";
       }

      showAlert({
        title: "Error",
        message: err.message,
        icon: "error",
      });
    }
  };

  // HANDLERS
  const handleView = (admin) => {
    setSelectedUser(admin);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setShowModal(false);
    setIsEdit(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  // UPDATE USER
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/superadmin/edit-admin/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            email: selectedUser.email,
            is_superuser: selectedUser.is_superuser,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();

      fetchAdmins(); // reload updated data

      showAlert({
        title: "Success",
        message: "Admin updated successfully",
        icon: "success",
      });

      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const limit = 5;

  const offset = prevPage ? getOffsetFromUrl(prevPage) + limit : 0;

  const totalPages = Math.ceil(totalCount / limit);

  const currentPage = Math.floor(offset / limit) + 1;

  
  // DELETE USER
  const handleDelete = async () => {
    const confirm = await showAlert({
      title: "Delete User?",
      message: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete account",
      cancelButtonText: "No, Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/delete/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to delete admin");

      showAlert({
        title: "Deleted!",
        message: "Admin account has been deleted.",
        icon: "success",
      });

      fetchAdmins();
      handleClose();
    } catch (err) {
      showAlert({
        title: "Error",
        message: err.message,
      });
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-800">
              User Management
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              To manage admin accounts
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
              <label className="block text-sm md:text-base text-gray-500 font-medium">
                Search by Email
              </label>
              <div className="flex justify-center items-center border border-gray-200 py-1.5 rounded-md focus:outline-red-600 px-2">
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-base text-gray-500 font-medium">
                Filter by
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-md w-full py-1.5 px-3 text-gray-800"
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
                        <button
                          onClick={() => handleView(admin)}
                          className="text-red-600 hover:text-red-700 text-sm hover:underline hover:cursor-pointer capitalize"
                        >
                          View information
                        </button>
                      </td>
                    </tr>
                  ))}


                  {/* EMPTY STATE */}
                  {admins.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-400"
                      >
                        No Admin found
                      </td>
                    </tr>
                  )}
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

                  <button
                    onClick={() => handleView(admin)}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg"
                  >
                    View
                  </button>
                </div>
              ))}

              {/* EMPTY STATE */}
              {admins.length === 0 && (
                <div className="backdrop-blur-lg bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                  <div colSpan="6" className="text-center py-6 text-gray-400">
                    No Admin found
                  </div>
                </div>
              )}
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

          {/* MODAL VIEW */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative z-10 w-full max-w-2xl mx-4 bg-white shadow-xl rounded-xl p-8 max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                {/* Modal title */}
                <h3 className="text-lg font-semibold text-gray-800">
                  Manage admin account
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  To view and edit account for Admin and Superadmin
                </p>

                <form className="space-y-4">
                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={selectedUser?.email || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* ROLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>

                    <select
                      name="is_superuser"
                      value={selectedUser?.is_superuser ? "true" : "false"}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          is_superuser: e.target.value === "true",
                        })
                      }
                      disabled={!isEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="false">Admin</option>
                      <option value="true">Superadmin</option>
                    </select>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-6 ">
                    {isEdit ? (
                      <>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                            onClick={handleClose}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                          {/* <button disabled={saving} 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                        {saving ? "Saving..." : "Save"}
                      </button> */}
                        </div>

                        <button
                          type="button"
                          onClick={handleDelete}
                          className="border-2 border-red-600 py-1.5 rounded-lg w-full mt-3 text-red-600 font-semibold hover:cursor-pointer"
                        >
                          Delete an account
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="w-full flex gap-1 justify-center items-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                        onClick={handleEdit}
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

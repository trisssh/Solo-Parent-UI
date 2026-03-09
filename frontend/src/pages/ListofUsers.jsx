import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";

export default function ListofUsers() {
  const { authTokens, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // ROLE PROTECTION
  if (!user || (!user.is_staff && !user.is_superuser)) {
    return (
      <p className="text-center mt-10 text-red-600 font-bold">Access Denied</p>
    );
  }

  // FETCH USERS
  // const fetchUsers = async () => {
  //   if (!authTokens?.access) return;

  //   try {
  //     const res = await fetch("http://127.0.0.1:8000/api/parent/list", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authTokens.access}`,
  //       },
  //     });

  //     if (!res.ok) throw new Error("Failed to fetch users");

  //     const data = await res.json();
  //     console.log(data);
  //     setUsers(data.results || data);
  //   } catch (err) {
  //     showAlert("Error", err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchUsers = async (url = "http://127.0.0.1:8000/api/parent/list") => {
    if (!authTokens?.access) return;

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();

      // Set the array of users
      setUsers(data.results);

      // Save pagination URLs
      setNextPage(data.next);
      setPrevPage(data.previous);

      // Save total count
      setTotalCount(data.count);
    } catch (err) {
      showAlert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [authTokens]);

  // HANDLERS
  const handleView = (user) => {
    setSelectedUser(user);
    setIsEdit(false);
    setShowModal(true);
  };
  const handleClose = () => {
    setSelectedUser(null);
    setShowModal(false);
    setIsEdit(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_verified") {
      setSelectedUser({
        ...selectedUser,
        is_verified: value === "true",
      });
    } else {
      setSelectedUser({
        ...selectedUser,
        [name]: value,
      });
    }
  };

  // UPDATE USER
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/parent/info/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(selectedUser),
        },
      );

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();

      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

       showAlert({
         title: "Success",
         message: "User updated successfully",
         icon: "success",
       });
      handleClose();
    } catch (err) {
      // showAlert("Error", err.message);
    }
  };

  // DELETE USER
  const handleDelete = async () => {
    const confirm = await showAlert({
      title: "Are you sure?",
      message: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    console.log("User confirmed delete");
  };

  const getFullName = (u) =>
    [u.first_name, u.middle_name, u.last_name, u.suffix]
      .filter(Boolean)
      .join(" ");

  // RENDER
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

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

    // const currentPage = prevPage
    //   ? parseInt(new URL(prevPage).searchParams.get("offset") / 10) + 2
    //   : 1;

    // <span>Page: {currentPage}</span>;

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
              To manage registered parent accounts
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
          {/* <article className="md:hidden">
            <h3 className="text-xl text- font-bold text-gray-900 mb-0">
              List of Parent's Account
            </h3>
            <p className="text-gray-600 text-xs font-medium mb-3">
              To manage Solo Parent's Account Details
            </p>
          </article> */}

          {/* SEARCH & FILTER BY */}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-700 font-medium">
                Search by
              </label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 px-3 py-2 outline-none"
                />

                <button className="bg-red-600 text-white px-6 hover:bg-red-700">
                  Search
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">
                Filter by
              </label>
              <select className="border border-gray-200 rounded-lg w-full py-2 px-3">
                <option>All</option>
                <option>Verified</option>
                <option>Unverified</option>
              </select>
            </div>
          </div>

          {/* SEARCH */}
          {/* <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
              Search
            </button>
          </div> */}

          {/* CLIENT LIST TABLE */}
          {/* <table className="w-full shadow-md text-xs sm:text-sm md:text-base">
            <thead className="bg-red-600 text-black">
              <tr>
                <th className="p-3 border text-gray-100">ID</th>
                <th className="p-3 border text-gray-100">Full Name</th>
                <th className="p-3 border text-gray-100">Birthday</th>
                <th className="p-3 border text-gray-100">Gender</th>
                <th className="p-3 border text-gray-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{u.id}</td>
                  <td className="p-3 border">{getFullName(u)}</td>
                  <td className="p-3 border">{u.birthday}</td>
                  <td className="p-3 border">{u.gender}</td>
                  <td className="p-3 border text-center">
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() => handleView(u)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}

          {/* <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Birthday
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Gender</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{u.id}</td>

                    <td className="px-4 py-3 font-medium text-gray-700">
                      {getFullName(u)}
                    </td>

                    <td className="px-4 py-3 text-gray-600">{u.birthday}</td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                        {u.gender}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleView(u)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg shadow-sm hover:bg-red-600 hover:shadow transition active:scale-95"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Full Name</th>
                  <th className="p-3 text-left">Birthday</th>
                  <th className="p-3 text-left">Gender</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{u.uuid}</td>

                    <td className="p-3 font-medium text-gray-900">
                      {getFullName(u)}
                    </td>

                    <td className="p-3">{u.birthday}</td>

                    <td className="p-3 capitalize">{u.gender}</td>

                    <td className="p-3">
                      {u.is_verified ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                          Unverified
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleView(u)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* TABLE */}
            <div className="overflow-x-auto rounded">
              <table className="w-full text-sm text-gray-950">
                <thead className="bg-gray-200 text-gray-900 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Full Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Birthday
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      {/* ID */}
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                        {u.uuid}
                      </td>

                      {/* NAME + AVATAR */}
                      <td className="px-4 py-3 flex items-center gap-3">
                        {/* <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-600">
                          {u.first_name?.[0]}
                        </div> */}

                        <span className="font-medium text-gray-900">
                          {getFullName(u)}
                        </span>
                      </td>

                      {/* BIRTHDAY */}
                      <td className="px-4 py-3">{u.birthday}</td>

                      {/* GENDER */}
                      <td className="px-4 py-3 capitalize">{u.gender}</td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        {u.is_verified ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleView(u)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
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
              <span>
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{users.length}</span> results
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={!prevPage}
                  onClick={() => fetchUsers(prevPage)}
                  className={`px-3 py-1 border rounded-md text-white ${
                    prevPage
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[var(--gray-2)] text-white cursor-not-allowed"
                  }`}
                  // className="px-3 py-1 border rounded-md hover:bg-gray-50"
                >
                  Prev
                </button>

                {/* <button className="px-3 py-1 bg-red-600 text-white rounded-md">
                  1
                </button>

                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
                  2
                </button> */}

                <button
                  disabled={!nextPage}
                  onClick={() => fetchUsers(nextPage)}
                  className={`px-3 py-1 border rounded-md text-white ${
                    nextPage
                      ? "bg-red-600 hover:bg-red-700 "
                      : "bg-[var(--gray-2)] cursor-not-allowed"
                  }`}
                  // className="px-3 py-1 border rounded-md hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          {/* PAGINATION  */}
          {/* <div className="flex justify-between mt-4 items-center">
            <span className="text-sm">
              Total Parent's Account: {totalCount}
            </span>

            <div className="flex gap-2">
              <button
                disabled={!prevPage}
                onClick={() => fetchUsers(prevPage)}
                className={`text-sm md:text-base px-4 md:py-2 rounded text-white ${
                  prevPage
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[var(--gray-2)] cursor-not-allowed"
                }`}
              >
                Prev
              </button>

              <button
                disabled={!nextPage}
                onClick={() => fetchUsers(nextPage)}
                className={`text-sm md:text-base px-4 md:py-2 rounded text-white ${
                  nextPage
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[var(--gray-2)] cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div> */}

          {/* MODAL */}
          {showModal && selectedUser && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Parent Details</h3>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      value={selectedUser.first_name || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Middle Name
                    </label>
                    <input
                      name="middle_name"
                      value={selectedUser.middle_name || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={selectedUser.last_name || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Suffix
                    </label>
                    <input
                      name="suffix"
                      value={selectedUser.suffix || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={selectedUser.birthday || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={selectedUser.gender || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={selectedUser.phone || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Street
                    </label>
                    <input
                      name="street"
                      value={selectedUser.street || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Barangay
                    </label>
                    <select
                      name="barangay"
                      value={selectedUser.barangay || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg capitalize"
                    >
                      <option value="">Select Barangay</option>
                      <option value="greenhills">Greenhills</option>
                      <option value="maytunas">Maytunas</option>
                      <option value="kabayanan">Kabayanan</option>
                      <option value="salapan">Salapan</option>
                      <option value="west_crame">West Crame</option>
                      <option value="onse">Onse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Subdivision
                    </label>
                    <input
                      name="subdivision"
                      value={selectedUser.subdivision || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium">
                      Status
                    </label>
                    <select
                      name="is_verified"
                      value={String(selectedUser.is_verified)}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg capitalize"
                    >
                      <option value="">Select Status</option>
                      <option value="true">Verified</option>
                      <option value="false">Unverified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium">
                      Reason
                    </label>
                    <select
                      name="reason"
                      value={selectedUser.reason || ""}
                      onChange={handleChange}
                      disabled={!isEdit}
                      className="border border-gray-200 p-2 w-full mb-2 rounded-lg capitalize"
                    >
                      <option value="">Select Reason</option>
                      <option value="crime_against_chastity">
                        Crime Against Chastity
                      </option>
                      <option value="death_of_spouse">Death of Spouse</option>
                      <option value="spouse_detained">
                        Spouse is Detained
                      </option>
                      <option value="physical_mental_incapacity">
                        Physical/Mental Incapacity of Spouse
                      </option>
                      <option value="separation">
                        Legal/De Facto Separation
                      </option>
                      <option value="annuled">Annulment of Marriage</option>
                      <option value="abandonment">Abandonment of Spouse</option>
                      <option value="preferred_to_keep">
                        Preferred To Keep Child/Children Instead of Giving Them
                        To Welfare
                      </option>
                      <option value="sole_provider">
                        Solely Provides Parental Care
                      </option>
                      <option value="assumed_responsibility">
                        Assumed Responsibility of Head of Family
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  {isEdit ? (
                    <>
                      <button
                        className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                        onClick={() => setIsEdit(false)}
                      >
                        Cancel
                      </button>

                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                      onClick={() => setIsEdit(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <button
                  className="absolute top-3 right-4 text-gray-500"
                  onClick={handleClose}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

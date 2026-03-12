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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  // const [saving, setSaving] = useState(false);
  // const [page, setPage] = useState(2);
  // const [totalPages, setTotalPages] = useState(1);
  //  const [pages, setPages] = useState([]);

  // ROLE PROTECTION
  if (!user || (!user.is_staff && !user.is_superuser)) {
    return (
      <p className="text-center mt-10 text-red-600 font-bold">Access Denied</p>
    );
  }

  // FETCH USERS
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

      fetchUsers(); // reload updated data

      showAlert({
        title: "Success",
        message: "User updated successfully",
        icon: "success",
      });

      handleClose();
    } catch (err) {
      console.error(err);
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

  //Filter
  const filteredUsers = users.filter((u) => {

    const name = getFullName(u).toLowerCase();

    const matchesSearch = name.includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "verified" && u.is_verified) ||
      (filter === "unverified" && !u.is_verified);

    return matchesSearch && matchesFilter;
  });


  //Span filter
  // let totalLabel = "Total of Registered Accounts";

  // if (filter === "verified") {
  //   totalLabel = "Total of Verified Accounts";
  // } else if (filter === "unverified") {
  //   totalLabel = "Total of Unverified Accounts";
  // }

const getOffsetFromUrl = (url) => {
  if (!url) return 0;
  const params = new URL(url).searchParams;
  return parseInt(params.get("offset")) || 0;
};

const limit = users.length || 5;

const offset = prevPage ? getOffsetFromUrl(prevPage) + limit : 0;

const totalPages = Math.ceil(totalCount / limit);

const currentPage = Math.floor(offset / limit) + 1;


//date reformat
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

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
          <article className="md:hidden">
            <h3 className="text-xl text- font-bold text-gray-900 mb-0">
              List of Parent's Account
            </h3>
            <p className="text-gray-600 text-xs font-medium mb-3">
              To manage Solo Parent's Account Details
            </p>
          </article>

          {/* SEARCH & FILTER BY */}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
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
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
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

          {/* CLIENT LIST TABLE -- DEKSTOP VIEW  */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full hidden md:block">
            {/* TABLE */}
            <div className="overflow-x-auto rounded">
              <table className="w-full text-lg text-gray-950">
                <thead className="bg-gray-200 text-gray-900 text-lg uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Full Name
                    </th>
                    <th className="px-4 py-3">
                      Birthday
                      <div className="text-xs font-normal">MM/DD/YYYY</div>
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
                  {filteredUsers.map((u) => (
                    // <tr key={u.id} className="hover:bg-gray-50 transition">

                    <tr
                      key={u.id}
                      // className="hover:bg-gray-50 even:bg-gray-50 transition"

                      className="hover:bg-gray-50 transition"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                        {u.uuid}
                      </td>

                      {/* NAME + AVATAR */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-semibold text-red-600">
                          {u.first_name?.[0]}
                        </div>

                        <span className="font-medium text-gray-900">
                          {getFullName(u)}
                        </span>
                      </td>

                      {/* BIRTHDAY */}
                      <td className="px-4 py-3 text-center">
                        {formatDate(u.birthday)}
                      </td>

                      {/* GENDER */}
                      <td className="px-4 py-3 capitalize">{u.gender}</td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        {u.is_verified ? (
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-600">
                            Unverified
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        {/* <button
                          onClick={() => handleView(u)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          View
                        </button> */}
                        <button
                          onClick={() => handleView(u)}
                          className="cursor-pointer px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
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
              {/* LEFT */}
              <span className="font-medium">
                Total Registered Parents: {totalCount}
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

          {/* CLIENT LIST TABLE -- MOBILE VIEW  */}
          <div className="md:hidden space-y-4">
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
          </div>

          {/* PAGINATION */}
          <div className="md:hidden flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
            {/* <span className="text-sm font-medium">
              Total of Registered Parents: {totalCount}
            </span> */}
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
                      {/* <button disabled={saving}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                        {saving ? "Saving..." : "Save"}
                      </button> */}
                    </>
                  ) : (
                    <button
                      className="w-full flex gap-1 justify-center items-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                      onClick={() => setIsEdit(true)}
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

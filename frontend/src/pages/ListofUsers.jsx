import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

export default function UserList() {
  const { authTokens, user } = useContext(AuthContext);
  const tempUser = user || { is_staff: true, is_superuser: true };

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // ---------------------------
  // SWEET ALERT
  // ---------------------------
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

  // FETCH PARENTS
  const fetchParents = async () => {
    if (!authTokens?.access) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/parent/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch parents");

      const data = await res.json();
      setUsers(data.results);
    } catch (err) {
      console.error(err);
      showAlert({ title: "Error", message: err.message });
    }
  };

  useEffect(() => {
    fetchParents();
  }, [authTokens]);

  // MODAL HANDLERS
  const handleView = (u) => {
    console.log(u);
    setSelectedUser(u);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setShowModal(false);
  };

  // const handleChange = (e) =>
  //   setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });

  // // ---------------------------
  // // SAVE CHANGES
  // // ---------------------------
  // const handleSave = async () => {
  //   if (!authTokens?.access) return;

  //   try {
  //     const res = await fetch(
  //       `http://127.0.0.1:8000/api/parent/${selectedUser.id}/`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${authTokens.access}`,
  //         },
  //         body: JSON.stringify(selectedUser),
  //       },
  //     );

  //     if (!res.ok) throw new Error("Failed to update parent");

  //     const updatedData = await res.json();
  //     setUsers(users.map((u) => (u.id === updatedData.id ? updatedData : u)));
  //     showAlert({
  //       title: "Saved",
  //       message: "Solo Parent details updated successfully.",
  //       icon: "success",
  //     });
  //     setIsEdit(false);
  //     setShowModal(false);
  //   } catch (err) {
  //     console.error(err);
  //     showAlert({ title: "Error", message: err.message });
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_verified") {
      setSelectedUser({ ...selectedUser, [name]: value === "true" });
    } else {
      setSelectedUser({ ...selectedUser, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!authTokens?.access) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/parent/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(selectedUser),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail || "Failed to update parent. Check console.",
        );
      }

      const updatedData = await res.json();
      setUsers(users.map((u) => (u.id === updatedData.id ? updatedData : u)));

      showAlert({
        title: "Saved",
        message: "Solo Parent details updated successfully.",
        icon: "success",
      });

      setIsEdit(false);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      showAlert({ title: "Error", message: err.message });
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!authTokens?.access) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/parent/${selectedUser.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to delete parent");

      setUsers(users.filter((u) => u.id !== selectedUser.id));
      showAlert({
        title: "Deleted",
        message: "Parent deleted successfully.",
        icon: "success",
      });
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showAlert({ title: "Error", message: err.message });
    }
  };

  // RENDER
  if (!tempUser.is_staff) {
    return (
      <p className="text-center mt-10 text-red-600 font-bold">Access Denied</p>
    );
  }

  // helper to combine name parts
  const getFullName = (u) => {
    return [u.first_name, u.middle_name, u.last_name, u.suffix]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Solo Parent's Account List Table
      </h3>

      <table className="w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-[var(--red-3)]">
          <tr>
            <th className="p-3 border">ID</th>
            <th className="p-3 border">Full Name</th>
            <th className="p-3 border">Birthday</th>
            <th className="p-3 border">Gender</th>
            <th className="p-3 border">Action</th>
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
                  className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 px-4 py-1.5 rounded-lg"
                  onClick={() => handleView(u)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h3 className="text-2xl font-bold mb-4">Solo Parent Details</h3>

            <p>
              <strong>ID:</strong> {selectedUser.id}
            </p>
            <p>
              <strong>Full Name:</strong>{" "}
              {isEdit ? (
                <input
                  name="first_name"
                  value={selectedUser.first_name || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                  placeholder="First Name"
                />
              ) : (
                getFullName(selectedUser)
              )}
            </p>
            <p>
              <strong>Birthday:</strong>{" "}
              {isEdit ? (
                <input
                  type="date"
                  name="birthday"
                  value={selectedUser.birthday || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                selectedUser.birthday
              )}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {isEdit ? (
                <select
                  name="gender"
                  value={selectedUser.gender || ""}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              ) : (
                selectedUser.gender
              )}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {isEdit ? (
                <select
                  name="is_verified"
                  value={
                    (selectedUser.is_verified && "Verified") || "Unverified"
                  }
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              ) : (
                (selectedUser.is_verified && "Verified") || "Unverified"
              )}
            </p>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {isEdit ? (
                <div className="flex gap-2">
                  <button
                    className="bg-[var(--gray-1)] hover:bg-gray-600 text-white font-semibold shadow shadow-gray-700 px-4 md:px-10 py-2 rounded-lg"
                    onClick={() => setIsEdit(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 px-6 md:px-10 py-2 rounded-lg"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white flex gap-2 items-center shadow shadow-gray-700 px-10 py-1.5 rounded-lg font-semibold"
                    onClick={() => setIsEdit(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

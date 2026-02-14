import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

export default function UserList() {
  const { user } = useContext(AuthContext);
  const tempUser = user || { is_staff: true, is_superuser: true };

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setUsers([
      {
        id: 1,
        full_name: "Juan Dela Cruz",
        birthday: "1990-05-21",
        gender: "Male",
        status: "Unverified",
      },
      {
        id: 2,
        full_name: "Maria Santos",
        birthday: "1992-08-14",
        gender: "Female",
        status: "Verified",
      },
    ]);
  }, []);

  if (!tempUser.is_staff) {
    return (
      <p className="text-center mt-10 text-red-600 font-bold">Access Denied</p>
    );
  }

  const handleView = (u) => {
    setSelectedUser(u);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setShowModal(false);
  };

  const handleChange = (e) =>
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });

  const handleSave = () => {
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    Swal.fire("Saved!", "User updated successfully.", "success");
    setIsEdit(false);
    setShowModal(false);
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
              <td className="p-3 border">{u.full_name}</td>
              <td className="p-3 border">{u.birthday}</td>
              <td className="p-3 border">{u.gender}</td>
              <td className="p-3 border text-center">
                <button
                  //   className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
                  name="full_name"
                  value={selectedUser.full_name}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                selectedUser.full_name
              )}
            </p>
            <p>
              <strong>Birthday:</strong>{" "}
              {isEdit ? (
                <input
                  type="date"
                  name="birthday"
                  value={selectedUser.birthday}
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
                  value={selectedUser.gender}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                selectedUser.gender
              )}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {isEdit ? (
                <select
                  name="status"
                  value={selectedUser.status}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              ) : (
                selectedUser.status
              )}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              {isEdit ? (
                <>
                  <button
                    className="bg-[var(--gray-1)] text-white font-semibold shadow shadow-gray-700 px-4 md:px-10 py-2 rounded-lg"
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
                </>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white flex gap-2 items-center shadow shadow-gray-700 px-10 py-1.5 rounded-lg font-semibold"
                  onClick={() => setIsEdit(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                  <p>Edit</p>
                </button>
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

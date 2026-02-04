import { useState } from "react";

export default function UserDashboard() {
  const [isEdit, setIsEdit] = useState(false);

  // Get user info from localStorage (dummy)
  const email = localStorage.getItem("email") || "user@test.com";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {isEdit ? (
        <div className="space-y-4">
          <input
            type="text"
            defaultValue={email}
            className="border p-2 rounded w-full"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setIsEdit(false)}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p>Email: {email}</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => setIsEdit(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

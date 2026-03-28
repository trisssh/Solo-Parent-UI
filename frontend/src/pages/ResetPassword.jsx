import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { userID, resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/reset-password-confirm/${userID}/${resetToken}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "password": newPassword,
          "password_confirmation": confirmPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password changed succesfully');
      } else {
        alert('Password changed unsuccesfully');
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <br/>

      <label for="password">Confirm Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleResetPassword}>Reset Password</button>
    </>
  )
}
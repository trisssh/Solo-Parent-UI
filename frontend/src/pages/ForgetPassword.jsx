import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const showError = (title, message) => {
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Okay",
  });
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white mx-3">
      <div className="relative p-1 rounded-2xl overflow-hidden">
        <div className="bg-white drop-shadow-[0_0_0.5rem_#FF2424]  shadow-lg rounded-xl w-full max-w-md p-6">
          <div className="flex items-center justify-center mb-6">
            {/* Logo Img Example */}
            <div className="bg-white size-14 rounded-full flex justify-center items-center">
              <img src="SP.png" className="size-14" />
            </div>
            <div className="ml-2 md:ml-6 text-center">
              <h2 className="font-bold uppercase text-base sm:text-xl text-gray-800">
                Solo Parent System
              </h2>
              <p className="capitalize font-semibold text-xs md:text-right tracking-wide text-gray-600 ">
                City of San Juan, Metro Manila
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="flex justify-between mb-6 text-sm font-semibold hidden">
            <span className={step >= 1 ? "text-red-600" : "text-gray-400"}>
              Email
            </span>
            <span className={step >= 2 ? "text-red-600" : "text-gray-400"}>
              OTP
            </span>
            <span className={step >= 3 ? "text-red-600" : "text-gray-400"}>
              Reset
            </span>
          </div>

          {/* STEP CONTENT */}
          {step === 1 && (
            <StepEmail
              email={email}
              setEmail={setEmail}
              onNext={() => setStep(2)}
              showError={showError}
            />
          )}

          {step === 2 && (
            <StepOTP
              otp={otp}
              setOtp={setOtp}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              showError={showError}
            />
          )}

          {step === 3 && (
            <StepResetPassword
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onBack={() => setStep(2)}
              showError={showError}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StepEmail({ email, setEmail, onNext }) {

const showError = (title, message) => {
  Swal.fire({
    icon: "error",
    title,
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
    text: message,
    confirmButtonText: "Okay",
  });
};

  const handleSendOTP = () => {
    if (!email.trim()) {
      showError(
        "Email required",
        "Please enter your registered email address.",
      );
      return;
    }
    onNext();
  };

  const handleSubmit = (e) => {
    e.preventDefault(); //stops page refresh
    handleSendOTP();
  };


  return (
    <div>
      <article className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Forgot Password
        </h2>
        <p className="font-semibold text-base text-gray-600 text-justify">
          Please provide your registered email address to reset your password.
        </p>
      </article>

      {/* Email */}
      <form onSubmit={handleSubmit} className="relative w-full my-6 rounded-lg">
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md"
          placeholder=""
          name="email"
        />
        <label
          htmlFor="email"
          className="absolute text-2xl font-bold text-[var(--gray-2)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
        >
          Email
        </label>

        <button
          type="submit"
          className="mt-6 bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-full py-2 rounded-lg"
        >
          Send OTP
        </button>
      </form>

      <Link
        to="/"
        className="font-semibold flex justify-center my-2 text-xs hover:underline hover:text-gray-700 text-gray-600"
      >
        Go back to Login
      </Link>
    </div>
  );
}

function StepOTP({ otp, setOtp, onNext, onBack }) {
     const RESEND_INTERVAL = 30 * 60; // 30 minutes in seconds
     const [secondsLeft, setSecondsLeft] = useState(RESEND_INTERVAL);

     // Countdown timer
     useEffect(() => {
       if (secondsLeft <= 0) return; // stop countdown
       const interval = setInterval(
         () => setSecondsLeft((prev) => prev - 1),
         1000,
       );
       return () => clearInterval(interval);
     }, [secondsLeft]);

     const handleResend = () => {
       console.log("Resend OTP clicked!"); // replace with actual resend logic
       setSecondsLeft(RESEND_INTERVAL); // reset timer
     };

     // Format minutes and seconds
     const minutes = Math.floor(secondsLeft / 60);
     const seconds = secondsLeft % 60;


     //auto-submit
    //  useEffect(() => {
    //    if (otp.length === 4) {
    //      handleSendOTP();
    //    }
    //  }, [otp]);


     //Error message, empty input
    const handleSendOTP = () => {
      if (!otp.trim()) {
        showError(
          "OTP code required",
          "Please check your email and enter the one-time password (OTP) sent to you to continue.",
        );
        return;
      }

      //Error message, numbers only
      if (!/^\d{6}$/.test(otp)) {
        showError("Invalid OTP", "OTP must be exactly 6 numbers only.");
        return;
      }

      onNext();
    };

    const showError = (title, message) => {
    Swal.fire({
    icon: "error",
    title,
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
    text: message,
    confirmButtonText: "Okay",
    });
    };


    const handleSubmit = (e) => {
      e.preventDefault();
      handleSendOTP();
    };



  return (
    <div>
      <article className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Enter OTP code
        </h2>
        <p className="font-semibold text-base text-gray-600 text-justify">
          Check your email and enter the one-time password (OTP) sent to you to
          continue.
        </p>
      </article>

      {/*OTP Verification */}
      <form 
       onSubmit={handleSubmit}
       className="relative w-full my-6 rounded-lg">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="xxxxxxx"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
            setOtp(value.slice(0, 6)); // limit to 6 digits
          }}
          className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md"
        />
        <label className="absolute text-2xl font-bold text-[var(--gray-2)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
          Enter OTP
        </label>
      </form>

      <div className="flex gap-3">
        <button
          className="bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          onClick={onBack}
        >
          Back
        </button>

        <button
        type="submit"
          className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          onClick={handleSendOTP}
        >
          Verify
        </button>
      </div>

      <button
        disabled={secondsLeft > 0}
        onClick={handleResend}
        className={`mt-4 w-full py-1 rounded-lg font-semibold ${
          secondsLeft > 0
            ? "cursor-not-allowed"
            : "bg-[var(--red-1)] hover:bg-[var(--red-4)] cursor-pointer border-2 border-white text-white shadow shadow-gray-700  py-1.5 rounded-lg font-semibold"
        }`}
      >
        Resend OTP in {""}
        {/* {secondsLeft > 0 && `(${minutes}m ${seconds}s)`} */}
        {minutes}m {seconds.toString().padStart(2, "0")}s
      </button>

      <Link
        to="/"
        className="font-semibold flex justify-center my-2 text-xs hover:underline hover:text-gray-700 text-gray-600"
      >
        Go back to Login
      </Link>
    </div>
  );
}

function StepResetPassword({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onBack,
}) {
const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // 1️ password rules
  const MIN_LENGTH = 8;

  // 2 derived logic (NO useState)
  const isMatch = newPassword === confirmPassword;
  const isStrongEnough = newPassword.length >= MIN_LENGTH;

  // 3️ final guard
  const canReset = isMatch && isStrongEnough;

  // 1 Calculate strength
//   const strengthPoints = [
//     newPassword.length >= 8,
//     /[A-Z]/.test(newPassword),
//     /\d/.test(newPassword),
//     /[!@#$%^&*]/.test(newPassword),
//   ].filter(Boolean).length;


const handleReset = () => {
  // Example: Fake API call
  fakeResetPasswordAPI(newPassword)
    .then(() => {
      Swal.fire({
        icon: "success",
        iconColor: "#DC2626",
        title: `<p class="text-2xl font-semibold text-gray-800">Password Reset Successful</p>`,
        html: `<p class="text-xl text-gray-600 mt-1">Your password has been updated. Please log in again using your new password.</p>`,
        showConfirmButton: true,
        confirmButtonText: "Okay",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-xl px-6 py-4",
          confirmButton:
            "mt-4 bg-red-600 text-white px-6 py-2 rounded text-xl hover:bg-red-700",
        },
      }).then(() => {
        navigate("/"); // redirect to login
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
      });
    });
};

const fakeResetPasswordAPI = (password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      password ? resolve(true) : reject();
    }, 1000);
  });

  const handleSubmit = (e) => {
    e.preventDefault(); 
    handleReset();
  };

  return (
    <div>
      <article className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Create new password
        </h2>
        <p className="font-semibold text-base text-gray-600 text-justify">
          Create a new password for your account. Please make sure both
          passwords match.
        </p>
      </article>

      <form onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="relative w-full mt-4 rounded-lg">
          <input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder=" "
            className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md"
          />
          <label className="absolute text-2xl font-bold text-[var(--gray-2)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3">
            New Password
          </label>
        </div>
        {/* Confirm Password */}
        <div className="relative w-full mt-4 rounded-lg">
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            className="block px-3 pb-2.5 pt-3 w-full text-lg text-gray-800 font-semibold bg-transparent rounded appearance-none focus:outline-none focus:ring-0 border border-[#A6A6A6] focus:border-gray-500 peer shadow-md"
          />
          <label
            htmlFor="confirmPassword"
            className="absolute text-2xl font-bold text-[var(--gray-2)] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
          >
            Confirm Password
          </label>

          {/* Eye icon (shared) */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
        {!isMatch && confirmPassword.length > 0 && (
          <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
        )}
        {!isStrongEnough && newPassword.length > 0 && (
          <p className="text-red-600 text-sm mt-1">
            Password too short (min 8 chars)
          </p>
        )}

        {/* Strength bar (4 segments) */}
        {/* <div className="flex mt-2 gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              strengthPoints >= level
                ? level === 1
                  ? "bg-yellow-500"
                  : level === 2
                    ? "bg-orange-500"
                    : "bg-red-500"
                : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div> */}
        {/* Optional text label */}
        {/* <p className="text-xs tracking-wide mt-1 font-semibold">
        {strengthPoints <= 1
          ? "Weak"
          : strengthPoints === 2
            ? "Medium"
            : "Strong"}
      </p> */}

        <div className="flex gap-3 mt-4">
          <button
          type="button"
            className="bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="submit"
            disabled={!canReset}
            className="disabled:bg-gray-400 bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          >
            Reset Password
          </button>
        </div>
      </form>
      <Link
        to="/"
        className="font-semibold flex justify-center my-2 text-xs hover:underline hover:text-gray-700 text-gray-600"
      >
        Go back to Login
      </Link>
    </div>
  );
}

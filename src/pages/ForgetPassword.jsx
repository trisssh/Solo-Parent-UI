import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-6">
          {/* Logo Img Example */}
          <div className="bg-white size-14 rounded-full flex justify-center items-center">
            <img src="spc.png" className="size-14" />
          </div>
          <div className="ml-2 md:ml-6 text-center">
            <h2 className="font-bold uppercase text-lg sm:text-xl text-gray-800">
              Solo Parent System
            </h2>
            <p className="capitalize font-semibold text-xs md:text-right tracking-wide text-gray-600 hidden lg:block">
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
          />
        )}

        {step === 2 && (
          <StepOTP
            otp={otp}
            setOtp={setOtp}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepResetPassword
            password={password}
            setPassword={setPassword}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}


function StepEmail({ email, setEmail, onNext }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Forgot Password
        </h2>
        <p className="font-semibold text-base text-gray-600 text-justify">
          Please provide your registered email address to reset your password.
        </p>
      </div>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border rounded-lg p-2 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-full py-2 rounded-lg"
        onClick={onNext}
      >
        Send OTP
      </button>

      <Link
        to="/"
        className="font-semibold flex justify-center py-1.5 text-xs hover:underline hover:text-gray-700 text-gray-600"
      >
        Go back to Login
      </Link>
    </div>
  );
}

function StepOTP({ otp, setOtp, onNext, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">OTP Verification</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full border rounded-lg p-2 mb-4"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          className="bg-[var(--gray-1)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          onClick={onBack}
        >
          Back
        </button>

        <button
          className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          onClick={onNext}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

function StepResetPassword({ password, setPassword, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        className="w-full border rounded-lg p-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          className="bg-[var(--gray-1)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
          onClick={onBack}
        >
          Back
        </button>

        <button className="bg-[var(--red-1)] hover:bg-[var(--red-4)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg">
          Reset Password
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export default function UserRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    houseNo: "",
    street: "",
    subdivision: "",
    barangay: "",
    birthday: "",
    gender: "",
    contactNumber: "",
    emergencyFirst: "",
    emergencyLast: "",
    emergencyContact: "",
  });

  const age = calcAge(form.birthday);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    Swal.fire({
      icon: "success",
      iconColor: "#DC2626",
      title: "Registration Complete",
      text: "Your account has been created successfully.",
      confirmButtonColor: "#DC2626",
      background: "#ffffff",
      showConfirmButton: true,
      confirmButtonText: "Okay",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-xl px-6 py-4",
        confirmButton:
          "mt-4 bg-red-600 text-white px-6 py-2 rounded text-xl hover:bg-red-700",
      },
    }).then(() => navigate("/"));
  };

  const StepIndicator = () => (
    <div className="mb-6">
      <p className="text-sm text-gray-500 text-center mb-2">Step {step} of 4</p>
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded-full ${
              step >= s ? "bg-red-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const Input = ({ label, name, type = "text" }) => (
    <div className="space-y-1">
      <label className="block text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-center md:justify-between md:px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
        {/* <h1 className="text-lg font-semibold text-white">Create Account</h1> */}
        <div className="flex items-center">
          <div className="bg-white size-14 rounded-full border border-red-200 shadow flex justify-center items-center">
            <img src="SP.png" className="size-12 object-contain" />
          </div>

          <div className="leading-tight mx-2 md:mx-4">
            <h2 className="font-bold uppercase text-white text-sm sm:text-base">
              Solo Parent System
            </h2>
            <p className="text-gray-200 text-xs">
              City of San Juan, Metro Manila
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 max-w-md w-full mx-auto">
        <StepIndicator />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Account Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <Input label="Email" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Continue
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-red-600 font-medium">
                Login
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Personal Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>
            <Input label="First Name" name="firstName" />
            <Input label="Middle Name" name="middleName" />
            <Input label="Last Name" name="lastName" />
            <Input label="Suffix" name="suffix" />
            <Input label="House No." name="houseNo" />
            <Input label="Street" name="street" />
            <Input label="Subdivision" name="subdivision" />
            <Input label="Barangay" name="barangay" />

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              />
              {age && <p className="text-xs text-gray-500">Age: {age}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 border border-gray-400 text-gray-700 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-1/2 bg-red-600 text-white py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Contact Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            
              <Input label="Contact Number" name="contactNumber" type="tel" />
              <Input
                label="Emergency Contact First Name"
                name="emergencyFirst"
              />
              <Input label="Emergency Contact Last Name" name="emergencyLast" />
              <Input
                label="Emergency Contact Number"
                name="emergencyContact"
                type="tel"
              />
            

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 border border-gray-400 text-gray-700 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-1/2 bg-red-600 text-white py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Upload Requirements
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                className="w-full border border-dashed border-gray-400 rounded-lg p-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Signature
              </label>
              <input
                type="file"
                className="w-full border border-dashed border-gray-400 rounded-lg p-3 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/2 border border-gray-400 text-gray-700 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/2 bg-red-600 text-white py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

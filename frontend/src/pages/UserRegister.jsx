import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const UserRegister = () => {
  const { registerUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Account
    email: "",
    password: "",
    password_confirmation: "",

    // Parent
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    birthday: "",
    phone: "",
    gender: "",
    house: "",
    street: "",
    barangay: "",
    subdivision: "",
    city: "",
    province: "",
    reason: "",

    // Contact
    contact_first_name: "",
    contact_middle_name: "",
    contact_last_name: "",
    contact_suffix: "",
    contact_phone: "",

    // Files
    id: null,
    signature: null,
  });

  // Universal change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append everything to FormData
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) {
        data.append(key, form[key]);
      }
    });

    try {
      await registerUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[var(--red-1)] border-b border-red-200 to-[#8B1E2F] flex flex-row items-center justify-center md:justify-between md:px-6 md:py-2 p-2 drop-shadow-[0_0_0.25rem_#CC3535]">
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

      {/* MAIN CONTENT FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 px-4 py-6 md:max-w-5xl w-full mx-auto"
      >
        {/* STEP 1 - ACCOUNT */}
        {step === 1 && (
          <>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Account Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
              required
            />

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 py-2 rounded-lg"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 - PARENT */}
        {step === 2 && (
          <div>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Personal Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            {/* NAME FIELDS */}
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            <input
              name="middle_name"
              placeholder="Middle Name"
              value={form.middle_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            <input
              name="suffix"
              placeholder="Suffix (Optional)"
              value={form.suffix}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            {/* BIRTHDAY */}
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            {/* PHONE */}
            <input
              name="phone"
              placeholder="Phone (+639XXXXXXXXXX)"
              value={form.phone}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            {/* GENDER */}
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            {/* ADDRESS */}
            <input
              name="house"
              placeholder="House No."
              value={form.house}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            <input
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            {/* BARANGAY */}
            <select
              name="barangay"
              value={form.barangay}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Barangay</option>
              <option value="greenhills">Greenhills</option>
              <option value="maytunas">Maytunas</option>
              <option value="kabayanan">Kabayanan</option>
              <option value="salapan">Salapan</option>
              <option value="west_crame">West Crame</option>
              <option value="onse">Onse</option>
            </select>

            <input
              name="subdivision"
              placeholder="Subdivision (Optional)"
              value={form.subdivision}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />

            {/* CITY */}
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select City</option>
              <option value="san_juan">City of San Juan</option>
              <option value="manila">City of Manila</option>
              <option value="quezon">Quezon City</option>
              <option value="makati">City of Makati</option>
              <option value="pasig">City of Pasig</option>
              <option value="taguig">City of Taguig</option>
            </select>

            {/* PROVINCE */}
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Province</option>
              <option value="ncr">National Capital Region</option>
              <option value="bulacan">Bulacan</option>
              <option value="laguna">Laguna</option>
              <option value="rizal">Rizal</option>
              <option value="cavite">Cavite</option>
            </select>

            {/* REASON */}
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Reason</option>
              <option value="crime_against_chastity">
                Crime Against Chastity
              </option>
              <option value="death_of_spouse">Death of Spouse</option>
              <option value="spouse_detained">Spouse is Detained</option>
              <option value="physical_mental_incapacity">
                Physical/Mental Incapacity of Spouse
              </option>
              <option value="separation">Legal/De Facto Separation</option>
              <option value="annuled">Annulment of Marriage</option>
              <option value="abandonment">Abandonment of Spouse</option>
              <option value="preferred_to_keep">
                Preferred To Keep Child/Children Instead of Giving Them To
                Welfare
              </option>
              <option value="sole_provider">
                Solely Provides Parental Care
              </option>
              <option value="assumed_responsibility">
                Assumed Responsibility of Head of Family
              </option>
            </select>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - CONTACT */}
        {step === 3 && (
          <>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Emergency Contact's Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <input
              name="contact_first_name"
              placeholder="First Name"
              value={form.contact_first_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              name="contact_middle_name"
              placeholder="Middle Name"
              value={form.contact_middle_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              name="contact_last_name"
              placeholder="Last Name"
              value={form.contact_last_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              name="contact_suffix"
              placeholder="Suffix"
              value={form.contact_suffix}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              name="contact_phone"
              placeholder="Phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 4 - FILE UPLOAD */}
        {step === 4 && (
          <>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Upload Requirements
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <label className="block text-gray-700 font-medium">
              Upload Valid ID
            </label>
            <input
              type="file"
              name="id"
              className="w-full mb-2 p-2 border rounded"
              onChange={handleChange}
              required
            />

            <label className="block text-gray-700 font-medium">
              Upload Signature
            </label>
            <input
              type="file"
              name="signature"
              className="w-full mb-2 p-2 border rounded"
              onChange={handleChange}
              required
            />

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
              >
                Submit Registration
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
};

export default UserRegister;

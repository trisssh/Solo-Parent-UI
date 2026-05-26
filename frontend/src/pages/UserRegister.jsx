import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const UserRegister = () => {
  const { registerUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);

  const totalSteps = 7;

  const [form, setForm] = useState({
    // 1 - Account
    email: "",
    password: "",
    password_confirmation: "",

    // 2 - Personal Info
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

    city: "City of San Juan", // Default
    province: "National Capital Region", // Default

    reason: "",
    religion: "",
    civilstat: "",

    // 3 - Socio-Economic
    educational_attainment: "",
    occupation: "",
    employment_status: "",
    company: "",
    monthly_income: "",
    family_income: "",

    // 4 - Sectoral
    pwd: false,
    senior_citizen: false,
    indigenous: false,
    lgbtqia: false,
    government_subsidy: false,
    philhealth_specify: "",
    contact_relationship: "",

    // 5 - Contact
    contact_first_name: "",
    contact_middle_name: "",
    contact_last_name: "",
    contact_suffix: "",
    contact_phone: "",
    contact_house: "",
    contact_street: "",
    contact_barangay: "",
    contact_subdivision: "",
    contact_city: "",
    contact_province: "",

    // 6 - assesstment
    needs_prob: "",
    fam_resource: "",

    // 7 - Files
    id: null,
    signature: null,
  });

  const [previews, setPreviews] = useState({
    id: null,
    signature: null,
  });

  // Universal change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // const nextStep = () => setStep((prev) => prev + 1);
  // const prevStep = () => setStep((prev) => prev - 1);

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

  //STEP INDICATOR
  const StepIndicator = () => (
    <div className="mb-6">
      <p className="text-sm text-gray-500 text-center mb-2">
        Step {step} of {totalSteps}
      </p>
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded-full ${
              step >= s ? "bg-red-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {/* <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 mx-1 rounded-full ${
              step >= s ? "bg-red-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div> */}
    </div>
  );

  const [checks, setChecks] = useState({
    // 1 - Account
    email: false,
    password: false,
    password_confirmation: false,

    // 2 - Personal
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

    reason: "",
    civilstat: false,

    //  3 - Socio-Economic
    educational_attainment: false,
    employment_status: false,
    occupation: false,
    company: false,
    monthly_income: false,
    family_income: false,

    // 4 - Sectoral
    philhealth_specify: false,

    // Contact
    contact_first_name: false,
    contact_middle_name: false,
    contact_last_name: false,
    contact_suffix: false,
    contact_phone: false,
  });

  const [emailCheck, setEmailCheck] = useState("Email cannot be empty.");
  const [phoneCheck, setPhoneCheck] = useState("Phone number cannot be empty");
  const [passCheck, setPassCheck] = useState("Password cannot be empty");
  const [passConfirmCheck, setPassConfirmCheck] = useState(
    "Password confirmation cannot be empty",
  );

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // Only allow digits and optional leading +
    if (!/^\+?\d+$/.test(phone)) return false;

    // Local PH format
    if (/^09\d{9}$/.test(phone)) return true;

    // International PH format
    if (/^\+639\d{9}$/.test(phone)) return true;

    return false;
  };

  const checkLength = (fields) => {
    const checking = {};

    for (const key of fields) {
      const value = form[key];

      // Files are not strings so handle them differently
      // Check if values are empty if so true
      if (key === "id" || key === "signature") {
        checking[key] = !value;
      } else if (key === "email") {
        checking[key] = !isValidEmail(value);
      } else if (key === "password") {
        checking[key] = value.length < 8 || /\s/.test(value);
      } else if (key === "password_confirmation") {
        checking[key] = value !== form.password;
      } else if (key === "phone" || key === "contact_phone") {
        checking[key] = !isValidPhone(value);
      } else {
        checking[key] = !value || value.trim() === "";
      }
    }

    // False if any field is invalid hence the not operator
    return {
      isValid: !fields.some((field) => checking[field]),
      checking,
    };
  };

  useEffect(() => {
    // Cleanup when component unmounts or previews change
    // Memory leak prevention
    return () => {
      Object.values(previews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col ml-0 lg:ml-auto h-screen">
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

      <section className="flex-1 overflow-y-auto  bg-gradient-to-br from-gray-100 via-white to-gray-50 p-5 sm:p-6">
        {/* MAIN CONTENT FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 px-4 py-6 md:max-w-5xl w-full mx-auto"
        >
          <StepIndicator />

          {/* STEP 1 - ACCOUNT INFO */}
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Account Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="flex flex-col gap-0 mb-3">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                // className="w-full p-2 border rounded"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                required
              />
              {checks.email && (
                <small className="text-red-700 font-light">{emailCheck}</small>
              )}
            </div>

            <div className="flex flex-col gap-0 mb-3">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder=""
                value={form.password}
                onChange={handleChange}
                // className="w-full p-2 border rounded"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                required
              />
              {checks.password && (
                <small className="text-red-700 font-light">{passCheck}</small>
              )}
            </div>

            <div className="flex flex-col gap-0 mb-3">
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder=""
                value={form.password_confirmation}
                onChange={handleChange}
                // className="w-full p-2 border rounded"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                required
              />
              {checks.password_confirmation && (
                <small className="text-red-700 font-light">
                  {passConfirmCheck}
                </small>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                const { isValid, checking } = checkLength([
                  "email",
                  "password",
                  "password_confirmation",
                ]);

                setChecks((prev) => ({ ...prev, ...checking }));

                if (checking.email) {
                  setEmailCheck("Email cannot be empty.");
                }
                if (checking.password) {
                  setPassCheck(
                    "Password must be a minimum of 8 characters and not contain any whitespace.",
                  );
                }
                if (checking.password_confirmation) {
                  setPassConfirmCheck("Passwords are not similar.");
                }

                if (isValid) {
                  setStep(2);
                }
              }}
              // className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 py-2 rounded-lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
            >
              Continue
            </button>

            <p className="text-sm text-center text-gray-600 mt-2">
              Already have an account?{" "}
              <Link to="/" className="text-[var(--red-1)] font-semibold">
                Login here
              </Link>
            </p>
          </div>

          {/* STEP 2 -  PERSONAL INFO */}
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Personal Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>
            <section className="grid md:grid-cols-2 gap-3">
              {/* NAME FIELDS */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  First Name
                </label>
                <input
                  name="first_name"
                  placeholder=""
                  value={form.first_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.first_name && (
                  <small className="text-red-700 font-light">
                    First name cannot be empty.
                  </small>
                )}
              </div>

              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Middle Name (Optional)
                </label>
                <input
                  name="middle_name"
                  placeholder=""
                  value={form.middle_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Last Name
                </label>
                <input
                  name="last_name"
                  placeholder=""
                  value={form.last_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.last_name && (
                  <small className="text-red-700 font-light">
                    Last name cannot be empty.
                  </small>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Suffix (Jr., Sr., III, etc.)
                </label>
                <input
                  name="suffix"
                  placeholder=""
                  value={form.suffix}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              {/* BIRTHDAY */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={form.birthday}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-3 transition"
                  required
                />
                {checks.birthday && (
                  <small className="text-red-700 font-light">
                    Date of birth cannot be empty.
                  </small>
                )}
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="Phone (+639XXXXXXXXXX)"
                  value={form.phone}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.phone && (
                  <small className="text-red-700 font-light">
                    {phoneCheck}
                  </small>
                )}
              </div>

              {/* GENDER */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-3 transition"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                {checks.gender && (
                  <small className="text-red-700 font-light">
                    Gender cannot be empty.
                  </small>
                )}
              </div>

              {/* ADDRESS */}

              {/* HOUSE NO. */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  House No.
                </label>
                <input
                  name="house"
                  placeholder=""
                  value={form.house}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.house && (
                  <small className="text-red-700 font-light">
                    House number cannot be empty.
                  </small>
                )}
              </div>

              {/* STREET */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Street
                </label>
                <input
                  name="street"
                  placeholder=""
                  value={form.street}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.street && (
                  <small className="text-red-700 font-light">
                    Street number cannot be empty.
                  </small>
                )}
              </div>

              {/* BARANGAY */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Barangay
                </label>
                <select
                  name="barangay"
                  value={form.barangay}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                >
                  <option value="">Select Barangay</option>
                  <option value="Greenhills">Greenhills</option>
                  <option value="Maytunas">Maytunas</option>
                  <option value="Kabayanan">Kabayanan</option>
                  <option value="Salapan">Salapan</option>
                  <option value="West Crame">West Crame</option>
                  <option value="Onse">Onse</option>
                </select>
                {checks.barangay && (
                  <small className="text-red-700 font-light">
                    Barangay cannot be empty.
                  </small>
                )}
              </div>

              {/* SUBDIVISION */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Subdivision (Optional)
                </label>
                <input
                  name="subdivision"
                  placeholder=""
                  value={form.subdivision}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              {/* RELIGION */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Religion
                </label>
                <input
                  name="religion"
                  placeholder=""
                  value={form.religion}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              {/* CITY */}
              <div>
                <label className="block text-gray-700 font-medium">City</label>
                {/* <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-200 border rounded"
                  required
                  defaultValue={"san_juan"}
                  disabled
                >
                  <option value="san_juan">City of San Juan</option>
                  <option value="">Select City</option>
                  <option value="manila">City of Manila</option>
                  <option value="quezon">Quezon City</option>
                  <option value="makati">City of Makati</option>
                  <option value="pasig">City of Pasig</option>
                  <option value="taguig">City of Taguig</option>
                </select> */}
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  // className="w-full p-2 bg-gray-200 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                  disabled
                >
                  <option value="City of San Juan">City of San Juan</option>
                </select>
              </div>

              {/* PROVINCE */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Province
                </label>
                {/* <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-200 border rounded"
                  required
                  defaultValue={"ncr"}
                  disabled
                >
                  <option value="ncr">National Capital Region</option>
                  <option value="">Select Province</option>
                  <option value="bulacan">Bulacan</option>
                  <option value="laguna">Laguna</option>
                  <option value="rizal">Rizal</option>
                  <option value="cavite">Cavite</option>
                </select> */}
                <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  // className="w-full p-2 bg-gray-200 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                  disabled
                >
                  <option value="National Capital Region">
                    National Capital Region
                  </option>
                </select>
              </div>

              {/* CIVIL STATUS */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Civil Status
                </label>
                <select
                  name="civilstat"
                  value={form.civilstat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="seperated">Legally Separated</option>
                  <option value="annulled">Annulled</option>
                </select>
                {checks.civilstat && (
                  <small className="text-red-700 font-light">
                    Civil Status cannot be empty.
                  </small>
                )}
              </div>

              {/* CATEGORY OF BEING A SOLO PARENT */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Category of being a Solo Parent
                </label>
                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                >
                  <option value="">Select Category</option>
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
                {checks.reason && (
                  <small className="text-red-700 font-light">
                    Category of being a Solo Parent cannot be empty.
                  </small>
                )}
              </div>
            </section>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                // className="w-1/2 bg-[var(--gray-2)] text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  const { isValid, checking } = checkLength([
                    "first_name",
                    "last_name",
                    "birthday",
                    "phone",
                    "gender",
                    "house",
                    "street",
                    "barangay",
                    "reason",
                    "civilstat",
                  ]);

                  setChecks((prev) => ({ ...prev, ...checking }));

                  if (checking.phone) {
                    setPhoneCheck("Invalid phone number format");
                  }

                  if (isValid) {
                    setStep(3);
                  }
                }}
                // className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow shadow-gray-700 w-1/2 py-2 rounded-lg"
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 3 - SOCIO-ECONOMIC INFO */}
          <div style={{ display: step === 3 ? "block" : "none" }}>
            <article className="mb-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Socio-Economic Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ================= EDUCATIONAL ATTAINMENT ================= */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="block text-gray-700 font-medium">
                  Educational Attainment
                </label>

                <select
                  name="educational_attainment"
                  value={form.educational_attainment || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                >
                  <option value="">Select educational attainment</option>

                  <option value="no_education">No Education</option>
                  <option value="elementary_level">Elementary Level</option>
                  <option value="elementary_graduate">
                    Elementary Graduate
                  </option>

                  <option value="highschool_level">High School Level</option>
                  <option value="highschool_graduate">
                    High School Graduate
                  </option>

                  <option value="vocational">Vocational / TVET</option>

                  <option value="college_level">College Level</option>
                  <option value="college_graduate">College Graduate</option>
                  <option value="post_college">Post-College</option>
                </select>
                {checks.educational_attainment && (
                  <small className="text-red-700 font-light">
                    Educational Attainment cannot be empty.
                  </small>
                )}
              </div>

              {/* ================= EMPLOYMENT STATUS ================= */}
              <div className="flex flex-col gap-1">
                <label className="block text-gray-700 font-medium">
                  Employment Status
                </label>

                <select
                  name="employment_status"
                  value={form.employment_status || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self-employed</option>
                  <option value="not_employed">Not Employed</option>
                </select>
                {checks.employment_status && (
                  <small className="text-red-700 font-light">
                    Employment Status cannot be empty.
                  </small>
                )}
              </div>

              {/* ================= OCCUPATION ================= */}
              {/* <div className="flex flex-col gap-1">
                <label className="block text-gray-700 font-medium">
                  Occupation
                </label>

                <input
                  name="occupation"
                  value={form.occupation || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                />
              </div> */}

              {form.employment_status !== "not_employed" && (
                <div className="flex flex-col gap-1">
                  <label className="block text-gray-700 font-medium">
                    Occupation
                  </label>
                  <input
                    name="occupation"
                    value={form.occupation || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  {checks.occupation && (
                    <small className="text-red-700 font-light">
                      Occupation cannot be empty.
                    </small>
                  )}
                </div>
              )}

              {/* ================= COMPANY / AGENCY ================= */}
              {/* <div className="flex flex-col gap-1 md:col-span-2">
                <label className="block text-gray-700 font-medium">
                  Company / Agency of Work
                </label>

                <input
                  name="company"
                  value={form.company || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div> */}
              {form.employment_status !== "not_employed" && (
                <div className="flex flex-col gap-1">
                  <label className="block text-gray-700 font-medium">
                    Company / Agency of Work
                  </label>
                  <input
                    name="company"
                    value={form.company || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />

                  {/* ERROR MESSAGE */}
                  {checks.company && (
                    <small className="text-red-700 font-light mt-1 text-xs">
                      Company name is required for employed status.
                    </small>
                  )}
                </div>
              )}

              {/* ================= MONTHLY PERSONAL INCOME ================= */}
              <div className="flex flex-col gap-1">
                <label className="block text-gray-700 font-medium">
                  Monthly Personal Income
                </label>

                <select
                  name="monthly_income"
                  value={form.monthly_income || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                >
                  <option value="">Select range</option>
                  <option value="below_5000">Below ₱5,000</option>
                  <option value="5001_10000">₱5,001 – ₱10,000</option>
                  <option value="10001_20000">₱10,001 – ₱20,000</option>
                  <option value="20001_40000">₱20,001 – ₱40,000</option>
                  <option value="40001_above">₱40,001 and above</option>
                </select>
                {checks.monthly_income && (
                  <small className="text-red-700 font-light">
                    Monthly Personal Income cannot be empty.
                  </small>
                )}
              </div>

              {/* ================= FAMILY INCOME ================= */}
              <div className="flex flex-col gap-1">
                <label className="block text-gray-700 font-medium">
                  Total Family Income
                </label>

                <select
                  name="family_income"
                  value={form.family_income || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                >
                  <option value="">Select range</option>
                  <option value="below_5000">Below ₱5,000</option>
                  <option value="5001_10000">₱5,001 – ₱10,000</option>
                  <option value="10001_20000">₱10,001 – ₱20,000</option>
                  <option value="20001_40000">₱20,001 – ₱40,000</option>
                  <option value="40001_above">₱40,001 and above</option>
                </select>
                {checks.family_income && (
                  <small className="text-red-700 font-light">
                    Total Family Income cannot be empty.
                  </small>
                )}
              </div>
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  // "educational_attainment" and "employment_status" are ALWAYS required
                  const fieldsToValidate = [
                    "educational_attainment",
                    "employment_status",
                  ];

                  // Add validation rules dynamically based on employment status
                  if (form.employment_status === "employed") {
                    fieldsToValidate.push(
                      "occupation",
                      "company",
                      "monthly_income",
                    );
                  } else if (form.employment_status === "self_employed") {
                    fieldsToValidate.push("occupation", "monthly_income");
                    // "company" optional for self-employed
                  } else if (form.employment_status === "not_employed") {
                    // For not employed, occupation, company, and monthly income are skipped.
                  }

                  // Family Income is required for everyone
                  fieldsToValidate.push("family_income");

                  const { isValid, checking } = checkLength(fieldsToValidate);

                  setChecks((prev) => ({ ...prev, ...checking }));

                  if (isValid) {
                    setStep(4);
                  }
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 4 - SECTORAL & GOV ASSIST INFO */}
          <div style={{ display: step === 4 ? "block" : "none" }}>
            <article className="mb-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Sectoral & Government Assistance Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ================= SECTORAL MEMBERSHIP ================= */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Sectoral Membership
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { key: "pwd", label: "PWD" },
                    { key: "senior_citizen", label: "Senior Citizen" },
                    { key: "indigenous", label: "Indigenous People" },
                    { key: "lgbtqia", label: "LGBTQIA+" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center items-center flex gap-2 text-lg
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition mt-2"
                    >
                      <input
                        type="checkbox"
                        name={item.key}
                        className="accent-red-600 w-4 h-4"
                        checked={form[item.key] || false}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [item.key]: e.target.checked,
                          })
                        }
                      />
                      <span className="text-sm text-gray-700">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ================= GOVERNMENT ASSISTANCE ================= */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Government Assistance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center items-center flex gap-2 text-lg
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition mt-2"
                  >
                    <input
                      type="checkbox"
                      className="accent-red-600 w-4 h-4"
                      checked={form.beneficiary_4ps || false}
                      onChange={(e) =>
                        setForm({ ...form, beneficiary_4ps: e.target.checked })
                      }
                    />
                    <span className="text-sm">4Ps Beneficiary</span>
                  </label>

                  <label
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center items-center flex gap-2 text-lg
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition mt-2"
                  >
                    <input
                      type="checkbox"
                      className="accent-red-600 w-4 h-4"
                      checked={form.government_subsidy || false}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          government_subsidy: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm">Government Subsidy</span>
                  </label>
                </div>
              </div>

              {/* ================= PHILHEALTH ================= */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-2">
                  PhilHealth Membership
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {["none", "direct", "indirect", "specify"].map((type) => (
                    <label
                      key={type}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center items-center flex gap-2 text-lg
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition mt-2"
                    >
                      <input
                        type="radio"
                        className="accent-red-600 w-4 h-4"
                        name="philhealth"
                        value={type}
                        checked={form.philhealth === type}
                        onChange={(e) =>
                          setForm({ ...form, philhealth: e.target.value })
                        }
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>

                {/* Conditional input */}
                {form.philhealth === "specify" && (
                  <div className="flex flex-col gap-0 w-full mt-2">
                    <input
                      type="text"
                      name="philhealth_specify"
                      placeholder="Please specify membership type"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300
focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                      value={form.philhealth_specify || ""}
                      onChange={handleChange}
                    />

                    {/* THIS IS THE NEW ERROR INDICATOR */}
                    {checks.philhealth_specify && (
                      <small className="text-red-700 font-light mt-1">
                        Please write your specific membership type.
                      </small>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  const fieldsToValidate = ["philhealth"];

                  // If they chose "specify", required
                  if (form.philhealth === "specify") {
                    fieldsToValidate.push("philhealth_specify");
                  }

                  const { isValid, checking } = checkLength(fieldsToValidate);

                  setChecks((prev) => ({ ...prev, ...checking }));

                  if (isValid) {
                    setStep(5);
                  }
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 5 - EMERGENCY CONTACT */}
          <div style={{ display: step === 5 ? "block" : "none" }}>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Emergency Contact's Information
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/*Emergency Contact's First Name */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Emergency Contact's First Name
                </label>
                <input
                  name="contact_first_name"
                  placeholder=""
                  value={form.contact_first_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.contact_first_name && (
                  <small className="text-red-700 font-light">
                    Contact first name cannot be empty.
                  </small>
                )}
              </div>
              {/* Emergency Contact's Middle Name */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Emergency Contact's Middle Name (Optional)
                </label>
                <input
                  name="contact_middle_name"
                  placeholder=""
                  value={form.contact_middle_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
                {checks.contact_middle_name && (
                  <small className="text-red-700 font-light">
                    Contact middle name cannot be empty.
                  </small>
                )}
              </div>
              {/* Emergency Contact's Last Name */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Emergency Contact's Last Name
                </label>
                <input
                  name="contact_last_name"
                  placeholder=""
                  value={form.contact_last_name}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.contact_last_name && (
                  <small className="text-red-700 font-light">
                    Contact last name cannot be empty.
                  </small>
                )}
              </div>
              {/* Emergency Contact's Suffix */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Emergency Contact's Suffix (Jr., Sr., III, etc.)
                </label>
                <input
                  name="contact_suffix"
                  placeholder=""
                  value={form.contact_suffix}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              {/* Emergency Contact's ADDRESS */}

              {/* HOUSE NO. */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  House No.
                </label>
                <input
                  name="contact_house"
                  placeholder=""
                  value={form.contact_house}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.house && (
                  <small className="text-red-700 font-light">
                    House number cannot be empty.
                  </small>
                )}
              </div>

              {/* STREET */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Street
                </label>
                <input
                  name="contact_street"
                  placeholder=""
                  value={form.contact_street}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.street && (
                  <small className="text-red-700 font-light">
                    Street number cannot be empty.
                  </small>
                )}
              </div>

              {/* BARANGAY */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Barangay
                </label>
                <select
                  name="contact_barangay"
                  value={form.contact_barangay}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                >
                  <option value="">Select Barangay</option>
                  <option value="Greenhills">Greenhills</option>
                  <option value="Maytunas">Maytunas</option>
                  <option value="Kabayanan">Kabayanan</option>
                  <option value="Salapan">Salapan</option>
                  <option value="West Crame">West Crame</option>
                  <option value="Onse">Onse</option>
                </select>
                {checks.barangay && (
                  <small className="text-red-700 font-light">
                    Barangay cannot be empty.
                  </small>
                )}
              </div>

              {/* SUBDIVISION */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Subdivision (Optional)
                </label>
                <input
                  name="contact_subdivision"
                  placeholder=""
                  value={form.contact_subdivision}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>

              {/* CITY */}
              <div>
                <label className="block text-gray-700 font-medium">City</label>
                {/* <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-200 border rounded"
                  required
                  defaultValue={"san_juan"}
                  disabled
                >
                  <option value="san_juan">City of San Juan</option>
                  <option value="">Select City</option>
                  <option value="manila">City of Manila</option>
                  <option value="quezon">Quezon City</option>
                  <option value="makati">City of Makati</option>
                  <option value="pasig">City of Pasig</option>
                  <option value="taguig">City of Taguig</option>
                </select> */}
                <select
                  name="contact_city"
                  value={form.contact_city}
                  onChange={handleChange}
                  // className="w-full p-2 bg-gray-200 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                  disabled
                >
                  <option value="City of San Juan">City of San Juan</option>
                </select>
              </div>

              {/* PROVINCE */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Province
                </label>
                {/* <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-200 border rounded"
                  required
                  defaultValue={"ncr"}
                  disabled
                >
                  <option value="ncr">National Capital Region</option>
                  <option value="">Select Province</option>
                  <option value="bulacan">Bulacan</option>
                  <option value="laguna">Laguna</option>
                  <option value="rizal">Rizal</option>
                  <option value="cavite">Cavite</option>
                </select> */}
                <select
                  name="contact_province"
                  value={form.contact_province}
                  onChange={handleChange}
                  // className="w-full p-2 bg-gray-200 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                  disabled
                >
                  <option value="National Capital Region">
                    National Capital Region
                  </option>
                </select>
              </div>

              {/* Emergency Contact's Phone Number */}
              <div className="flex flex-col gap-0 mt-3">
                <label className="block text-gray-700 font-medium">
                  Emergency Contact's Phone Number
                </label>
                <input
                  name="contact_phone"
                  placeholder="Phone (+639XXXXXXXXXX)"
                  value={form.contact_phone}
                  onChange={handleChange}
                  // className="w-full p-2 border rounded"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.contact_phone && (
                  <small className="text-red-700 font-light">
                    {phoneCheck}
                  </small>
                )}
              </div>

              {/* Relationship to the Solo Parent */}
              <div>
                <label className="block text-gray-700 font-medium mt-3">
                  Relationship to the Solo Parent
                </label>
                <input
                  name="contact_relationship"
                  placeholder=""
                  value={form.contact_relationship}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  const { isValid, checking } = checkLength([
                    "contact_first_name",
                    "contact_last_name",
                    "contact_middle_name",
                    "contact_phone",
                  ]);

                  setChecks((prev) => ({ ...prev, ...checking }));

                  if (checking.contact_phone) {
                    setPhoneCheck("Invalid phone number format");
                  }

                  if (isValid) {
                    setStep(6);
                  }
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 6 - ASSESSNENT & FAM SUPPORT */}
          <div style={{ display: step === 6 ? "block" : "none" }}>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Needs Assessment & Family Support
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="grid grid-cols-1  gap-3">
              {/* Needs and Problems Encountered of Being a Solo Parent */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Needs and Problems Encountered of Being a Solo Parent
                </label>
                <textarea
                  name="needs_prob"
                  placeholder="Enter your needs or concerns..."
                  value={form.needs_prob}
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-justify
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                  required
                />
                {checks.needs_prob && (
                  <small className="text-red-700 font-light">
                    Contact first name cannot be empty.
                  </small>
                )}
              </div>

              {/* Family Resources that Supply the needs of you */}
              <div className="flex flex-col gap-0">
                <label className="block text-gray-700 font-medium">
                  Family Resources that Supply the needs of your child/children
                </label>
                <textarea
                  name="fam_resource"
                  placeholder="Enter your family resources..."
                  value={form.fam_resource}
                  onChange={handleChange}
                  rows="4"
                  cols="50"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-justify
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                />
                {checks.fam_resource && (
                  <small className="text-red-700 font-light">
                    Field cannot be empty.
                  </small>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  const { isValid, checking } = checkLength([
                    "contact_first_name",
                    "contact_last_name",
                    "contact_middle_name",
                    "contact_phone",
                  ]);

                  setChecks((prev) => ({ ...prev, ...checking }));

                  if (checking.contact_phone) {
                    setPhoneCheck("Invalid phone number format");
                  }

                  if (isValid) {
                    setStep(7);
                  }
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>

          {/* STEP 7 - UPLOAD REQUIREMENTS */}
          <div style={{ display: step === 7 ? "block" : "none" }}>
            <article className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Upload Requirements
              </h2>
              <p className="font-semibold text-sm sm:text-base text-gray-600 text-justify">
                Please enter your information to create an account.
              </p>
            </article>

            <div className="flex flex-col mb-2">
              <label className="block text-gray-700 font-medium">
                Upload 1x1 Picture
              </label>
              {previews.id && (
                <center>
                  <img
                    src={previews.id}
                    alt="ID Preview"
                    className="h-48 w-48 object-contain rounded mb-2"
                  />
                </center>
              )}

              <input
                type="file"
                name="id"
                // className="w-full p-2 border rounded"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-justify
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </div>

            <div className="flex flex-col mb-2">
              <label className="block text-gray-700 font-medium">
                Upload E-Signature (over white background)
              </label>
              {previews.signature && (
                <center>
                  <img
                    src={previews.signature}
                    alt="Signature Preview"
                    className="h-48 w-48 object-contain rounded mb-2 "
                  />
                </center>
              )}

              <input
                type="file"
                name="signature"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-justify
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-12 transition"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-3">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-semibold shadow py-2 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow py-2 rounded-lg"
              >
                Submit Registration
              </button>
            </div>
          </div>

          {/* STEP 8 - REVIEW & SUBMIT */}
        </form>
      </section>
    </main>
  );
};

export default UserRegister;

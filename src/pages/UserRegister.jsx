import { useState } from "react";

export default function UserRegister() {
  const [step, setStep] = useState(1);

  // STEP 1 – Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // STEP 2 – Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // STEP 3 – Contact
  const [contactNumber, setContactNumber] = useState("");

  // STEP 4 – Uploads
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
        {step === 1 && (
          <StepAccount
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepPersonalInfo
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepContact
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <StepUploads
            photo={photo}
            setPhoto={setPhoto}
            signature={signature}
            setSignature={setSignature}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}


function StepAccount({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onNext,
}) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Account Information</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input"
      />

      <button onClick={onNext} className="btn-primary mt-4">
        Next
      </button>
    </>
  );
}

function StepPersonalInfo({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthDate,
  setBirthDate,
  onBack,
  onNext,
}) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="input"
      />

      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="input"
      />

      <div className="flex gap-2 mt-4">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Next
        </button>
      </div>
    </>
  );
}

function StepContact({ contactNumber, setContactNumber, onBack, onNext }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Contact Number</h2>

      <input
        type="tel"
        placeholder="09XXXXXXXXX"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
        className="input"
      />

      <div className="flex gap-2 mt-4">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Next
        </button>
      </div>
    </>
  );
}

function StepUploads({ photo, setPhoto, signature, setSignature, onBack }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Upload Requirements</h2>

      <label className="block mb-2">Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <label className="block mt-4 mb-2">Signature</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSignature(e.target.files[0])}
      />

      <div className="flex gap-2 mt-4">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button className="btn-primary">Submit Registration</button>
      </div>
    </>
  );
}



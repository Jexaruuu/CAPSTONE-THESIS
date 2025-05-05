// AdminSignup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const AdminSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profilePicture: null
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post("http://localhost:3000/api/adminsignup", formDataToSend);

      if (response.data.success) {
        navigate("/adminlogin");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "An error occurred. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-6 md:p-8 rounded-lg flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-28 md:h-28" />
        <h2 className="text-gray-900 text-2xl md:text-2xl font-semibold mb-2 font-[Poppins]">Create Admin Account</h2>
        <p className="text-gray-500 text-sm md:text-md text-center mb-6 md:mb-10">Authorized admin only.</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="w-full" onSubmit={handleSignup}>
          {step === 1 && (
            <>
              <label className="text-gray-700 text-sm block mb-2">Profile Picture</label>
              <div className="flex flex-col items-center space-y-3 mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <div className="relative w-full max-w-[130px]">
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="relative text-center rounded px-5 py-2.5 overflow-hidden group font-semibold text-white transition-all ease-out duration-300 bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 cursor-pointer">
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span className="relative text-sm">Upload</span>
                  </div>
                </div>
              </div>

              <label className="text-gray-700 text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
                placeholder="Enter First Name"
                required
              />

              <label className="text-gray-700 text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
                placeholder="Enter Last Name"
                required
              />
            </>
          )}

          {step === 2 && (
            <>
              <label className="text-gray-700 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
                placeholder="Enter Email"
                required
              />

              <label className="text-gray-700 text-sm">Admin Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
                placeholder="Enter Admin Username"
                required
              />

              <label className="text-gray-700 text-sm">Admin Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
                placeholder="Enter Admin Password"
                required
              />

              <label className="text-gray-700 text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-4"
                placeholder="Confirm Admin Password"
                required
              />
            </>
          )}

          <button
            type={step === 2 ? "submit" : "button"}
            onClick={() => step === 1 && setStep(2)}
            className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300 cursor-pointer"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative text-base font-semibold">{step === 1 ? "Next" : "Sign Up"}</span>
          </button>
        </form>

        {step === 2 && (
          <div className="flex justify-between mt-4 text-gray-600 text-sm w-full">
            <button type="button" onClick={() => setStep(1)} className="hover:underline cursor-pointer">
              ← Back
            </button>
            <Link to="/adminlogin" className="hover:underline cursor-pointer">
              Already have an account?
            </Link>
          </div>
        )}

        {step === 1 && (
          <div className="flex justify-center mt-4 text-gray-600 text-sm w-full">
            <Link to="/adminlogin" className="hover:underline cursor-pointer">
              Already have an account?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSignup;

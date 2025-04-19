// AdminSignup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

const AdminSignup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/adminsignup", {
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        navigate("/adminlogin");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "An error occurred. Please try again.";
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
          <label className="text-gray-700 text-sm">First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3" placeholder="Enter First Name" required />

          <label className="text-gray-700 text-sm">Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3" placeholder="Enter Last Name" required />

          <label className="text-gray-700 text-sm">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3" placeholder="Enter Email" required />

          <label className="text-gray-700 text-sm">Admin Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3" placeholder="Enter Admin Username" required />

          <label className="text-gray-700 text-sm">Admin Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3" placeholder="Enter Admin Password" required />

          <label className="text-gray-700 text-sm">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-4" placeholder="Confirm Admin Password" required />

          <button type="submit" className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300 cursor-pointer">
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative text-base font-semibold">Sign Up</span>
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between mt-4 text-gray-600 text-sm w-full">
          <Link to="/adminlogin" className="hover:underline cursor-pointer">Already have an account?</Link>
          <Link to="#" className="hover:underline sm:ml-auto mt-2 sm:mt-0 cursor-pointer">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;

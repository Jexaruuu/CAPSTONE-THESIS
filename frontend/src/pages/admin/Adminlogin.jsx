import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // changed from email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/api/adminlogin", {
        username,
        password,
      });

      if (response.data.success) {
        // Redirect to dashboard or show success message
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md  p-6 md:p-8 rounded-lg flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-40 h-40 md:w-80 md:h-80" />
        <h2 className="text-gray-900 text-2xl md:text-3xl font-semibold mb-2 font-[Poppins]">Admin</h2>
        <p className="text-gray-500 text-sm md:text-md text-center mb-6 md:mb-10">
          Authorized admin only.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="w-full" onSubmit={handleLogin}>
          <label className="text-gray-700 text-sm">Admin Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-3"
            placeholder="Enter Admin Username"
            required
          />

          <label className="text-gray-700 text-sm">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-4"
            placeholder="Enter Admin Password"
            required
          />

          <button
            type="submit"
            className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] 
              hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
              text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 
              transition-all ease-out duration-300 cursor-pointer"
          >
            <span
              className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform 
                translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
            ></span>
            <span className="relative text-base font-semibold">Log in</span>
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between mt-4 text-gray-600 text-sm w-full">
          <Link to="/adminsignup" className="hover:underline cursor-pointer">
            Create Admin Account
          </Link>
          <Link to="#" className="hover:underline sm:ml-auto mt-2 sm:mt-0 cursor-pointer">
            Forgot Admin Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

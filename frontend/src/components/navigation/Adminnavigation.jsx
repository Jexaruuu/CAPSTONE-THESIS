import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminNavigation = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/adminlogout", {}, { withCredentials: true });
      localStorage.removeItem("admin");
      navigate("/adminlogin");
      window.location.reload();
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  return (
    <header className="bg-[#F3F4F6] shadow-sm p-4">
      <div className="max-w-6xl mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-14 flex items-center">
              <img src="/logo.png" alt="Logo" className="h-[90px] w-[90px] mt-2 -ml-2" />
            </div>
            <h1 className="text-4xl font-[Poppins] font-bold text-[#000081] mt-2.5">JD HOMECARE</h1>
          </div>

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex flex-col text-right">
              {admin ? (
                <>
                  <p className="text-gray-700 font-medium">{admin.username}</p>
                  <Link to="/admindashboard" className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer">
                    Admin Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm cursor-pointer">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">Admin Guest</p>
                  <Link to="/adminlogin" className="text-blue-500 hover:text-blue-700 text-sm">Log in</Link>
                  <Link to="/adminsignup" className="text-blue-500 hover:text-blue-700 text-sm">Sign up</Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/admin.png"
                alt="Admin Profile"
                className="h-14 w-14 rounded-full border border-gray-400 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-[14px] text-gray-500">
            Admin Panel | JD HOMECARE, Bacolod, Negros Occidental
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavigation;

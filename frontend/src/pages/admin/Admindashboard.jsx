import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {HomeIcon,UsersIcon,FileTextIcon,LogOutIcon,SettingsIcon,} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [adminName, setAdminName] = useState({ first_name: "", last_name: "" });

  useEffect(() => {axios.get("/api/admin/profile", { withCredentials: true })
      .then((res) => setAdminName(res.data))
      .catch((err) => console.error("Error fetching admin profile:", err));
  }, []);
  
console.log(adminName);
  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
        {/* Sidebar - Full height and logout button at bottom */}
        <aside className="w-64 h-screen bg-white text-black flex flex-col justify-between p-4">
          {/* Top section with logo and nav */}
          <div>
            <div className="flex items-center mb-10">
              <img src="/logo.png" alt="Logo" className="w-56 h-56 mr-2" />
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">
                {adminName.first_name} {adminName.last_name}
              </p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActive("Dashboard")}
                className={`flex items-center w-full px-4 py-2 rounded-md transition ${
                  active === "Dashboard"
                    ? "bg-[#000081] text-white"
                    : "hover:bg-[#0d05d2] hover:text-white"
                }`}
              >
                <HomeIcon className="mr-3 w-5 h-5" />
                Dashboard
              </button>

              <button
                onClick={() => setActive("Users")}
                className={`flex items-center w-full px-4 py-2 rounded-md transition ${
                  active === "Users"
                    ? "bg-[#000081] text-white"
                    : "hover:bg-[#0d05d2] hover:text-white"
                }`}
              >
                <UsersIcon className="mr-3 w-5 h-5" />
                Manage Users
              </button>

              <button
                onClick={() => setActive("Applications")}
                className={`flex items-center w-full px-4 py-2 rounded-md transition ${
                  active === "Applications"
                    ? "bg-[#000081] text-white"
                    : "hover:bg-[#0d05d2] hover:text-white"
                }`}
              >
                <FileTextIcon className="mr-3 w-5 h-5" />
                Applications
              </button>

              <button
                onClick={() => setActive("Settings")}
                className={`flex items-center w-full px-4 py-2 rounded-md transition ${
                  active === "Settings"
                    ? "bg-[#000081] text-white"
                    : "hover:bg-[#0d05d2] hover:text-white"
                }`}
              >
                <SettingsIcon className="mr-3 w-5 h-5" />
                Settings
              </button>
            </nav>
          </div>

          {/* Bottom logout button */}
          <Link
            to="/adminlogin"
            className="flex items-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 hover:text-white rounded-md transition"
          >
            <LogOutIcon className="mr-3 w-5 h-5" />
            Logout
          </Link>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {active === "Dashboard" && "Dashboard Overview"}
            {active === "Users" && "Manage Users"}
            {active === "Applications" && "Service Applications"}
            {active === "Settings" && "Admin Settings"}
          </h2>

          <div className="bg-white p-6 rounded-lg">
            {active === "Dashboard" && (
              <p>Welcome, Admin! Here’s a quick look at your system status.</p>
            )}
            {active === "Users" && <p>List of registered clients and workers.</p>}
            {active === "Applications" && (
              <p>Submitted service applications will appear here.</p>
            )}
            {active === "Settings" && (
              <p>Update admin preferences or system config.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

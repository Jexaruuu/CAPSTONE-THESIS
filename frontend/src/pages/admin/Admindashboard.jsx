import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  FileTextIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100 font-[Poppins]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#000081] text-white flex flex-col p-4">
        <div className="flex items-center mb-10">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">JD HOMECARE</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActive("Dashboard")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition ${
              active === "Dashboard" ? "bg-indigo-600" : "hover:bg-indigo-700"
            }`}
          >
            <HomeIcon className="mr-3 w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActive("Users")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition ${
              active === "Users" ? "bg-indigo-600" : "hover:bg-indigo-700"
            }`}
          >
            <UsersIcon className="mr-3 w-5 h-5" />
            Manage Users
          </button>

          <button
            onClick={() => setActive("Applications")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition ${
              active === "Applications"
                ? "bg-indigo-600"
                : "hover:bg-indigo-700"
            }`}
          >
            <FileTextIcon className="mr-3 w-5 h-5" />
            Applications
          </button>

          <button
            onClick={() => setActive("Settings")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition ${
              active === "Settings" ? "bg-indigo-600" : "hover:bg-indigo-700"
            }`}
          >
            <SettingsIcon className="mr-3 w-5 h-5" />
            Settings
          </button>
        </nav>

        <Link
          to="/adminlogin"
          className="flex items-center px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 rounded-md transition"
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

        {/* Placeholder content based on active tab */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {active === "Dashboard" && (
            <p>Welcome, Admin! Here’s a quick look at your system status.</p>
          )}

          {active === "Users" && <p>List of registered clients and workers.</p>}

          {active === "Applications" && (
            <p>Submitted service applications will appear here.</p>
          )}

          {active === "Settings" && <p>Update admin preferences or system config.</p>}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

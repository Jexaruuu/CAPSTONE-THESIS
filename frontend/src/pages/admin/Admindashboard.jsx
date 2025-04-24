import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  FileTextIcon,
  LogOutIcon,
  SettingsIcon,
  ClipboardListIcon, // ✅ New icon for Service Requests
} from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [admin, setAdminName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString("en-US"));

  const navigate = useNavigate();

  // Real-time clock and date
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString());
      setDate(now.toLocaleDateString("en-US"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/adminlogin");
    } else {
      axios.get(`http://localhost:3000/api/admin/${userId}`)
        .then((res) => setAdminName(res.data))
        .catch((err) => {
          console.error("Failed to fetch admin data:", err);
          navigate("/adminlogin");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (active === "Dashboard") {
      axios.get("http://localhost:3000/api/stats/users")
        .then((res) => setTotalUsers(res.data.totalUsers))
        .catch((err) => console.error("Failed to fetch users count:", err));

      axios.get("http://localhost:3000/api/stats/admins")
        .then((res) => setTotalAdmins(res.data.totalAdmins))
        .catch((err) => console.error("Failed to fetch admins count:", err));
    }
  }, [active]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    axios.post("http://localhost:3000/api/logout")
      .then(() => navigate("/adminlogin"))
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen bg-white text-black flex flex-col justify-between p-4">
          <div>
            <div className="flex items-center mb-10">
              <img src="/logo.png" alt="Logo" className="w-56 h-56 mr-2" />
            </div>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold">
                {`${admin.first_name} ${admin.last_name}`}
              </p>
              <p className="text-md text-gray-500">Admin</p>
            </div>

            <nav className="space-y-2">
  <button
    onClick={() => setActive("Dashboard")}
    className={`relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer ${
      active === "Dashboard"
        ? "bg-[#000081] text-white"
        : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
    }`}
  >
    <span
      className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform ${
        active === "Dashboard" ? "opacity-0" : "translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
      }`}
    ></span>
    <span className="relative flex items-center text-base font-semibold">
      <HomeIcon className="mr-3 w-5 h-5" />
      Dashboard
    </span>
  </button>

  <button
    onClick={() => setActive("Users")}
    className={`relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer ${
      active === "Users"
        ? "bg-[#000081] text-white"
        : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
    }`}
  >
    <span
      className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform ${
        active === "Users" ? "opacity-0" : "translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
      }`}
    ></span>
    <span className="relative flex items-center text-base font-semibold">
      <UsersIcon className="mr-3 w-5 h-5" />
      Manage Users
    </span>
  </button>

  <button
    onClick={() => setActive("Applications")}
    className={`relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer ${
      active === "Applications"
        ? "bg-[#000081] text-white"
        : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
    }`}
  >
    <span
      className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform ${
        active === "Applications" ? "opacity-0" : "translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
      }`}
    ></span>
    <span className="relative flex items-center text-base font-semibold">
      <FileTextIcon className="mr-3 w-5 h-5" />
      Applications
    </span>
  </button>

  <button
    onClick={() => setActive("ServiceRequests")}
    className={`relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer ${
      active === "ServiceRequests"
        ? "bg-[#000081] text-white"
        : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
    }`}
  >
    <span
      className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform ${
        active === "ServiceRequests" ? "opacity-0" : "translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
      }`}
    ></span>
    <span className="relative flex items-center text-base font-semibold">
      <ClipboardListIcon className="mr-3 w-5 h-5" />
      Service Requests
    </span>
  </button>

  <button
    onClick={() => setActive("Settings")}
    className={`relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer ${
      active === "Settings"
        ? "bg-[#000081] text-white"
        : "hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
    }`}
  >
    <span
      className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform ${
        active === "Settings" ? "opacity-0" : "translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
      }`}
    ></span>
    <span className="relative flex items-center text-base font-semibold">
      <SettingsIcon className="mr-3 w-5 h-5" />
      Settings
    </span>
  </button>
</nav>

          </div>

          <button
  onClick={handleLogout}
  className="relative w-full rounded px-4 py-2.5 overflow-hidden group transition-all ease-out duration-300 cursor-pointer bg-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-red-400"
>
  <span
    className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"
  ></span>
  <span className="relative flex items-center text-base font-semibold text-white">
    <LogOutIcon className="mr-3 w-5 h-5" />
    Logout
  </span>
</button>

        </aside>

        {/* Main */}
        <main className="flex-1 p-6 relative">
          <div className="absolute top-6 right-6 text-lg font-semibold text-gray-700 flex items-center space-x-4">
            <div>🕒 {clock}</div>
            <div>📅 {date}</div>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {active === "Dashboard" && "Dashboard Overview"}
            {active === "Users" && "Manage Users"}
            {active === "Applications" && "Service Applications"}
            {active === "ServiceRequests" && "Service Requests"}
            {active === "Settings" && "Admin Settings"}
          </h2>

          <div className="bg-white p-6 rounded-lg">
            {active === "Dashboard" && (
              <>
                <p className="mb-6">Welcome, Admin! Here’s a quick look at users and admins count.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
                    <p className="text-lg font-semibold text-blue-800">Total Users</p>
                    <p className="text-3xl font-bold text-blue-900">{totalUsers}</p>
                  </div>
                  <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
                    <p className="text-lg font-semibold text-green-800">Total Admins</p>
                    <p className="text-3xl font-bold text-green-900">{totalAdmins}</p>
                  </div>
                </div>
              </>
            )}
            {active === "Users" && <p>List of registered clients and workers.</p>}
            {active === "Applications" && <p>Submitted service applications will appear here.</p>}
            {active === "ServiceRequests" && <p>All submitted service requests will be displayed here.</p>}
            {active === "Settings" && <p>Update admin preferences or system config.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

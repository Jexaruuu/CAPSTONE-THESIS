import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiBell, FiMessageSquare } from "react-icons/fi";

const UserNavigation = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const msgRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.firstName || parsedUser.lastName) {
      parsedUser.first_name = parsedUser.first_name || parsedUser.firstName;
      parsedUser.last_name = parsedUser.last_name || parsedUser.lastName;
      delete parsedUser.firstName;
      delete parsedUser.lastName;
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }
    setUser(parsedUser);
  }

  // 🔁 Listen for profile picture updates
  const handleProfilePictureChange = () => {
    const updatedUser = JSON.parse(localStorage.getItem("user"));
    setUser(updatedUser);
  };

  window.addEventListener("profilePictureUpdated", handleProfilePictureChange);

  return () => {
    window.removeEventListener("profilePictureUpdated", handleProfilePictureChange);
  };
}, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
if (
  bellRef.current &&
  !bellRef.current.contains(event.target) &&
  msgRef.current &&
  !msgRef.current.contains(event.target) &&
  profileRef.current &&
  !profileRef.current.contains(event.target)
) {
  setShowNotifications(false);
  setShowMessages(false);
  setShowProfileDropdown(false); // 👈 close profile dropdown
}
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });

      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleProfileUpdate = (updatedUserData) => {
    const updatedUser = {
      ...updatedUserData,
      first_name: updatedUserData.first_name,
      last_name: updatedUserData.last_name,
    };
    delete updatedUser.firstName;
    delete updatedUser.lastName;

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
            <div className="relative flex items-center space-x-3">
              {/* 🔔 Notification Icon */}
              <div ref={bellRef} className="relative">
                <button onClick={() => {
                    setShowNotifications((prev) => !prev);
                    setShowMessages(false); // 👈 Close messages if notifications is opened
                  }}>
                  <FiBell className="text-xl text-gray-600 hover:text-indigo-600" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg border rounded-md z-50">
                    <div className="p-3 text-sm text-gray-700">No new notifications</div>
                  </div>
                )}
              </div>

              {/* 💬 Message Icon */}
              <div ref={msgRef} className="relative">
                <button onClick={() => {
                    setShowMessages((prev) => !prev);
                    setShowNotifications(false); // 👈 Close notifications if messages is opened
                  }}>
                  <FiMessageSquare className="text-xl text-gray-600 hover:text-indigo-600" />
                </button>
                {showMessages && (
                  <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg border rounded-md z-50">
                    <div className="p-3 text-sm text-gray-700">No new messages</div>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Dropdown */}
            {/* <div className="flex flex-col">
              {user ? (
                <p className="text-gray-700 font-medium text-right">{`${user.first_name} ${user.last_name}`}</p>
              ) : (
                <p className="text-gray-700 font-medium">Guest</p>
              )}
              </div> */}

            <div className="relative" ref={profileRef}>
              <div
  className="flex items-center space-x-3 cursor-pointer"
  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
>
  {/* 👤 User name on the left */}
  {user && (
    <div className="flex flex-col items-end">
      <span className="text-sm font-semibold text-gray-800">
        {`${user.first_name} ${user.last_name}`}
      </span>
      <span className="text-xs text-gray-500">{user.email}</span>
    </div>
  )}

  {/* 🖼️ Profile picture on the right */}
  <img
    src={user?.profile_picture ? `http://localhost:3000${user.profile_picture}` : "/profile.png"}
    alt="User Profile"
    className="h-14 w-14 rounded-full border border-gray-400 object-cover"
  />
</div>

              {showProfileDropdown && user && (
  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 p-4">
    <div className="flex items-center space-x-3">
      <img
        src={user?.profile_picture ? `http://localhost:3000${user.profile_picture}` : "/profile.png"}
        alt="User Profile"
        className="h-12 w-12 rounded-full border border-gray-300 object-cover"
      />
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-800">{`${user.first_name} ${user.last_name}`}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>

    <div className="flex flex-col mt-4">
      <button
        onClick={() => navigate('/editprofile')}
        className="w-full rounded px-4 py-2 text-sm bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all"
      >
        Account Menu
      </button>

      <button
        onClick={handleLogout}
        className="mt-2 w-full rounded px-4 py-2 text-sm bg-red-600 text-white font-medium hover:bg-red-500 transition-all"
      >
        Log out
      </button>
    </div>
  </div>
)}

            </div>
                
            {/* <div className="flex flex-col">
              {user ? (
                <p className="text-gray-700 font-medium text-right">{`${user.first_name} ${user.last_name}`}</p>
              ) : (
                <p className="text-gray-700 font-medium">Guest</p>
              )}

              {user && (
                <>
                  <Link to="/editprofile" className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer text-right">Account Menu</Link>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm cursor-pointer text-right">Log out</button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <img
                src={user?.profile_picture ? http://localhost:3000${user.profile_picture} : "/profile.png"}
                alt="User Profile"
                className="h-14 w-14 rounded-full border border-gray-400 object-cover"
              />
            </div> */}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-[14px] text-gray-500">
            Home Service & Maintenance | Bacolod, Negros Occidental, Philippines
          </div>

        <nav>
          <div className="flex flex-col">
            <ul className="flex space-x-6 text-[16px] mb-4">
              <li className="relative group w-max">
                <Link
                  to="/userhome"
                  className={`font-medium ${
                    location.pathname === "/userhome" ? "text-[#0d05d2]" : "text-gray-700"
                  } hover:text-[#0d05d2]`}
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link
                  to="/userabout"
                  className={`font-medium ${
                    location.pathname === "/userabout" ? "text-[#0d05d2]" : "text-gray-700"
                  } hover:text-[#0d05d2]`}
                >
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link
                  to="/bookservices"
                  className={`font-medium ${
                    location.pathname === "/bookservices" ? "text-[#0d05d2]" : "text-gray-700"
                  } hover:text-[#0d05d2]`}
                >
                  Services
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link
                  to="/clientform"
                  className={`font-medium ${
                    location.pathname === "/clientform" ? "text-[#0d05d2]" : "text-gray-700"
                  } hover:text-[#0d05d2]`}
                >
                  Service Request
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link
                  to="/taskerform"
                  className={`font-medium ${
                    location.pathname === "/taskerform" ? "text-[#0d05d2]" : "text-gray-700"
                  } hover:text-[#0d05d2]`}
                >
                  Become a Worker
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            </ul>

            <div className="flex justify-end">
              <ul className="flex space-x-6 text-[16px]">
                <li className="relative group w-max">
                  <Link
                    to="/availableworkers"
                    className={`font-medium ${
                      location.pathname === "/availableworkers" ? "text-[#0d05d2]" : "text-gray-700"
                    } hover:text-[#0d05d2]`}
                  >
                    Hire Worker
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
                <li className="relative group w-max">
                  <Link
                    to="/servicerequest"
                    className={`font-medium ${
                      location.pathname === "/servicerequest" ? "text-[#0d05d2]" : "text-gray-700"
                    } hover:text-[#0d05d2]`}
                  >
                    Find a Worker
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        </div>
      </div>
    </header>
  );
};

export default UserNavigation;
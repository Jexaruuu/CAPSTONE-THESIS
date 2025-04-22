import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserNavigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  console.log(localStorage.getItem("userId"));
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);
  
      // Remove old fields if they exist and use the new ones
      if (parsedUser.firstName || parsedUser.lastName) {
        parsedUser.first_name = parsedUser.first_name || parsedUser.firstName;
        parsedUser.last_name = parsedUser.last_name || parsedUser.lastName;
        delete parsedUser.firstName;
        delete parsedUser.lastName;
        localStorage.setItem("user", JSON.stringify(parsedUser)); // Save cleaned data back
      }
  
      setUser(parsedUser); // Update state with cleaned user data
    }
  }, []);
  
  

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
  
      localStorage.removeItem('user');
      navigate('/');
  
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileUpdate = (updatedUserData) => {
    const updatedUser = {
      ...updatedUserData,
      first_name: updatedUserData.first_name, // Ensure you're using new field names
      last_name: updatedUserData.last_name,
    };
  
    // Remove old fields if they exist
    delete updatedUser.firstName;
    delete updatedUser.lastName;
  
    setUser(updatedUser); // Update state
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated data in localStorage
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
            <div className="flex flex-col">
              {user ? (
                <p className="text-gray-700 font-medium">{`${user.first_name} ${user.last_name}`}</p>
              ) : (
                <p className="text-gray-700 font-medium">Guest</p>
              )}

              {user && (
                <>
                  <Link to="/editprofile" className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer text-right">Edit Profile</Link>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm cursor-pointer text-right">Log out</button>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/profile.png"
                alt="User Profile"
                className="h-14 w-14 rounded-full border border-gray-400 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-[14px] text-gray-500">
            Home Service & Maintenance | Bacolod, Negros Occidental, Philippines
          </div>

          <nav>
            <ul className="flex space-x-6 text-[18px]">
              <li className="relative group w-max">
                <Link to="/userhome" className="text-gray-700 font-medium hover:text-[#0d05d2]">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link to="/userabout" className="text-gray-700 font-medium hover:text-[#0d05d2]">
                  About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link to="/bookservices" className="text-gray-700 font-medium hover:text-[#0d05d2]">
                  Book a Worker
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group w-max">
                <Link to="/taskerform" className="text-gray-700 font-medium hover:text-[#0d05d2]">
                  Become a Worker
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UserNavigation;

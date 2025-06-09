import { Link, useLocation } from "react-router-dom";
import React from "react";

const Navigation = () => {
  const location = useLocation();

  return (
    <header className="bg-[#F3F4F6] shadow-sm p-4">
      <div className="max-w-6xl mx-auto flex flex-col">
        {/* Logo and Login/Signup */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-14 flex items-center">
              <img src="/logo.png" alt="Logo" className="h-[90px] w-[90px] mt-2 -ml-2" />
            </div>
            <h1 className="text-4xl font-[Poppins] font-bold text-[#000081] mt-2.5">JD HOMECARE</h1>
          </div>

          <div className="flex items-center space-x-4 cursor-pointer">
            <Link to="/login">
              <button className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#0d05d2] transition-all ease-out duration-300 cursor-pointer">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-base font-semibold">Log in</span>
              </button>
            </Link>

            <Link to="/signup">
              <button className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#0d05d2] transition-all ease-out duration-300 cursor-pointer">
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-base font-semibold">Sign up</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Location Info and Nav Menu */}
        <div className="flex justify-between items-center">
          <div className="text-[14px] text-gray-500">
            Home Service & Maintenance | Bacolod, Negros Occidental, Philippines
          </div>

          <nav>
            <ul className="flex space-x-6 text-[16px]">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Services", path: "/services" }
              ].map((item, index) => (
                <li key={index} className="relative group w-max">
                  <Link
                    to={item.path}
                    className={`font-medium ${
                      location.pathname === item.path ? "text-[#0d05d2]" : "text-gray-700"
                    } hover:text-[#0d05d2]`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

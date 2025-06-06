import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";

const SidebarMenu = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-20">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Account Menu</h2>
      <ul className="space-y-4 text-sm">
        <li>
          <Link
            to="/editprofile"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-blue-50 ${
              isActive("/editprofile") ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Edit Profile
          </Link>
        </li>

        <li className="text-gray-500 font-medium text-xs uppercase mt-4 tracking-wide">
          Service Request Status
        </li>
        <ul className="pl-4 space-y-2">
          <li>
            <Link
              to="/tracker"
              className={`flex items-center gap-2 px-2 py-1 rounded-md hover:text-blue-600 ${
                isActive("/tracker") ? "text-blue-700 font-semibold" : "text-gray-600"
              }`}
            >
              <ClipboardListIcon className="w-4 h-4" />
              Current Requests
            </Link>
          </li>
          <li>
            <Link
              to="/schedule-tracker"
              className={`flex items-center gap-2 px-2 py-1 rounded-md hover:text-blue-600 ${
                isActive("/schedule-tracker") ? "text-blue-700 font-semibold" : "text-gray-600"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              Schedule Tracker
            </Link>
          </li>
          <li>
            <Link
              to="/applicant-responses"
              className={`flex items-center gap-2 px-2 py-1 rounded-md hover:text-blue-600 ${
                isActive("/applicant-responses") ? "text-blue-700 font-semibold" : "text-gray-600"
              }`}
            >
              <ClipboardListIcon className="w-4 h-4" />
              Applicant Responses
            </Link>
          </li>
        </ul>

        <li className="text-gray-500 font-medium text-xs uppercase mt-6 tracking-wide">
          Application Status
        </li>
        <ul className="pl-4 space-y-2">
          <li>
            <Link
              to="/application-status"
              className={`flex items-center gap-2 px-2 py-1 rounded-md hover:text-blue-600 ${
                isActive("/application-status") ? "text-blue-700 font-semibold" : "text-gray-600"
              }`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Application Overview
            </Link>
          </li>

        </ul>
      </ul>
    </div>
  );
};

export default SidebarMenu;
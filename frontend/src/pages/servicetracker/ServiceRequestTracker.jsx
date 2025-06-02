import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const ServiceRequestTracker = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userEmail = currentUser?.email;
  const [selectedService, setSelectedService] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!userEmail) {
          setError("User email not found. Please log in again.");
          return;
        }

        // ✅ Corrected to use userEmail instead of userId
        const response = await axios.get(`http://localhost:3000/api/clients/requests/${userEmail}`);
        setRequests(response.data);
      } catch (err) {
        console.error("Failed to fetch service requests", err);
        setError("Unable to fetch service requests.");
      }
    };

    fetchRequests();
  }, [userEmail]);

  return (
    <div className="bg-[#F3F4F6] font-sans min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow rounded-xl p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Menu</h2>
          <ul className="space-y-3">
            <li><Link to="/editprofile" className="text-blue-700 font-medium hover:underline">Edit Profile</Link></li>

            <li>
              <button className="text-blue-700 font-medium w-full text-left hover:underline">
                Service Request Status
              </button>
              <ul className="pl-4 mt-1 space-y-1 text-sm text-gray-700">
                <li><Link to="/tracker" className="hover:text-blue-600 font-semibold">Service Request Tracker</Link></li>
                <li><Link to="/schedule-tracker" className="hover:text-blue-600">Schedule Tracker</Link></li>
                <li><Link to="/applicant-responses" className="hover:text-blue-600">Applicant Responses</Link></li>
              </ul>
            </li>

            <li>
              <button className="text-blue-700 font-medium w-full text-left hover:underline">
                Application Status
              </button>
              <ul className="pl-4 mt-1 space-y-1 text-sm text-gray-700">
                <li><Link to="/application-status" className="hover:text-blue-600">Overall Status</Link></li>
                <li><Link to="/application-approved" className="hover:text-green-600">Approved</Link></li>
                <li><Link to="/application-pending" className="hover:text-yellow-600">Pending</Link></li>
                <li><Link to="/application-rejected" className="hover:text-red-600">Rejected</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Service Requests</h2>
       {/* Service Need Filter */}
<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Service Need:</label>
  <div className="flex flex-wrap gap-3">
{["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"].map((category) => (
  <button
    key={category}
    onClick={() => setSelectedService(category)}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition 
      ${selectedService === category
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
  >
    {category}
  </button>
))}
  </div>
</div>

{/* Status Filter */}
<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status:</label>
  <div className="flex flex-wrap gap-3">
    {["All", "Pending", "Approved", "Rejected"].map((status) => (
      <button
        key={status}
        onClick={() => setSelectedStatus(status)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition 
          ${
            selectedStatus.toLowerCase() === status.toLowerCase()
              ? status === "Approved"
                ? "bg-green-600 text-white"
                : status === "Rejected"
                ? "bg-red-600 text-white"
                : status === "Pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
      >
        {status}
      </button>
    ))}
  </div>
</div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

{requests.length === 0 ? (
  <p className="text-gray-600">You have no service requests yet.</p>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {requests
  .filter((req) =>
    (selectedService === "All" || req.service_category?.toLowerCase() === selectedService.toLowerCase()) &&
    (selectedStatus === "All" || req.status?.toLowerCase() === selectedStatus.toLowerCase())
  )
  .map((req) => (
      <div
        key={req.id}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      >
        {/* 🖼️ Service Image */}
        {req.service_image && (
          <img
            src={`http://localhost:3000${req.service_image}`}
            alt="Service"
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        )}

        {/* 📄 Card Content */}
        <div className="p-6 space-y-3">
          {/* 🔧 Service Need */}
          <h3 className="text-xl font-extrabold text-gray-800 tracking-wide">
            Service Need:{" "}
            <span className="text-blue-700">{req.service_category?.toUpperCase()}</span>
          </h3>

          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Address:</span> {req.address}
            </p>
            <p>
              <span className="font-semibold">Preferred Time:</span> {req.preferred_time}
            </p>
            <p>
              <span className="font-semibold">Urgency:</span> {req.urgency}
            </p>
          </div>

          {/* 🏷️ Status Badges */}
          <div className="pt-3 flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm ${
                req.status?.toLowerCase() === "approved"
                  ? "bg-green-100 text-green-800"
                  : req.status?.toLowerCase() === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {req.status}
            </span>

            {/* ✅ Verified by Admin Badge */}
            {req.status?.toLowerCase() === "approved" && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 shadow-sm">
                Verified by Admin
              </span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceRequestTracker;

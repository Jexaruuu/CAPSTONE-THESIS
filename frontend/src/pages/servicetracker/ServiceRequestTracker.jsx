import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import SidebarMenu from "../../components/sidemenu/SidebarMenu";

const ServiceRequestTracker = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userEmail = currentUser?.email;
  const [selectedService, setSelectedService] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

useEffect(() => {
  const fetchRequests = async () => {
    try {
      if (!userEmail) {
        setError("User email not found. Please log in again.");
        return;
      }
      const response = await axios.get(`http://localhost:3000/api/clients/requests/${userEmail}`);

      // Sort newest first by creation date
      const sorted = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setRequests(sorted);
    } catch (err) {
      console.error("Failed to fetch service requests", err);
      setError("Unable to fetch service requests.");
    }
  };

  fetchRequests();
}, [userEmail]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedService, selectedStatus]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this service request?");
    if (!confirmCancel) return;

    try {
      await axios.put(`http://localhost:3000/api/clients/requests/cancel/${id}`);
      setRequests((prev) => prev.map((req) =>
        req.id === id ? { ...req, status: "cancelled" } : req
      ));
    } catch (err) {
      console.error("Error cancelling request", err);
      alert("Failed to cancel the request. Please try again.");
    }
  };

const filteredRequests = requests.filter(
  (req) =>
    (selectedService.toLowerCase() === "all" ||
      req.service_category?.toLowerCase() === selectedService.toLowerCase()) &&
    (selectedStatus.toLowerCase() === "all" ||
      (req.status
        ? req.status.toLowerCase() === selectedStatus.toLowerCase()
        : selectedStatus.toLowerCase() === "pending"))
);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;   
  const currentRequests = filteredRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans">
  <Navigation />
  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[256px_1fr] gap-8">
    {/* ✅ Sidebar container with sticky */}
    <div className="h-fit">
      <div className="sticky top-28">
        <SidebarMenu />
      </div>
    </div>

 <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Current Service Requests
          </h2>

          {/* Service Need Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Service Need:
            </label>
            <div className="flex flex-wrap gap-3">
              {["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedService(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                    ${
                      selectedService === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

         {/* Status Filter */}
<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-700 mb-3">
    Filter by Status:
  </label>
  <div className="flex flex-wrap gap-3">
    {["All", "Pending", "Approved", "Rejected", "Cancelled"].map((status) => (
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
                : status === "Cancelled"
                ? "bg-gray-500 text-white"
                : "bg-gray-400 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
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

          {filteredRequests.length === 0 ? (
            <p className="text-gray-600">There's no service request here.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {currentRequests.map((req) => (
  <div
  key={req.id}
  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
>
  {/* Service Image */}
  {req.service_image && (
    <img
      src={`http://localhost:3000${req.service_image}`}
      alt="Service"
      className="w-full h-48 object-cover"
    />
  )}

  {/* Content Area */}
  <div className="p-6 flex flex-col justify-between h-full space-y-4">
    {/* Service Info */}
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800">
        Service Need:{" "}
        <span className="text-blue-700">
          {req.service_category?.toUpperCase()}
        </span>
      </h3>

     <div className="flex items-start text-sm text-gray-700 gap-2">
  <span className="mt-0.5">📍</span>
  <p className="flex-1">
    <span className="font-semibold">Address:</span> {req.address}
  </p>
</div>
        <div className="flex items-start text-sm text-gray-700 gap-2">
  <span className="mt-0.5">⏰</span>
  <p className="flex-1">
    <span className="font-semibold">Preferred Time:</span> {req.preferred_time}
  </p>
</div>
        <div className="flex items-start text-sm text-gray-700 gap-2">
  <span className="mt-0.5">⚠️</span>
  <p className="flex-1">
    <span className="font-semibold">Urgency:</span> {req.urgency}
  </p>
      </div>
    </div>

    {/* Footer Area with Status + Button */}
<div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-start gap-2">
  {/* Status Badges - stacked above the button */}
  <div className="flex flex-wrap gap-2">
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm ${
        req.status?.toLowerCase() === "approved"
          ? "bg-green-100 text-green-800"
          : req.status?.toLowerCase() === "rejected"
          ? "bg-red-100 text-red-800"
          : req.status?.toLowerCase() === "cancelled"
          ? "bg-gray-200 text-gray-700"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {req.status || "Pending"}
    </span>

    {req.status?.toLowerCase() === "approved" && (
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 shadow-sm">
        Verified by Admin
      </span>
    )}

    {req.status?.toLowerCase() === "cancelled" && (
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
        Cancelled by You
      </span>
    )}
  </div>

  {/* Cancel Button - below badges */}
  <button
    onClick={() => handleCancel(req.id)}
    disabled={req.status?.toLowerCase() === "cancelled"}
    className={`text-xs font-medium px-20 py-2 mt-3 rounded-full border transition ${
      req.status?.toLowerCase() === "cancelled"
        ? "border-gray-300 text-gray-400 cursor-not-allowed"
        : "border-red-500 text-red-600 hover:bg-red-50"
    }`}
  >
    Cancel Request
  </button>
</div>
  </div>
</div>
))}
</div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition duration-200 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceRequestTracker;

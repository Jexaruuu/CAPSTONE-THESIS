// 📄 ApplicationOverview.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import SidebarMenu from "../../components/sidemenu/SidebarMenu";

const ApplicationOverview = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/taskers/byemail/${email}`);
        setApplications(response.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Unable to load your application data.");
      }
    };

    if (email) fetchApplications();
  }, [email]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJobType, selectedStatus]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this application?");
    if (!confirmCancel) return;

    try {
      await axios.put(`http://localhost:3000/api/taskers/cancel/${id}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "Cancelled" } : app))
      );
    } catch (err) {
      console.error("Error cancelling application", err);
      alert("Failed to cancel the application. Please try again.");
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchJobType = selectedJobType === "All" || app.job_type === selectedJobType;
    const matchStatus = selectedStatus === "All" || app.status === selectedStatus;
    return matchJobType && matchStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Tasker Applications</h2>

          {/* Filters */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Job Type:</label>
            <div className="flex flex-wrap gap-3">
              {["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedJobType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedJobType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status:</label>
            <div className="flex flex-wrap gap-3">
              {["All", "Pending", "Approved", "Rejected", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedStatus === status
                      ? status === "Approved"
                        ? "bg-green-600 text-white"
                        : status === "Rejected"
                        ? "bg-red-600 text-white"
                        : status === "Cancelled"
                        ? "bg-gray-500 text-white"
                        : "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {filteredApps.length === 0 ? (
            <p className="text-gray-600">You have not submitted any applications.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((app) => (
                <div
  key={app.id}
  className="bg-white w-[308px] max-w-sm mx-auto rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
>
                  {app.profilePicture && (
                    <img
                      src={`http://localhost:3000${app.profilePicture}`}
                      alt="Profile"
                      className="w-full h-auto object-contain"
                    />
                  )}
                  <div className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-800">
                        Job Type: <span className="text-blue-700">{app.job_type}</span>
                      </h3>
                      <p className="text-sm text-gray-700"><strong>Experience:</strong> {app.experience} years</p>
                      <p className="text-sm text-gray-700"><strong>Skills:</strong> {app.skills}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-start gap-2">
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm ${
                          app.status?.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-800"
                            : app.status?.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-800"
                            : app.status?.toLowerCase() === "cancelled"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {app.status || "Pending"}
                        </span>

                        {app.status?.toLowerCase() === "approved" && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 shadow-sm">
                            Verified by Admin
                          </span>
                        )}

                        {app.status?.toLowerCase() === "cancelled" && (
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                            Cancelled by You
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCancel(app.id)}
                        disabled={app.status?.toLowerCase() === "cancelled"}
                        className={`text-xs font-medium px-20 h-10 mt-3 rounded-full border transition whitespace-nowrap ${
                          app.status?.toLowerCase() === "cancelled"
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-red-500 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        Cancel Application
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicationOverview;

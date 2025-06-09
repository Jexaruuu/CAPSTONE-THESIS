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

  const [selectedApplication, setSelectedApplication] = useState(null);
const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/taskers/byemail/${email}`
      );

      // ✅ Set fetched applications
      setApplications(response.data);
      setError(""); // clear previous errors
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // No data found, not a real error — just set empty
        setApplications([]);
        setError(""); // don't show red error box
      } else {
        console.error("Error fetching applications:", error);
        setError("Unable to load your application data.");
      }
    }
  };

  if (email) {
    fetchApplications();
  }
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
const matchJobType =
  selectedJobType === "All" ||
  (Array.isArray(app.job_type)
    ? app.job_type.map((jt) => jt.toLowerCase()).includes(selectedJobType.toLowerCase())
    : app.job_type?.toLowerCase() === selectedJobType.toLowerCase());
    const matchStatus =
      selectedStatus === "All" ||
      app.status?.toLowerCase() === selectedStatus.toLowerCase();
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
        <div className="h-fit">
          <div className="sticky top-28">
            <SidebarMenu />
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Application Overview</h2>

          {/* Filter by Job Type */}
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

          {/* Filter by Status */}
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
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
          )}

          {filteredApps.length === 0 ? (
            <p className="text-gray-600">You have not submitted any applications.</p>
          ) : (
            <div className="flex flex-col gap-6 w-full">
            {currentItems.map((app) => (
            <div
            key={app.id}
            className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row overflow-hidden"
            >
            {app.profilePicture && (
            <div className="flex justify-center items-center md:items-start md:justify-start md:px-6 pt-6 md:pt-8">
                <img
                src={`http://localhost:3000${app.profilePicture}`}
                alt="Profile"
                className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-full border-4 border-blue-100 shadow-lg"
                />
            </div>
            )}

            <div className="flex flex-col justify-between flex-1 px-6 py-4 md:py-6 space-y-4 bg-white">

                <div className="text-base text-gray-700 leading-7 space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
            <span className="text-gray-700">Name:</span>{" "}
            <span className="text-blue-600">{app.fullName}</span>
            </h3>
            <div className="mb-3">
            <span className="text-gray-600 font-semibold">Job Type:</span>
            <div className="mt-1 flex flex-wrap gap-2">
                {Array.isArray(app.job_type) && app.job_type.length > 0 ? (
                app.job_type.map((type, idx) => (
                    <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full capitalize"
                    >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                ))
                ) : (
                <span className="text-gray-800">-</span>
                )}
            </div>
            </div>

            <p className="text-gray-700">
            <strong>Age:</strong> {app.age} &nbsp; | &nbsp; <strong>Contact:</strong> {app.contactNumber}
            </p>

            <div className="flex flex-col md:flex-row md:gap-10">
            {/* Left column */}
            <div className="flex-1 space-y-2">
                <p><strong>Email:</strong> <span className="text-gray-800">{app.email}</span></p>
                <p><strong>Address:</strong> <span className="text-gray-800">{app.address}</span></p>
                <p><strong>Experience:</strong> <span className="text-gray-800">{app.experience} years</span></p>
                <p><strong>Skills:</strong> <span className="text-gray-800">{app.skills}</span></p>
            </div>

            {/* Right column */}
            <div className="flex-1 space-y-2 mt-4 md:mt-0">
                <p><strong>Tools & Equipment:</strong> <span className="text-gray-800">{app.tools_equipment}</span></p>
            <p>
            <strong>Categories:</strong>{" "}
            <span className="text-gray-800">
                {(() => {
                let categories = app.service_categories;
                if (typeof categories === "string") {
                    try {
                    categories = JSON.parse(categories);
                    } catch {
                    return "-";
                    }
                }

                if (categories && typeof categories === "object") {
                    return Object.values(categories).join(", ");
                }

                return "-";
                })()}
            </span>
            </p>
            </div>
            </div>

            <p className="text-green-600 font-bold text-lg mt-3">
            <strong>Rate Per Hour:</strong> ₱{app.price_rate || "Not Set"}
            </p>
            </div>

            <div className="pt-5 mt-6 border-t border-dashed border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

            <div className="flex gap-2 mt-2">
            {/* 👇 View Documents Button */}
            <button
                onClick={() => {
                setSelectedApplication(app);
                setShowModal(true);
                }}
                className="text-xs font-medium px-6 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 ease-in-out"
            >
                View Documents
            </button>

            {/* 👇 Cancel Button */}
            <button
                onClick={() => handleCancel(app.id)}
                disabled={app.status?.toLowerCase() === "cancelled"}
                className={`text-xs font-medium px-6 py-2 rounded-full border transition-all duration-200 ease-in-out ${
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

      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-4">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 relative">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Uploaded Documents</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                { label: "Proof of Address", key: "proofOfAddress" },
                { label: "Medical Certificate", key: "medicalCertificate" },
                { label: "Certificates", key: "additionalCertificate" },
                { label: "Clearance", key: "clearance" },
                ].map(({ label, key }) => {
                const docPath = selectedApplication[key];
                return (
                    <div key={key} className="flex flex-col items-start">
                    <p className="font-semibold text-gray-700 mb-2">{label}:</p>
                    {docPath ? (
                        <img
                        src={`http://localhost:3000${docPath}`}
                        alt={label}
                        className="w-full max-h-64 object-cover rounded-lg border border-gray-300 shadow-sm"
                        />
                    ) : (
                        <p className="text-sm text-gray-500 italic">Not uploaded</p>
                    )}
                    </div>
                );
                })}
            </div>

            <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
                ×
            </button>
            </div>
        </div>
        )}
      <Footer />
    </div>
  );
};

export default ApplicationOverview;
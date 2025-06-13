import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import SidebarMenu from "../../components/sidemenu/SidebarMenu";
import Footer from "../../components/footer/Footer";

const ScheduleTracker = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/schedules/user/${userId}`,
          { withCredentials: true }
        );
        setSchedules(response.data || []);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        setSchedules([]);
      }
    };

    if (userId) fetchSchedules();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [selectedCategory, selectedStatus]);

  const filtered = schedules.filter((item) => {
    const matchCategory =
      selectedCategory === "All" ||
      item.job_type?.toLowerCase() === selectedCategory.toLowerCase();
    const matchStatus =
      selectedStatus === "All" ||
      item.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule Tracker</h2>

          {/* Filter by Job Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Job Type:</label>
            <div className="flex flex-wrap gap-3">
              {["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedCategory === type
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
              {["All", "Pending", "Approved", "Completed", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedStatus === status
                      ? status === "Approved"
                        ? "bg-green-600 text-white"
                        : status === "Completed"
                        ? "bg-blue-600 text-white"
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

          {/* Schedule Cards */}
          {currentItems.length === 0 ? (
            <p className="text-gray-600">No scheduled services found.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {currentItems.map((schedule, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-700 mb-2">
                        {schedule.service_name}
                      </h3>
                      <p className="text-gray-700"><strong>Date:</strong> {schedule.date}</p>
                      <p className="text-gray-700"><strong>Time:</strong> {schedule.time}</p>
                      <p className="text-gray-700"><strong>Location:</strong> {schedule.location}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize shadow-sm ${
                        schedule.status?.toLowerCase() === "approved"
                          ? "bg-green-100 text-green-800"
                          : schedule.status?.toLowerCase() === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : schedule.status?.toLowerCase() === "cancelled"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
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

export default ScheduleTracker;

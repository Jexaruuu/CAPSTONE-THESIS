import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios";

const UserAvailableServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvedServices, setApprovedServices] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const userId = localStorage.getItem("userId");

  const heroImages = ["/plumber.jpg", "/electrician.jpg", "/carpenter.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApprovedServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients/approved");
        setApprovedServices(response.data);
      } catch (error) {
        console.error("Error fetching approved services:", error);
      }
    };
    fetchApprovedServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "Invalid time";
    }
  };

  const formatPhone = (number) => {
    if (!number) return "N/A";
    const cleaned = number.replace(/\D/g, "");
    return cleaned.startsWith("63") ? `+${cleaned}` : `+63${cleaned}`;
  };

  const handleApply = async (service) => {
  if (String(service.user_id) === String(userId)) {
  alert("You cannot apply to your own service request.");
  return;
}

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3000/api/applications", {
        userId,
        serviceId: service.id
      });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for service:", error);
      alert("Failed to apply for this job.");
    }
  };

  const filteredServices =
    selectedCategory === "All"
      ? approvedServices
      : approvedServices.filter((service) =>
          service.service_type?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="font-sans">
      <Navigation />

      {/* ✅ Hero Section */}
      <div
        className="relative w-full h-96 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundSize: "cover",
          opacity: fade ? 1 : 0,
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)",
        }}
      >
        <section className="relative text-center flex flex-col justify-center items-center text-white w-full h-auto py-10 z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Discover Home Services Tailored for You
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              From repairs to clean-ups — find the right help easily and quickly.
            </p>
          </div>
        </section>
      </div>

      {/* Services Section */}
      <div className="flex max-w-7xl mx-auto px-6 py-12 gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 sticky top-24 self-start">
  <h2 className="text-xl font-semibold mb-4">Service Request Categories</h2>
  <ul className="space-y-2">
    {categories.map((cat) => (
      <li
        key={cat}
        onClick={() => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        className={`group relative cursor-pointer overflow-hidden rounded px-5 py-2.5 transition-all duration-300 font-semibold text-sm ${
          selectedCategory === cat
            ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
            : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
        }`}
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="relative block text-base">{cat}</span>
      </li>
    ))}
  </ul>
</div>

        {/* Cards Grid */}
        <div className="w-full md:w-3/4 flex flex-col space-y-6">
          {paginatedServices.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row-reverse items-center gap-6 min-h-[300px] transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              {/* Right: Profile */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 shadow mb-2">
                  <img
                    src={`http://localhost:3000${service.profile_picture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[13px] text-gray-700 font-semibold mb-1">Service Need:</span>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
                  {service.service_type
                    ? service.service_type.charAt(0).toUpperCase() +
                      service.service_type.slice(1).toLowerCase()
                    : "N/A"}
                </span>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mt-4">
                  ✅ Verified by Admin
                </span>
              </div>

              {/* Left: Details */}
              <div className="flex-grow text-[15px] md:text-base text-gray-700">
                <h3 className="text-xl font-bold text-[#000081] mb-2">
                  {`${service.first_name || ""} ${service.last_name || ""}`.trim() || "Client"}
                </h3>
                <p><span className="text-blue-800 font-semibold">Contact:</span> {formatPhone(service.contact_number)}</p>
                <p><span className="text-blue-800 font-semibold">Address:</span> {service.address || "N/A"}</p>
                <p><span className="text-blue-800 font-semibold">Date:</span> {formatDate(service.preferred_date)}</p>
                <p><span className="text-blue-800 font-semibold">Time:</span> {formatTime(service.preferred_time)}</p>
                <p>
                  <span className="text-blue-800 font-semibold">Urgent:</span>{" "}
                  <span className={service.urgent_request === "Yes" ? "text-red-600 font-bold" : "text-green-600"}>
                    {service.urgent_request === "Yes" ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-[15px] md:text-base text-gray-700">
                  <span className="text-blue-800 font-semibold">Service Description:</span>{" "}
                  {service.service_description?.length > 60
                    ? service.service_description.substring(0, 60) + "..."
                    : service.service_description || "No description available."}
                </p>

                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    onClick={() => openModal(service)}
                    className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-600 text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span className="relative text-base font-semibold">Service Request Details</span>
                  </button>

                  {currentUser?.email !== service.email && (
                    <button
                      onClick={() => handleApply(service)}
                      className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      <span className="relative text-base font-semibold">Apply for this Service Request</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === i + 1
                      ? "bg-[#000081] text-white font-bold"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default UserAvailableServices;

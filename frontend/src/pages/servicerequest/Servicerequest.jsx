import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios";

const UserAvailableServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvedServices, setApprovedServices] = useState([]);

  const heroImages = ["/plumber.jpg", "/electrician.jpg", "/carpenter.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

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

  const filteredServices =
    selectedCategory === "All"
      ? approvedServices
      : approvedServices.filter((service) =>
          service.service_type?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

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
        <div className="w-full md:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-md ${
                  selectedCategory === cat ? "bg-yellow-400 text-black font-bold" : "hover:bg-gray-100"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Services Grid with Uniform Cards */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col min-h-[500px] justify-between text-left transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div>
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow mb-3">
                    <img
                      src={`http://localhost:3000${service.profile_picture}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {`${service.first_name || ""} ${service.last_name || ""}`.trim() || "Client"}
                  </h3>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Contact:</strong> {service.contact_number || "N/A"}</p>
                  <p><strong>Address:</strong> {service.address || "N/A"}</p>
                  <p><strong>Service Need:</strong> {service.service_type || "N/A"}</p>
                  <p><strong>Date:</strong> {service.preferred_date ? formatDate(service.preferred_date) : "N/A"}</p>
                  <p><strong>Time:</strong> {service.preferred_time ? formatTime(service.preferred_time) : "N/A"}</p>
                  <p>
                    <strong>Urgent:</strong>{" "}
                    <span className={service.urgent_request === "Yes" ? "text-red-600 font-bold" : "text-green-600"}>
                      {service.urgent_request === "Yes" ? "Yes" : "No"}
                    </span>
                  </p>
                </div>

                <p className="text-gray-600 text-sm mt-3">
                  {service.service_description
                    ? service.service_description.length > 60
                      ? service.service_description.substring(0, 60) + "..."
                      : service.service_description
                    : "No description available."}
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => openModal(service)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl shadow"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src={`http://localhost:3000${selectedService.service_image}`}
                alt={selectedService.service_type}
                className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
              />
              <h2 className="text-xl font-semibold mb-1">
                {selectedService.service_type || "Service"}
              </h2>
              <p className="text-yellow-700 font-medium mb-1">
                {selectedService.barangay || "Location"}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {selectedService.service_description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserAvailableServices;

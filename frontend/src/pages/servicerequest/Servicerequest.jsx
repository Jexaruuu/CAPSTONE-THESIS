import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios";

const UserAvailableServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvedServices, setApprovedServices] = useState([]);

  // ✅ Hero Section Image Transition
  const heroImages = ["/plumber.jpg", "/electrician.jpg", "/carpenter.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

  // ✅ Fetch approved service requests from the backend
  useEffect(() => {
    const fetchApprovedServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients/approved"); // 👈 Updated endpoint
        setApprovedServices(response.data);
      } catch (error) {
        console.error("Error fetching approved services:", error);
      }
    };

    fetchApprovedServices();
  }, []);

  // ✅ Hero Image Transition Effect
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

  // ✅ Filter approved services by selected category
  const filteredServices = selectedCategory === "All"
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
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)"
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

        {/* Services Grid */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between text-center h-[420px] transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div>
                <img
                  src={`http://localhost:3000${service.service_image}`}
                  alt={service.service_type}
                  className="mx-auto mb-4 h-32 w-32 object-cover rounded-full border-4 border-blue-100 shadow"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800">
                  {service.service_type || "Service"}
                </h3>
                <p className="text-sm text-yellow-700 font-medium mb-1">
                  {service.barangay || "Location"}
                </p>
                <p className="text-gray-600 text-sm">
                  {service.service_description
                    ? (service.service_description.length > 60
                        ? service.service_description.substring(0, 60) + "..."
                        : service.service_description)
                    : "No description available."}
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-3">
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

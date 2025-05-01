import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios";

const currentUser = JSON.parse(localStorage.getItem("user"));

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

        const formatPhone = (number) => {
          if (!number) return "N/A";
          const cleaned = number.replace(/\D/g, "");
          return cleaned.startsWith("63") ? `+${cleaned}` : `+63${cleaned}`;
        };

        const handleApply = async (service) => {
          try {
            // Replace with actual user ID from session/auth context
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
          <h2 className="text-xl font-semibold mb-4">Service Request Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

        {/* Cards */}
        <div className="w-full md:w-3/4 flex flex-col space-y-6">
  {filteredServices.map((service, index) => (
    <div
      key={index}
      className="bg-white shadow-xl rounded-2xl p-6 flex flex-row-reverse items-center gap-6 min-h-[300px] transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
    >
      {/* Right: Profile Picture & Badges */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 shadow mb-2">
          <img
            src={`http://localhost:3000${service.profile_picture}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Service Need Badge */}
        <span className="text-[13px] text-gray-700 font-semibold mb-1">Service Need:</span>
        <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
          {service.service_type ? service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1).toLowerCase() : "N/A"}
        </span>

          {/* Admin Badge */}
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mt-4">
          ✅ Verified by Admin
        </span>
      </div>

      {/* Left: Service Details */}
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
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl relative">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      {/* Main Flex Layout */}
      <div className="flex md:flex-row flex-col gap-2 items-start">
        {/* Left - Profile Picture and Apply Button */}
        <div className="flex flex-col items-center w-[120px] shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow">
            <img
              src={`http://localhost:3000${selectedService.profile_picture}`}
              alt={`${selectedService.first_name} ${selectedService.last_name}`}
              className="w-full h-full object-cover"
            />
          </div>
      {/* Apply Button */}
      {currentUser?.email !== selectedService.email && (
  <button
    onClick={() => handleApply(selectedService)}
    className="mt-3 relative rounded px-6 py-3 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
  >
    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
    <span className="relative text-base font-semibold">Apply</span>
  </button>
)}

        </div>

        {/* Right - Service Info */}
        <div className="flex-1 text-base text-gray-800 pl-4 space-y-2 leading-tight">
          <h2 className="text-xl font-bold text-[#000081]">
            {selectedService.first_name} {selectedService.last_name}
          </h2>

          <p><span className="font-semibold text-blue-800">Service Type:</span> {selectedService.service_type}</p>
          <p><span className="font-semibold text-blue-800">Preferred Date:</span> {formatDate(selectedService.preferred_date)}</p>
          <p><span className="font-semibold text-blue-800">Preferred Time:</span> {formatTime(selectedService.preferred_time)}</p>
          <p><span className="font-semibold text-blue-800">Contact:</span> {formatPhone(selectedService.contact_number)}</p>
          <p><span className="font-semibold text-blue-800">Email:</span> {selectedService.email}</p>
          <p><span className="font-semibold text-blue-800">Address:</span> {selectedService.address}</p>
          <p>
            <span className="font-semibold text-blue-800">Urgent:</span>{" "}
            <span className={`font-bold ${selectedService.urgent_request === "Yes" ? "text-red-600" : "text-green-600"}`}>
              {selectedService.urgent_request}
            </span>
          </p>
          <p><span className="font-semibold text-blue-800">Description:</span> {selectedService.service_description}</p>

          {/* Service Image */}
          <div className="mt-2">
            <p className="font-semibold text-blue-800 mb-1">Service Image:</p>
            <div className="w-full max-h-64 rounded-lg overflow-hidden border">
              <img
                src={`http://localhost:3000${selectedService.service_image}`}
                alt="Service"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      <Footer />
    </div>
  );
};

export default UserAvailableServices;

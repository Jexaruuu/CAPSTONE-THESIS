import React, { useState } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const UserAvailableServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["All", "Home Repair", "Electrical", "Plumbing", "Car Wash", "Laundry Service"];

  const services = [
    {
      title: "Home Repair",
      category: "Home Repair",
      description: "Expert carpentry, furniture repair, and home improvement services.",
      image: "/services/home_repair.jpg",
    },
    {
      title: "Electrical Installation",
      category: "Electrical",
      description: "Safe and professional electrical wiring and troubleshooting.",
      image: "/services/electrical.jpg",
    },
    {
      title: "Plumbing Services",
      category: "Plumbing",
      description: "Leak repairs, pipe installations, and drainage system maintenance.",
      image: "/services/plumbing.jpg",
    },
    {
      title: "Car Wash",
      category: "Car Wash",
      description: "Premium car washing, interior vacuuming, and detailing services.",
      image: "/services/car_wash.jpg",
    },
    {
      title: "Laundry Service",
      category: "Laundry Service",
      description: "Professional laundry for residential and commercial needs.",
      image: "/services/laundry.jpg",
    },
  ];

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((service) => service.category === selectedCategory);

  const openModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  return (
    <div className="font-sans">
      <Navigation />

      <div className="relative h-64 flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: "url('/homerepair.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Available Services</h1>
      </div>

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
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between text-center h-[420px]">
              <div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                <p className="text-sm text-yellow-700 font-medium mb-1">{service.category}</p>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => openModal(service)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  View Details
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Request Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
              />
              <h2 className="text-xl font-semibold mb-1">{selectedService.title}</h2>
              <p className="text-yellow-700 font-medium mb-1">{selectedService.category}</p>
              <p className="text-gray-600 text-sm mb-4">{selectedService.description}</p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Request Service
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserAvailableServices;
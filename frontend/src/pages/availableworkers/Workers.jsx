import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserAvailableWorkers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [approvedWorkers, setApprovedWorkers] = useState([]);
  const navigate = useNavigate();

  // ✅ For hero section image transition
  const heroImages = [
    "/carwash.jpg",
    "/plumber.jpg",
    "/electrician.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

  const fetchApprovedWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/taskers/approved');
      setApprovedWorkers(response.data);
    } catch (error) {
      console.error('Error fetching approved workers:', error);
    }
  };

  useEffect(() => {
    fetchApprovedWorkers();
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

  const filteredWorkers =
    selectedCategory === "All"
      ? approvedWorkers
      : approvedWorkers.filter((worker) => worker.jobType?.toLowerCase() === selectedCategory.toLowerCase());

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorker(null);
  };

  const handleHireNow = (worker) => {
    navigate(`/hire/${worker.id}`, { state: { worker } });
  };

  return (
    <div className="font-sans">
      <Navigation />

      {/* ✅ New Hero Section with Transition */}
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
              Find Trusted Home Service Workers
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Connect with skilled workers ready to help you with your home needs.
            </p>
          </div>
        </section>
      </div>

      {/* Main Section */}
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

        {/* Workers Grid */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkers.map((worker, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
            >
              <div>
                <img
                  src={`http://localhost:3000${worker.profilePicture}`}
                  alt={worker.fullName}
                  className="mx-auto mb-4 h-32 w-32 object-cover rounded-full border-4 border-blue-100 shadow"
                />
                <h3 className="text-lg font-bold mb-1 text-gray-800">{worker.fullName}</h3>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {worker.jobType}
                </span>

                {/* Service Categories Badges */}
                {worker.serviceCategory && (
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {Array.isArray(worker.serviceCategory)
                      ? worker.serviceCategory.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))
                      : worker.serviceCategory.split(',').map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                          >
                            {service.trim()}
                          </span>
                        ))}
                  </div>
                )}

                <div className="text-gray-600 text-sm space-y-1">
                  <p>Age: {worker.age}</p>
                  <p>Gender: {worker.gender}</p>
                  <p>Experience: {worker.experience} years</p>
                  <p>Skills: {worker.skills}</p>
                </div>

                <p className="text-green-600 font-bold text-lg mt-2">
                  ₱{worker.pricePerHour} <span className="text-sm">/ hour</span>
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => openModal(worker)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl shadow"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleHireNow(worker)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-xl shadow"
                >
                  Hire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedWorker && (
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
                src={`http://localhost:3000${selectedWorker.profilePicture}`}
                alt={selectedWorker.fullName}
                className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
              />
              <h3 className="text-xl font-bold mb-1">{selectedWorker.fullName}</h3>
              <p className="text-gray-700 text-sm mb-1">Age: {selectedWorker.age}</p>
              <p className="text-gray-700 text-sm mb-1">Gender: {selectedWorker.gender}</p>
              <p className="text-blue-600 font-semibold mb-1">{selectedWorker.jobType}</p>
              <p className="text-blue-600 font-medium text-sm mb-1">{selectedWorker.serviceCategory}</p>
              <p className="text-gray-600 text-sm mb-1">Experience: {selectedWorker.experience} years</p>
              <p className="text-gray-600 text-sm mb-2">Skills: {selectedWorker.skills}</p>
              <p className="text-green-700 font-bold text-lg">₱{selectedWorker.pricePerHour} / hour</p>
              <button
                onClick={() => handleHireNow(selectedWorker)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Hire Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserAvailableWorkers;

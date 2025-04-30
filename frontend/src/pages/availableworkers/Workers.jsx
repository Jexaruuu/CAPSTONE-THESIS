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

  const heroImages = ["/carwash.jpg", "/plumber.jpg", "/electrician.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

  const fetchApprovedWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/taskers/approved");
      setApprovedWorkers(response.data);
    } catch (error) {
      console.error("Error fetching approved workers:", error);
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
      : approvedWorkers.filter(
          (worker) => worker.jobType?.toLowerCase() === selectedCategory.toLowerCase()
        );

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
                  selectedCategory === cat
                    ? "bg-yellow-400 text-black font-bold"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Workers Grid */}
        <div className="w-full md:w-3/4 flex flex-col space-y-6">
          {filteredWorkers.map((worker, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row-reverse items-center gap-6 min-h-[300px] transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              {/* Profile Picture - Right Side */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow">
                  <img
                    src={`http://localhost:3000${worker.profilePicture}`}
                    alt={worker.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* ✅ Verified by Admin Badge */}
                <span className="mt-3 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ✅ Verified by Admin
                </span>
              </div>

              {/* Worker Info */}
              <div className="flex-grow text-sm text-gray-700">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{worker.fullName}</h3>
                <p className="text-yellow-700 font-medium mb-2">{worker.jobType}</p>
                <p><strong>Age:</strong> {worker.age}</p>
                <p><strong>Gender:</strong> {worker.gender}</p>
                <p><strong>Contact:</strong> {worker.contactNumber || "N/A"}</p>
                <p><strong>Email:</strong> {worker.email || "N/A"}</p>
                <p><strong>Address:</strong> {worker.address || "N/A"}</p>
                <p><strong>Experience:</strong> {worker.experience} years</p>
                <p><strong>Skills:</strong> {worker.skills}</p>
                {worker.serviceCategory && (
                  <p>
                    <strong>Categories:</strong>{" "}
                    {Array.isArray(worker.serviceCategory)
                      ? worker.serviceCategory.join(", ")
                      : worker.serviceCategory}
                  </p>
                )}
<p className="text-green-600 font-bold mt-3">
  <strong>Price Rate:</strong>{" "}
  {worker.pricePerHour ? `₱${worker.pricePerHour} / hour` : <span className="text-red-500">Not Set</span>}
</p>

                <div className="flex flex-wrap gap-4 mt-4">
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
            </div>
          ))}
        </div>
      </div>

     {/* Modal */}
{showModal && selectedWorker && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl relative">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile Image */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={`http://localhost:3000/api/taskers/${selectedWorker.id}/profile-picture`}
            alt={selectedWorker.fullName}
            className="w-36 h-36 object-cover rounded-full border-4 border-blue-300 shadow"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 text-gray-800 space-y-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">{selectedWorker.fullName}</h2>
          <p><strong>Job Type:</strong> {selectedWorker.jobType}</p>
          <p><strong>Age:</strong> {selectedWorker.age}</p>
          <p><strong>Gender:</strong> {selectedWorker.gender}</p>
          <p><strong>Contact:</strong> {selectedWorker.contactNumber || "N/A"}</p>
          <p><strong>Email:</strong> {selectedWorker.email || "N/A"}</p>
          <p><strong>Address:</strong> {selectedWorker.address || "N/A"}</p>
          <p><strong>Experience:</strong> {selectedWorker.experience} years</p>
          <p><strong>Skills:</strong> {selectedWorker.skills}</p>
          {selectedWorker.serviceCategory && (
            <p>
              <strong>Categories:</strong>{" "}
              {Array.isArray(selectedWorker.serviceCategory)
                ? selectedWorker.serviceCategory.join(", ")
                : selectedWorker.serviceCategory}
            </p>
          )}
          <p className="text-green-700 font-semibold text-lg mt-2">
            <strong>Price Rate:</strong> ₱{selectedWorker.pricePerHour} / hour
          </p>
        </div>
      </div>

      {/* Document Section */}
      <div className="mt-8 border-t pt-6 space-y-3 text-sm text-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          📁 Documents
        </h3>

        <div>
          <strong>Proof of Address:</strong>{" "}
          {selectedWorker.proofOfAddress ? (
            <a
              href={`http://localhost:3000/api/taskers/${selectedWorker.id}/proof-of-address`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              View Document
            </a>
          ) : (
            <span className="text-red-500 ml-1">Not Provided</span>
          )}
        </div>

        <div>
          <strong>Medical Certificate:</strong>{" "}
          {selectedWorker.medicalCertificate ? (
            <a
              href={`http://localhost:3000/api/taskers/${selectedWorker.id}/medical-certificate`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              View Document
            </a>
          ) : (
            <span className="text-red-500 ml-1">Not Provided</span>
          )}
        </div>

        <div>
          <strong>Certificates (e.g. TESDA):</strong>{" "}
          {selectedWorker.additionalCertificate ? (
            <a
              href={`http://localhost:3000/api/taskers/${selectedWorker.id}/optional-certificate`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-1"
            >
              View Document
            </a>
          ) : (
            <span className="text-gray-500 ml-1">Optional - Not Uploaded</span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => handleHireNow(selectedWorker)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm shadow-md transition duration-200"
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

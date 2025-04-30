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
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

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

  const formatPhone = (number) => {
    if (!number) return "N/A";
    return number.startsWith("+63") ? number : `+63${number}`;
  };
  
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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
      className={`group relative cursor-pointer overflow-hidden rounded px-5 py-2.5 transition-all duration-300 font-semibold text-sm ${
        selectedCategory === cat
        ? "bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2]"
        : "text-black hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
      }`}
    >
      <span
        className={`absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease`}
      ></span>
      <span className="relative block text-base">{cat}</span>
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
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mt-2">
    ✅ Verified by Admin
  </span>
  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm mt-2">
    {capitalizeFirst(worker.jobType)}
  </span>
              </div>

              {/* Worker Info */}
              <div className="flex-grow text-[15px] md:text-base text-gray-700">
              <div className="flex justify-between items-center mb-3">
  <h3 className="text-xl font-bold text-[#000081]">{worker.fullName}</h3>
</div>
<p><span className="text-blue-800 font-semibold">Age:</span> {worker.age}</p>
<p><span className="text-blue-800 font-semibold">Gender:</span> {worker.gender}</p>
<p><span className="text-blue-800 font-semibold">Contact:</span> {formatPhone(worker.contactNumber)}</p>
<p><span className="text-blue-800 font-semibold">Email:</span> {worker.email || "N/A"}</p>
<p><span className="text-blue-800 font-semibold">Address:</span> {worker.address || "N/A"}</p>
<p><span className="text-blue-800 font-semibold">Experience:</span> {worker.experience} years</p>
<p><span className="text-blue-800 font-semibold">Skills:</span> {worker.skills}</p>
{worker.serviceCategory && (
  <p>
    <span className="text-blue-800 font-semibold">Categories:</span>{" "}
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
  {/* View Profile Button (Green Style) */}
  <button
    onClick={() => openModal(worker)}
    className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
  >
    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
    <span className="relative text-base font-semibold">View Documents</span>
  </button>

  {/* Hire Now Button (Indigo Style) */}
  <button
    onClick={() => handleHireNow(worker)}
    className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
  >
    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
    <span className="relative text-base font-semibold">Hire Now</span>
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
        <div className="flex-shrink-0 mx-auto md:mx-0 flex flex-col items-center gap-4">
  <img
    src={`http://localhost:3000/api/taskers/${selectedWorker.id}/profile-picture`}
    alt={selectedWorker.fullName}
    className="w-36 h-36 object-cover rounded-full border-4 border-blue-300 shadow"
  />

  {/* Hire Now Button */}
  <button
    onClick={() => handleHireNow(selectedWorker)}
    className="relative rounded px-6 py-3 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
  >
    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
    <span className="relative text-base font-semibold">Hire Now</span>
  </button>
</div>
        
        {/* Info Section */}
        <div className="flex-1 text-gray-800 space-y-1">
  <h2 className="text-2xl font-bold text-[#000081] mb-2">{selectedWorker.fullName}</h2>
  <p><span className="text-blue-800 font-semibold">Job Type:</span> {selectedWorker.jobType}</p>
  <p><span className="text-blue-800 font-semibold">Age:</span> {selectedWorker.age}</p>
  <p><span className="text-blue-800 font-semibold">Gender:</span> {selectedWorker.gender}</p>
  <p><span className="text-blue-800 font-semibold">Contact:</span> {formatPhone(selectedWorker.contactNumber)}</p>
  <p><span className="text-blue-800 font-semibold">Email:</span> {selectedWorker.email || "N/A"}</p>
  <p><span className="text-blue-800 font-semibold">Address:</span> {selectedWorker.address || "N/A"}</p>
  <p><span className="text-blue-800 font-semibold">Experience:</span> {selectedWorker.experience} years</p>
  <p><span className="text-blue-800 font-semibold">Skills:</span> {selectedWorker.skills}</p>
  {selectedWorker.serviceCategory && (
  <p>
    <span className="text-blue-800 font-semibold">Categories:</span>{" "}
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

     {/* Document Section aligned with profile info */}
<div className="mt-8 border-t pt-6 text-sm text-gray-700">
  <div className="flex flex-col md:flex-row gap-8">
    {/* Empty space to align with avatar */}
    <div className="hidden md:block w-36"></div>

    {/* Document content */}
    <div className="flex-1 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        📁 Documents
      </h3>

      <div>
        <span className="text-black font-semibold">Proof of Address:</span>{" "}
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
        <span className="text-black font-semibold">Medical Certificate:</span>{" "}
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
        <span className="text-black font-semibold">Certificates (e.g. TESDA):</span>{" "}
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
  </div>
</div>
      </div>
    </div>
)}


      <Footer />
    </div>
  );
};

export default UserAvailableWorkers;

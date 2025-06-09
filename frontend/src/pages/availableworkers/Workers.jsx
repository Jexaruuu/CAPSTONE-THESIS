import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const currentUser = JSON.parse(localStorage.getItem("user")) || {};
const userId = localStorage.getItem("userId");

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
  }, [heroImages.length]);

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorker(null);
  };

const handleHireNow = (worker) => {
  if (String(worker.user_id) === String(userId)) {
    alert("You cannot hire yourself.");
    return;
  }
  navigate("/payment", { state: { worker } });
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

      {/* ✅ Main Section */}
      <div className="flex max-w-7xl mx-auto px-6 py-12 gap-8">
        {/* ✅ Sticky Sidebar */}
        <div className="w-full md:w-1/4 md:sticky top-24 self-start">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
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

        {/* ✅ Workers Grid */}
        <div className="w-full md:w-3/4 flex flex-col space-y-6">
          {(() => {
            const filtered = selectedCategory === "All"
              ? approvedWorkers
              : approvedWorkers.filter((worker) => {
                  try {
                    const jobTypes = JSON.parse(worker.jobType);
                    return Array.isArray(jobTypes)
                      ? jobTypes.some((j) => j.toLowerCase() === selectedCategory.toLowerCase())
                      : jobTypes.toLowerCase() === selectedCategory.toLowerCase();
                  } catch {
                    return false;
                  }
                });

            const totalPages = Math.ceil(filtered.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedWorkers = filtered.slice(startIndex, startIndex + itemsPerPage);

            return (
              <>
                {paginatedWorkers.map((worker, index) => (
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
                      <span className="text-[13px] text-gray-700 font-semibold mt-2">Job type:</span>
                      <div className="mt-1">
                        {(() => {
                          try {
                            const parsed = JSON.parse(worker.jobType);
                            const cleaned = Array.isArray(parsed)
                              ? parsed.map(j => j.replace(/(^"|"$)/g, '').replace(/\\"/g, ''))
                              : [parsed];
                            const topRow = cleaned.slice(0, 3);
                            const bottomRow = cleaned.slice(3);
                            return (
                              <>
                                <div className="flex flex-wrap justify-center gap-2">
                                  {topRow.map((job, index) => (
                                    <span
                                      key={`top-${index}`}
                                      className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm"
                                    >
                                      {capitalizeFirst(job)}
                                    </span>
                                  ))}
                                </div>
                                {bottomRow.length > 0 && (
                                  <div className="flex flex-wrap justify-center gap-2 mt-1">
                                    {bottomRow.map((job, index) => (
                                      <span
                                        key={`bottom-${index}`}
                                        className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm"
                                      >
                                        {capitalizeFirst(job)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </>
                            );
                          } catch {
                            return (
                              <div className="flex justify-center mt-1">
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
                                  {capitalizeFirst(worker.jobType)}
                                </span>
                              </div>
                            );
                          }
                        })()}
                      </div>
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mt-4">
                        ✅ Verified by Admin
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
                     <p>
  <span className="text-blue-800 font-semibold">Tools & Equipment:</span>{" "}
  <span className={worker.tools_equipment?.toLowerCase() === "yes" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
    {worker.tools_equipment?.toLowerCase() === "yes" ? "Yes" : "No"}
  </span>
</p>
                      {worker.serviceCategory && (
                        <p>
                          <span className="text-blue-800 font-semibold">Categories:</span>{" "}
                          {(() => {
                            try {
                              const categories = JSON.parse(worker.serviceCategory);
                              return Object.entries(categories)
                                .map(([key, value]) => `${capitalizeFirst(key)}: ${value}`)
                                .join(", ");
                            } catch {
                              return worker.serviceCategory;
                            }
                          })()}
                        </p>
                      )}
                      <p className="text-green-600 font-bold mt-3">
                        <strong>Price Rate:</strong>{" "}
                        {worker.pricePerHour ? `₱${worker.pricePerHour} / hour` : <span className="text-red-500">Not Set</span>}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        <button
                          onClick={() => openModal(worker)}
                          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
                        >
                          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                          <span className="relative text-base font-semibold">View Documents</span>
                        </button>

                        {currentUser?.email?.toLowerCase().trim() !== worker.email?.toLowerCase().trim() && (
                          <button
                            onClick={() => handleHireNow(worker)}
                            className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400"
                          >
                            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                            <span className="relative text-base font-semibold">Hire Worker</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Buttons */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-full border ${
                          pageNum === currentPage
                            ? "bg-[#000081] text-white"
                            : "bg-white text-[#000081] border-[#000081]"
                        } hover:bg-[#000081] hover:text-white transition`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ✅ Modal */}
     {showModal && selectedWorker && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-4">
    <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="flex-shrink-0 mx-auto md:mx-0 flex flex-col items-center gap-4">
          <img
            src={`http://localhost:3000/api/taskers/${selectedWorker.id}/profile-picture`}
            alt={selectedWorker.fullName}
            className="w-36 h-36 object-cover rounded-full border-4 border-blue-300 shadow"
          />
        </div>

        <div className="flex-1 text-gray-800 space-y-1">
          <h2 className="text-2xl font-bold text-[#000081] mb-2">{selectedWorker.fullName}</h2>
          <p><span className="text-blue-800 font-semibold">Job Type:</span></p>
          <div className="flex flex-wrap gap-2 mb-2">
            {(() => {
              try {
                const parsed = JSON.parse(selectedWorker.jobType);
                const jobTypes = Array.isArray(parsed) ? parsed : [parsed];
                return jobTypes.map((job, index) => (
                  <span
                    key={index}
                    className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm"
                  >
                    {capitalizeFirst(job)}
                  </span>
                ));
              } catch {
                return (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
                    {selectedWorker.jobType}
                  </span>
                );
              }
            })()}
          </div>
          <p><span className="text-blue-800 font-semibold">Age:</span> {selectedWorker.age}</p>
          <p><span className="text-blue-800 font-semibold">Gender:</span> {selectedWorker.gender}</p>
          <p><span className="text-blue-800 font-semibold">Contact:</span> {formatPhone(selectedWorker.contactNumber)}</p>
          <p><span className="text-blue-800 font-semibold">Email:</span> {selectedWorker.email || "N/A"}</p>
          <p><span className="text-blue-800 font-semibold">Address:</span> {selectedWorker.address || "N/A"}</p>
          <p><span className="text-blue-800 font-semibold">Experience:</span> {selectedWorker.experience} years</p>
          <p><span className="text-blue-800 font-semibold">Skills:</span> {selectedWorker.skills}</p>
          <p>
            <span className="text-blue-800 font-semibold">Tools & Equipment:</span>{" "}
            <span className={selectedWorker.tools_equipment?.toLowerCase() === "yes" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {selectedWorker.tools_equipment?.toLowerCase() === "yes" ? "Yes" : "No"}
            </span>
          </p>
          {selectedWorker.serviceCategory && (
            <p className="mt-2">
              <span className="text-blue-800 font-semibold">Categories:</span>{" "}
              {(() => {
                try {
                  const categories = JSON.parse(selectedWorker.serviceCategory);
                  return Object.entries(categories)
                    .map(([key, value]) => `${capitalizeFirst(key)}: ${value}`)
                    .join(", ");
                } catch {
                  return selectedWorker.serviceCategory;
                }
              })()}
            </p>
          )}
          <p className="text-green-700 font-semibold text-lg mt-2">
            <strong>Price Rate:</strong> ₱{selectedWorker.pricePerHour} / hour
          </p>
        </div>
      </div>

      {/* 📁 Embedded Documents */}
      <div className="mt-8 border-t pt-6 text-sm text-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Documents</h3>
        <div className="grid gap-6">
          {[
            { label: "Proof of Address", key: "proofOfAddress", route: "proof-of-address" },
            { label: "Medical Certificate", key: "medicalCertificate", route: "medical-certificate" },
            { label: "TESDA Certificate", key: "additionalCertificate", route: "optional-certificate" },
            { label: "Clearance", key: "clearance", route: "clearance" },
          ].map((doc, index) => (
            <div key={index}>
              <p className="font-medium">{doc.label}:</p>
              {selectedWorker[doc.key] ? (
                <img
                  src={`http://localhost:3000/api/taskers/${selectedWorker.id}/${doc.route}`}
                  alt={doc.label}
                  className="w-full max-h-72 object-contain border mt-2 rounded shadow"
                />
              ) : (
                <p className={`mt-1 ${doc.key === "additionalCertificate" ? "text-gray-500" : "text-red-500"}`}>
                  {doc.key === "additionalCertificate" ? "Optional - Not Uploaded" : "Not Provided"}
                </p>
              )}
            </div>
          ))}
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
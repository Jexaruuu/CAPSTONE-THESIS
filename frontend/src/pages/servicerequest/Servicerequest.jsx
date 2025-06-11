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

  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationService, setApplicationService] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`,
    email: currentUser?.email || "",
    profilePicture: currentUser?.profile_picture || "",
    message: "",
    age: "",
    birthDate: "",
    sex: "",
    contactNumber: "",
    socialMedia: "",
    jobType: "",
    toolsEquipment: "",
    backgroundCheckConsent: false,
    termsConsent: false,
    dataPrivacyConsent: false,
    primaryIdFront: null,
    primaryIdBack: null,
    secondaryId: null,
    proofOfAddress: null,
    medicalCertificate: null,
    tesdaCertificate: null,
  });

  useEffect(() => {
    const fetchApprovedServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/clients/approved", {
          params: { email: currentUser?.email },
        });
        setApprovedServices(response.data);
      } catch (error) {
        console.error("Error fetching approved services:", error);
      }
    };
    fetchApprovedServices();
  }, []);

  useEffect(() => {
  const fetchExistingProfilePicture = async () => {
    const profilePath = currentUser?.profile_picture;
    if (profilePath && !(applicationForm.profilePicture instanceof File)) {
      try {
        const response = await fetch(`http://localhost:3000${profilePath}`);
        const blob = await response.blob();
        const fileName = profilePath.split('/').pop();
        const file = new File([blob], fileName, { type: blob.type });
        setApplicationForm((prev) => ({ ...prev, profilePicture: file }));
      } catch (error) {
        console.error("Error fetching existing profile picture:", error);
      }
    }
  };

  fetchExistingProfilePicture();
}, [currentUser?.profile_picture]);

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
    if (!timeString) return "N/A";
    const trimmed = timeString.trim();
    const isValidFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(trimmed);
    return isValidFormat ? trimmed.toUpperCase() : "Invalid time";
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
    setApplicationService(service);
    setShowApplicationModal(true);
  };

const handleApplicationSubmit = async () => {
    try {
        const formData = new FormData();

        // Add form fields to FormData
        formData.append("fullName", applicationForm.fullName);
        formData.append("email", applicationForm.email);
        formData.append("age", applicationForm.age);
        formData.append("birthDate", applicationForm.birthDate);
        formData.append("sex", applicationForm.sex);
        formData.append("contactNumber", applicationForm.contactNumber);
        formData.append("socialMedia", applicationForm.socialMedia);
        formData.append("jobType", applicationForm.jobType);
        formData.append("toolsEquipment", applicationForm.toolsEquipment);
        formData.append("backgroundCheckConsent", applicationForm.backgroundCheckConsent);
        formData.append("termsConsent", applicationForm.termsConsent);
        formData.append("dataPrivacyConsent", applicationForm.dataPrivacyConsent);

        // Add files to FormData only if they exist
        if (applicationForm.profilePicture) formData.append("profilePicture", applicationForm.profilePicture);
        if (applicationForm.primaryIdFront) formData.append("primaryIdFront", applicationForm.primaryIdFront);
        if (applicationForm.primaryIdBack) formData.append("primaryIdBack", applicationForm.primaryIdBack);
        if (applicationForm.secondaryId) formData.append("secondaryId", applicationForm.secondaryId);
        if (applicationForm.proofOfAddress) formData.append("proofOfAddress", applicationForm.proofOfAddress);
        if (applicationForm.medicalCertificate) formData.append("medicalCertificate", applicationForm.medicalCertificate);
        if (applicationForm.tesdaCertificate) formData.append("tesdaCertificate", applicationForm.tesdaCertificate);

        // Log FormData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Check if all necessary fields are filled before submitting
        if (!applicationForm.fullName || !applicationForm.email || !applicationForm.profilePicture) {
            alert("Please fill all required fields and upload all required documents.");
            return;
        }

        // Send the data to backend
    const response = await axios.post("http://localhost:3000/api/applicants/submit-application", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        alert(response.data.message);
        setShowApplicationModal(false); // Close the modal after successful submission
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

  // Filter out expired services
  const nonExpiredServices = filteredServices.filter((service) => !service.expired);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedServices = nonExpiredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(nonExpiredServices.length / itemsPerPage);

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
          {paginatedServices.length === 0 ? (
            <div className="text-center py-16 text-gray-600 text-lg font-semibold">
              🚧 No {selectedCategory === "All" ? "" : selectedCategory + " "}service requests available right now.
            </div>
          ) : (
            paginatedServices.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl p-6 flex flex-col sm:flex-row-reverse items-center gap-6 min-h-[300px] transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
              >
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
                      ? service.service_type.charAt(0).toUpperCase() + service.service_type.slice(1).toLowerCase()
                      : "N/A"}
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mt-4">
                    ✅ Verified by Admin
                  </span>
                  {/* Display expired badge */}
                  {service.expired && (
                    <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full mt-2">
                      Expired
                    </span>
                  )}
                </div>

                {/* Left: Details */}
                <div className="flex-grow text-[15px] md:text-base text-gray-700">
                  <h3 className="text-xl font-bold text-[#000081] mb-2">
                    {`${service.first_name || ""} ${service.last_name || ""}`.trim() || "Client"}
                  </h3>
                  <p>
                    <span className="text-blue-800 font-semibold">Contact:</span> {formatPhone(service.contact_number)}
                  </p>
                  <p>
                    <span className="text-blue-800 font-semibold">Address:</span> {service.address || "N/A"}
                  </p>
                  <p>
                    <span className="text-blue-800 font-semibold">Date:</span> {formatDate(service.preferred_date)}
                  </p>
                  <p>
                    <span className="text-blue-800 font-semibold">Time:</span> {formatTime(service.preferred_time)}
                  </p>
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
            ))
          )}

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

      {/* Application Modal */}
      {showApplicationModal && applicationService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setApplicationForm((prev) => ({ ...prev, message: "" }));
              }}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-red-600 transition-all"
            >
              &times;
            </button>

            <h2 className="text-3xl font-semibold text-[#000081] mb-8 text-center">Application for Service Request</h2>

            {/* User Info: Profile Picture and Email */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-3">
            <img
  src={
    applicationForm.profilePicture instanceof File
      ? URL.createObjectURL(applicationForm.profilePicture)
      : `http://localhost:3000${applicationForm.profilePicture}`
  }
  alt="User"
  className="w-full h-full object-cover"
/>
              </div>
              <h3 className="text-xl font-bold text-[#000081]">{applicationForm.fullName}</h3>
              <p className="text-sm text-gray-600">{applicationForm.email}</p> {/* Display email address */}
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Age</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.age}
                  onChange={(e) => setApplicationForm({ ...applicationForm, age: e.target.value })}
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Birthdate</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.birthDate}
                  onChange={(e) => setApplicationForm({ ...applicationForm, birthDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Sex</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.sex}
                  onChange={(e) => setApplicationForm({ ...applicationForm, sex: e.target.value })}
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.contactNumber}
                  onChange={(e) =>
                    setApplicationForm({ ...applicationForm, contactNumber: formatPhone(e.target.value) })
                  }
                  placeholder="Enter your contact number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Social Media Account</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.socialMedia}
                  onChange={(e) => setApplicationForm({ ...applicationForm, socialMedia: e.target.value })}
                  placeholder="Enter your social media account link"
                />
              </div>
            </div>

            {/* Work Information Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Type</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.jobType || (applicationService?.service_type.charAt(0).toUpperCase() + applicationService?.service_type.slice(1).toLowerCase())} // Capitalize only the first letter
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Do you have your own tools or equipment?</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={applicationForm.toolsEquipment}
                  onChange={(e) => setApplicationForm({ ...applicationForm, toolsEquipment: e.target.value })}
                >
                  <option value="">Select Yes or No</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Primary ID (Front)</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onChange={(e) => setApplicationForm({ ...applicationForm, primaryIdFront: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Primary ID (Back)</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onChange={(e) => setApplicationForm({ ...applicationForm, primaryIdBack: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Secondary ID</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onChange={(e) => setApplicationForm({ ...applicationForm, secondaryId: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Proof of Address</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onChange={(e) => setApplicationForm({ ...applicationForm, proofOfAddress: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Medical Certificate</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  onChange={(e) => setApplicationForm({ ...applicationForm, medicalCertificate: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">TESDA/Training Certificate (Optional)</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-8"
                  onChange={(e) => setApplicationForm({ ...applicationForm, tesdaCertificate: e.target.files[0] })}
                />
              </div>
            </div>

            {/* Agreement Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={applicationForm.backgroundCheckConsent}
                    onChange={() =>
                      setApplicationForm({
                        ...applicationForm,
                        backgroundCheckConsent: !applicationForm.backgroundCheckConsent,
                      })
                    }
                  />{" "}
                  I consent to background checks and verify my documents. *
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-">
                  <input
                    type="checkbox"
                    checked={applicationForm.termsConsent}
                    onChange={() => setApplicationForm({ ...applicationForm, termsConsent: !applicationForm.termsConsent })}
                  />{" "}
                  I agree to JD HOMECARE's Terms of Service and Privacy Policy. *
                  <a href="#" className="text-blue-600">
                    View Terms of Service and Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={applicationForm.dataPrivacyConsent}
                    onChange={() =>
                      setApplicationForm({
                        ...applicationForm,
                        dataPrivacyConsent: !applicationForm.dataPrivacyConsent,
                      })
                    }
                  />{" "}
                  I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173).
                  <p className="text-sm text-gray-500 mt-1">
                    Your data will be protected and processed in compliance with Philippine law.
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleApplicationSubmit}
                className="bg-[#000081] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0d05d2] transition duration-300"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default UserAvailableServices;

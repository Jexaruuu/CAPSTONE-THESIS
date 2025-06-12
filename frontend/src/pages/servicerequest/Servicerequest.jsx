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
    homeAddress: "",
    socialMedia: "",
    jobType: "",
    yearsExperience: "",
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
        setApplicationForm((prev) => ({
          ...prev,
          profilePicture: file,
        }));
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

  // ✅ Fix: Set job type based on selected service
if (service && service.service_type) {
  setApplicationForm((prev) => ({
    ...prev,
    jobType:
      service.service_type.charAt(0).toUpperCase() +
      service.service_type.slice(1).toLowerCase(),
  }));
}

  setApplicationService(service);
  setShowApplicationModal(true);
};

const handleApplicationSubmit = async () => {
  try {
    // Validate required fields
    const {
      fullName,
      email,
      age,
      birthDate,
      sex,
      contactNumber,
      homeAddress,
      socialMedia,
      yearsExperience,
      jobType,
      toolsEquipment,
      backgroundCheckConsent,
      termsConsent,
      dataPrivacyConsent,
      profilePicture,
      primaryIdFront,
      primaryIdBack,
      secondaryId,
      proofOfAddress,
      medicalCertificate,
    } = applicationForm;

    const missingFields = [];

    if (!fullName) missingFields.push("Full Name");
    if (!email) missingFields.push("Email");
    if (!age) missingFields.push("Age");
    if (!birthDate) missingFields.push("Birthdate");
    if (!sex) missingFields.push("Sex");
    if (!contactNumber) missingFields.push("Contact Number");
    if (!homeAddress) missingFields.push("Home Address");
    if (!socialMedia) missingFields.push("Social Media");
    if (!yearsExperience) missingFields.push("Years of Experience");
    if (!jobType) missingFields.push("Job Type");
    if (!toolsEquipment) missingFields.push("Tools/Equipment Info");
    if (!backgroundCheckConsent) missingFields.push("Background Check Consent");
    if (!termsConsent) missingFields.push("Terms Consent");
    if (!dataPrivacyConsent) missingFields.push("Data Privacy Consent");
    if (!profilePicture) missingFields.push("Profile Picture");
    if (!primaryIdFront) missingFields.push("Primary ID (Front)");
    if (!primaryIdBack) missingFields.push("Primary ID (Back)");
    if (!secondaryId) missingFields.push("Secondary ID");
    if (!proofOfAddress) missingFields.push("Proof of Address");
    if (!medicalCertificate) missingFields.push("Medical Certificate");

    if (missingFields.length > 0) {
      alert(`Please fill in or upload the following required fields:\n\n• ${missingFields.join("\n• ")}`);
      return;
    }

    // Proceed to submit if all required fields are filled
    const formData = new FormData();
    Object.entries(applicationForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const response = await axios.post("http://localhost:3000/api/applicants/submit-application", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert(response.data.message);
    setShowApplicationModal(false);
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

               <div className="flex-grow text-[15px] md:text-base text-gray-700">
  <p>
    <span className="text-blue-800 font-semibold">Client Name:</span>{" "}
    {`${service.first_name || ""} ${service.last_name || ""}`.trim() || "Client"}
  </p>
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
        <p className="text-sm text-gray-600">{applicationForm.email}</p>
      </div>

      {/* Personal Information Section */}
      <div className="border border-gray-200 rounded-xl p-6 mb-8 shadow-sm bg-gray-50">
        <h3 className="text-lg font-semibold text-[#000081] mb-4 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input type="number" value={applicationForm.age} onChange={(e) => setApplicationForm({ ...applicationForm, age: e.target.value })} placeholder="Enter your age" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Birthdate</label>
            <input type="date" value={applicationForm.birthDate} onChange={(e) => setApplicationForm({ ...applicationForm, birthDate: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Sex</label>
            <select value={applicationForm.sex} onChange={(e) => setApplicationForm({ ...applicationForm, sex: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
            <input type="tel" value={applicationForm.contactNumber} onChange={(e) => setApplicationForm({ ...applicationForm, contactNumber: formatPhone(e.target.value) })} placeholder="Enter your contact number" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Home Address</label>
            <input type="text" value={applicationForm.homeAddress} onChange={(e) => setApplicationForm({ ...applicationForm, homeAddress: e.target.value })} placeholder="Enter your home address" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">Social Media Account</label>
            <input type="text" value={applicationForm.socialMedia} onChange={(e) => setApplicationForm({ ...applicationForm, socialMedia: e.target.value })} placeholder="Enter your social media account link" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
        </div>
      </div>

      {/* Work Information Section */}
      <div className="border border-gray-200 rounded-xl p-6 mb-8 shadow-sm bg-gray-50">
        <h3 className="text-lg font-semibold text-[#000081] mb-4 border-b pb-2">Work Information</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
            <input type="number" value={applicationForm.yearsExperience} onChange={(e) => setApplicationForm({ ...applicationForm, yearsExperience: e.target.value })} placeholder="Enter number of years" className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Type</label>
            <input type="text" readOnly value={applicationForm.jobType || (applicationService?.service_type.charAt(0).toUpperCase() + applicationService?.service_type.slice(1).toLowerCase())} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Do you have your own tools or equipment?</label>
            <select value={applicationForm.toolsEquipment} onChange={(e) => setApplicationForm({ ...applicationForm, toolsEquipment: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              <option value="">Select Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
<div className="border border-gray-200 rounded-xl p-6 mb-8 shadow-sm bg-gray-50">
  <h3 className="text-lg font-semibold text-[#000081] mb-4 border-b pb-2">Document Uploads</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { label: "Primary ID (Front)", field: "primaryIdFront" },
      { label: "Primary ID (Back)", field: "primaryIdBack" },
      { label: "Secondary ID", field: "secondaryId" },
      { label: "Proof of Address", field: "proofOfAddress" },
      { label: "Medical Certificate", field: "medicalCertificate" },
      { label: "TESDA/Training Certificate (Optional)", field: "tesdaCertificate" },
    ].map(({ label, field }) => (
      <div key={field}>
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-[#000081] hover:bg-[#0d05d2] text-white py-2 px-4 rounded-lg text-sm transition duration-200">
            Choose File
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setApplicationForm({ ...applicationForm, [field]: e.target.files[0] })}
            />
          </label>
          {applicationForm[field] && (
            <div className="text-sm text-gray-600">
              {applicationForm[field].type?.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(applicationForm[field])}
                  alt="Uploaded preview"
                  className="h-20 rounded shadow"
                />
              ) : (
                <a
                  href={URL.createObjectURL(applicationForm[field])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {applicationForm[field].name || "View Document"}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Agreement Section */}
      <div className="border border-gray-200 rounded-xl p-6 mb-8 shadow-sm bg-gray-50 space-y-4">
        <h3 className="text-lg font-semibold text-[#000081] mb-2">Consent and Agreement</h3>
        <label className="block text-gray-700 font-medium">
          <input type="checkbox" checked={applicationForm.backgroundCheckConsent} onChange={() => setApplicationForm({ ...applicationForm, backgroundCheckConsent: !applicationForm.backgroundCheckConsent })} className="mr-2" />
          I consent to background checks and verify my documents. *
        </label>
        <label className="block text-gray-700 font-medium">
          <input type="checkbox" checked={applicationForm.termsConsent} onChange={() => setApplicationForm({ ...applicationForm, termsConsent: !applicationForm.termsConsent })} className="mr-2" />
          I agree to JD HOMECARE's Terms of Service and Privacy Policy. *
        </label>
        <label className="block text-gray-700 font-medium">
          <input type="checkbox" checked={applicationForm.dataPrivacyConsent} onChange={() => setApplicationForm({ ...applicationForm, dataPrivacyConsent: !applicationForm.dataPrivacyConsent })} className="mr-2" />
          I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173).
          <p className="text-sm text-gray-500 mt-1">
            Your data will be protected and processed in compliance with Philippine law.
          </p>
        </label>
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

{/* Service Request Details Modal */}
{showModal && selectedService && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 px-4">
    <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-red-500 transition"
      >
        &times;
      </button>

      {/* Header Image */}
      <div className="rounded-t-2xl overflow-hidden h-64 w-full">
        <img
          src={`http://localhost:3000${selectedService.service_image}`}
          alt="Service"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8 bg-white space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-[#000081] mb-2">Service Request Details</h2>
          <p className="text-sm text-gray-500">Complete information about this request</p>
        </div>

<div className="flex flex-col md:flex-row items-start gap-8">
  {/* Left: Profile Picture & Email & Badges */}
  <div className="w-full md:w-1/3 flex flex-col items-center">
    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow mb-3">
      <img
        src={`http://localhost:3000${selectedService.profile_picture}`}
        alt="Client"
        className="w-full h-full object-cover"
      />
    </div>

    {/* ✅ Only email shown below profile */}
    <p className="text-sm text-gray-600 text-center">{selectedService.email || "N/A"}</p>

    <div className="mt-3 space-y-2 text-center">
      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
        {selectedService.service_type
          ? selectedService.service_type.charAt(0).toUpperCase() +
            selectedService.service_type.slice(1).toLowerCase()
          : "N/A"}
      </span>
      <span className="block text-[12px] bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
        ✅ Verified by Admin
      </span>
    </div>
  </div>

  {/* Right: Client Info & Description */}
  <div className="w-full md:w-2/3 space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px] text-gray-800">
      <p>
        <strong className="text-blue-800">Client Name:</strong>{" "}
        {`${selectedService.first_name} ${selectedService.last_name}`}
      </p>
      <p>
        <strong className="text-blue-800">Contact:</strong>{" "}
        {formatPhone(selectedService.contact_number)}
      </p>
      <p>
        <strong className="text-blue-800">Address:</strong>{" "}
        {selectedService.address || "N/A"}
      </p>
      <p>
        <strong className="text-blue-800">Date:</strong>{" "}
        {formatDate(selectedService.preferred_date)}
      </p>
      <p>
        <strong className="text-blue-800">Time:</strong>{" "}
        {formatTime(selectedService.preferred_time)}
      </p>
      <p>
        <strong className="text-blue-800">Urgent:</strong>{" "}
        <span
          className={
            selectedService.urgent_request === "Yes"
              ? "text-red-600 font-bold"
              : "text-green-600"
          }
        >
          {selectedService.urgent_request === "Yes" ? "Yes" : "No"}
        </span>
      </p>
      <p className="sm:col-span-2">
        <strong className="text-blue-800">Service Need:</strong>{" "}
        <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium px-2 py-1 rounded">
          {selectedService.service_type
            ? selectedService.service_type.charAt(0).toUpperCase() +
              selectedService.service_type.slice(1).toLowerCase()
            : "N/A"}
        </span>
      </p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-blue-800 mb-2">Service Description:</h4>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm text-sm text-gray-700 whitespace-pre-line">
        {selectedService.service_description || "No description provided."}
      </div>
    </div>
  </div>
</div>
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

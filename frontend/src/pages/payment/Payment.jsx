import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const worker = location.state?.worker;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const heroImages = ["/carpenter.jpg", "/electrician.jpg", "/plumber.jpg"];

  const [showDocModal, setShowDocModal] = useState(false);
const [currentDoc, setCurrentDoc] = useState({ label: "", url: "" });

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

  if (!worker) {
    return (
      <div className="text-center mt-10 text-red-600 text-xl font-semibold">
        No worker selected. Please go back and try again.
      </div>
    );
  }

  const handlePayment = (method) => {
    alert(`Payment via ${method} has been initiated.`);
    navigate("/userhome");
  };

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();

  return (
    <div className="bg-[#F3F4F6] font-sans min-h-screen">
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
              Secure Payment Options
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Pay confidently for hiring trusted home workers.
            </p>
          </div>
        </section>
      </div>

      {/* ✅ Main Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
       {/* 👤 Worker Card */}
<div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 transition duration-300 hover:shadow-xl backdrop-blur-sm">
  <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Worker Information</h3>

  <div className="flex flex-col items-center text-center text-gray-700">
    {/* Profile Picture */}
    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-400 shadow mb-4">
      <img
        src={`http://localhost:3000${worker.profilePicture}`}
        alt={worker.fullName}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Name */}
    <h2 className="text-2xl font-bold text-[#000081] mb-2">{worker.fullName}</h2>

    {/* Job Types */}
    <div className="flex flex-wrap justify-center gap-2 mb-3">
      {(() => {
        try {
          const jobTypes = JSON.parse(worker.jobType);
          const list = Array.isArray(jobTypes) ? jobTypes : [jobTypes];
          return list.map((job, idx) => (
            <span
              key={idx}
              className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm"
            >
              {capitalize(job)}
            </span>
          ));
        } catch {
          return (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              {capitalize(worker.jobType)}
            </span>
          );
        }
      })()}
    </div>

    {/* Verified Badge */}
    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow">
      ✅ Verified by Admin
    </span>
  </div>

  {/* Worker Details */}
  <div className="grid gap-1 text-sm md:text-base text-gray-800 mt-4">
    <p><strong>Age:</strong> {worker.age}</p>
    <p><strong>Gender:</strong> {worker.gender}</p>
    <p><strong>Email:</strong> {worker.email || "N/A"}</p>
    <p><strong>Contact:</strong> +63{worker.contactNumber}</p>
    <p><strong>Address:</strong> {worker.address || "N/A"}</p>
    <p><strong>Experience:</strong> {worker.experience} yrs</p>
    <p><strong>Skills:</strong> {worker.skills}</p>
    <p>
      <strong>Tools & Equipment:</strong>{" "}
      <span className={worker.tools_equipment?.toLowerCase() === "yes"
        ? "text-green-600 font-semibold"
        : "text-red-600 font-semibold"}>
        {capitalize(worker.tools_equipment) || "N/A"}
      </span>
    </p>
    <p className="text-green-600 font-bold mt-2 text-base">
      <strong>Rate:</strong> ₱{worker.pricePerHour?.toLocaleString()} / hour
    </p>
  </div>

  {/* Documents */}
  <div className="mt-8 pt-5 border-t border-gray-200">
    <h4 className="text-md font-bold text-gray-800 mb-3">Documents</h4>
    <ul className="space-y-3">
      {[
        { label: "Proof of Address", path: "proof-of-address", available: worker.proofOfAddress },
        { label: "Medical Certificate", path: "medical-certificate", available: worker.medicalCertificate },
        { label: "TESDA Certificate", path: "optional-certificate", available: worker.additionalCertificate },
        { label: "Clearance", path: "clearance", available: worker.clearance },
      ].map((doc, i) => (
        <li key={i} className="flex items-center justify-between text-sm">
          <span className="font-medium">{doc.label}:</span>
          {doc.available ? (
            <button
              onClick={() => {
                setCurrentDoc({
                  label: doc.label,
                  url: `http://localhost:3000/api/taskers/${worker.id}/${doc.path}`
                });
                setShowDocModal(true);
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <i className="fas fa-file-alt" /> View
            </button>
          ) : (
            <span className={`text-sm ${doc.path === "optional-certificate" ? "text-gray-500" : "text-red-500"}`}>
              {doc.path === "optional-certificate" ? "Optional" : "Not Provided"}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>

{/* 💳 Payment Method */}
<div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all hover:shadow-xl">
  <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">Choose Your Payment Method</h3>

  <div className="grid grid-cols-1 gap-6">
    {["GCash", "PayMaya", "Credit Card"].map((method) => (
      <button
        key={method}
        onClick={() => handlePayment(method)}
        className="flex items-center gap-6 border border-gray-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 ease-in-out group hover:shadow-lg"
      >
        <img
          src={`/${method.toLowerCase().replace(" ", "")}.png`}
          alt={method}
          className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
        />
        <span className="text-lg font-semibold text-gray-800">{method}</span>
      </button>
    ))}
  </div>

  {/* 🔙 Back Button */}
  <div className="pt-10 text-center">
    <button
      onClick={() => navigate(-1)}
      className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#1c1cb8] text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300"
    >
      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
      <span className="relative flex items-center gap-2 text-base font-semibold">
        <i className="fas fa-arrow-left"></i>
        Back to Previous
      </span>
    </button>
    <p className="text-gray-500 mt-4 text-sm">Go back to the previous page.</p>
  </div>
</div>
      </div>

{showDocModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full relative">
      <button
        onClick={() => setShowDocModal(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
      >
        &times;
      </button>
      <h3 className="text-xl font-bold text-[#000081] mb-4 text-center">{currentDoc.label}</h3>
      <div className="max-h-[70vh] overflow-auto rounded border">
        <img
          src={currentDoc.url}
          alt={currentDoc.label}
          className="w-full h-auto object-contain rounded"
        />
      </div>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
};

export default Payment;

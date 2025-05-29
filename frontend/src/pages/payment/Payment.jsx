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
        <div className="bg-white/80 rounded-3xl shadow-2xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Worker Information</h3>
          <div className="flex flex-col items-center text-center text-base md:text-[17px] text-gray-700">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow mb-4">
              <img
                src={`http://localhost:3000${worker.profilePicture}`}
                alt={worker.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#000081] mb-3">{worker.fullName}</h2>

            {/* ✅ Job Type Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
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

            {/* ✅ Verified Badge */}
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm mb-3">
              ✅ Verified by Admin
            </span>

            {/* Worker Info */}
            <div className="grid grid-cols-1 gap-1 text-[15px] text-left w-full">
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
              <p className="text-lg text-green-700 font-bold mt-2">Rate: ₱{worker.pricePerHour} / hour</p>
            </div>
          </div>

          {/* 📁 Document Links */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
            <ul className="space-y-4">
              {[
                { label: "Proof of Address", path: "proof-of-address", available: worker.proofOfAddress },
                { label: "Medical Certificate", path: "medical-certificate", available: worker.medicalCertificate },
                { label: "TESDA Certificate", path: "optional-certificate", available: worker.additionalCertificate },
                { label: "Clearance", path: "clearance", available: worker.clearance },
              ].map((doc, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{doc.label}:</span>
                  {doc.available ? (
                    <a
                      href={`http://localhost:3000/api/taskers/${worker.id}/${doc.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline hover:text-blue-800 flex items-center gap-1"
                    >
                      <i className="fas fa-file-alt" /> View
                    </a>
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
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Payment Method</h3>
          <div className="grid grid-cols-1 gap-6">
            {["GCash", "PayMaya", "Credit Card"].map((method) => (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                className="border border-gray-200 rounded-xl p-6 shadow-sm bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 transition duration-300 ease-in-out group transform hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={`/${method.toLowerCase().replace(" ", "")}.png`}
                  alt={method}
                  className="w-20 h-20 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
                />
                <span className="text-lg font-semibold text-gray-800">{method}</span>
              </button>
            ))}
          </div>

          {/* 🔙 Back Button */}
          <div className="pt-10 text-center">
            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 bg-[#000081] text-white font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all hover:bg-[#1c1cb8] hover:scale-105"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Previous
            </button>
            <p className="text-gray-500 mt-4 text-sm">Go back to previous page.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;

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
              Pay confidently for hiring trusted home workers
            </p>
          </div>
        </section>
      </div>

      {/* ✅ Main Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 👤 Worker Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            Worker Information
          </h3>
          <div className="flex flex-col items-center text-center text-base md:text-[17px] text-gray-700">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow mb-4">
              <img
                src={`http://localhost:3000${worker.profilePicture}`}
                alt={worker.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#000081] mb-3">
              {worker.fullName}
            </h2>
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
            <p className="text-lg text-green-700 font-semibold mt-4">
              Rate: ₱{worker.pricePerHour} / hour
            </p>
          </div>

          {/* 📁 Document Links */}
          <div className="mt-6 border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
            <ul className="space-y-2 text-sm text-left">
              <li>
                <strong>Proof of Address:</strong>{" "}
                {worker.proofOfAddress ? (
                  <a
                    href={`http://localhost:3000/api/taskers/${worker.id}/proof-of-address`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-red-500 ml-1">Not Provided</span>
                )}
              </li>
              <li>
                <strong>Medical Certificate:</strong>{" "}
                {worker.medicalCertificate ? (
                  <a
                    href={`http://localhost:3000/api/taskers/${worker.id}/medical-certificate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-red-500 ml-1">Not Provided</span>
                )}
              </li>
              <li>
                <strong>TESDA/Additional Certificate:</strong>{" "}
                {worker.additionalCertificate ? (
                  <a
                    href={`http://localhost:3000/api/taskers/${worker.id}/optional-certificate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-500 ml-1">Optional</span>
                )}
              </li>
              <li>
                <strong>Clearance:</strong>{" "}
                {worker.clearance ? (
                  <a
                    href={`http://localhost:3000/api/taskers/${worker.id}/clearance`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-red-500 ml-1">Not Provided</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* 💳 Payment Method */}
        <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Choose Your Payment Method
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {["GCash", "PayMaya", "Credit Card"].map((method) => (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                className="border border-gray-300 rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition text-center"
              >
                <img
                  src={`/${method.toLowerCase().replace(" ", "")}.png`}
                  alt={method}
                  className="w-16 h-16 mx-auto mb-3"
                />
                <span className="text-lg font-medium">{method}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-[#000081] hover:underline text-sm"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;

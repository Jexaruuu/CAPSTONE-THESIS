import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const worker = location.state?.worker;

  if (!worker) {
    return (
      <div className="text-center mt-10 text-red-600 text-xl font-semibold">
        No worker selected. Please go back and try again.
      </div>
    );
  }

  const handlePayment = (method) => {
    alert(`Payment via ${method} has been initiated.`);
    // Example: POST payment data to backend here
    navigate("/userhome");
  };

  return (
    <div className="bg-[#F3F4F6] font-sans min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Payment for Hiring: {worker.fullName}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Service Rate: <span className="text-green-600 font-semibold">₱{worker.pricePerHour} / hour</span>
        </p>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Payment Method</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["GCash", "PayMaya", "Credit Card"].map((method) => (
              <button
                key={method}
                onClick={() => handlePayment(method)}
                className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition text-center"
              >
                <img
                  src={`/${method.toLowerCase().replace(" ", "")}.png`}
                  alt={method}
                  className="w-16 h-16 mx-auto mb-2"
                />
                <span className="text-lg font-medium">{method}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
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

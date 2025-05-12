import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-6">
    <div className="bg-blue-100 p-2 rounded-full mr-4">
      <i className={`fas fa-${icon} text-blue-600 text-lg w-6 h-6 text-center`}></i>
    </div>
    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
  </div>
);

const FormField = ({ label, name, register, errors, type = "text", required = false, placeholder = "", options, children }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children || (
      type === "select" ? (
        <select
          {...register(name, required && { required: `${label} is required` })}
          className={`w-full border ${errors[name] ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
        >
          <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
          {options?.map((option, idx) => (
            <option key={idx} value={typeof option === 'string' ? option : option.value}>
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register(name, required && { required: `${label} is required` })}
          className={`w-full border ${errors[name] ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
          placeholder={placeholder}
        />
      )
    )}
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1 flex items-center">
        <i className="fas fa-exclamation-circle mr-1"></i> {errors[name].message}
      </p>
    )}
  </div>
);

const CheckboxField = ({ id, label, description, register, errors, required = false }) => (
  <>
    <div className="flex items-start">
      <div className="flex items-center h-5 mt-1">
        <input
          id={id}
          type="checkbox"
          {...register(id, required && { required: `You must ${label.toLowerCase()}` })}
          className={`focus:ring-blue-500 h-4 w-4 ${errors[id] ? "text-red-500 border-red-300" : "text-blue-600 border-gray-300"} rounded`}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
    {errors[id] && (
      <p className="text-red-500 text-sm mt-1 ml-7 flex items-center">
        <i className="fas fa-exclamation-circle mr-1"></i> {errors[id].message}
      </p>
    )}
  </>
);

const ClientForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const heroImages = ["carpenter.jpg", "electrician.jpg", "plumber.jpg"];

  const barangays = [
    "Alangilan", "Alijis", "Banago", "Bata", "Cabug", "Estefania",
    "Felisa", "Granada", "Handumanan", "Lopez Jaena", "Mandalagan",
    "Mansilingan", "Montevista", "Pahanocoy", "Punta Taytay",
    "Singcang-Airport", "Sum-ag", "Taculing", "Tangub", "Villa Esperanza"
  ];

  const serviceDetails = {
    carpenter: "Furniture repair, installation, and other woodwork services",
    electrician: "Electrical wiring, fixture installation, and repair services",
    plumber: "Pipe installation, leak fixing, and other plumbing services",
    carwasher: "Car washing and detailing services",
    laundry: "Laundry and dry cleaning services"
  };

  const [showReviewNotice, setShowReviewNotice] = useState(false);

  const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    if (data.profilePicture?.length > 0) {
      formData.append("profilePicture", data.profilePicture[0]);
    } else {
      toast.error("Please upload a profile picture before submitting.");
      return;
    }

    if (data.serviceImage?.length > 0) {
      formData.append("serviceImage", data.serviceImage[0]);
    }

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("contactNumber", data.contactNumber);
    formData.append("email", data.email);
    formData.append("street", data.street);
    formData.append("barangay", data.barangay);
    formData.append("additionalAddress", data.additionalAddress);
    formData.append("serviceType", data.serviceType);
    formData.append("serviceDescription", data.serviceDescription);
    formData.append("preferredDate", data.preferredDate);
    formData.append("preferredTime", data.preferredTime);
    formData.append("urgentRequest", data.urgentRequest ? "on" : "");
    formData.append("socialMedia", data.socialMedia || "N/A");

    const response = await axios.post("http://localhost:3000/api/clients/bookservice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    toast.success(response.data.message || "Service booked successfully!");

    // ✅ Show blurred center notification
    setShowReviewNotice(true);
    setTimeout(() => setShowReviewNotice(false), 10000); // Auto-dismiss after 10s

    reset();
  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error("Failed to book service. Please try again.");
  }
};

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

  const selectedService = watch("serviceType");

  return (
    <div className="bg-[#F8FAFC] font-sans min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative w-full h-96 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex flex-col justify-center items-center" 
        style={{ backgroundImage: `url(${heroImages[currentImageIndex]})`, backgroundSize: "cover", opacity: fade ? 1 : 0, boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)" }}
      >
        <section className="relative text-center flex flex-col justify-center items-center text-white w-full h-auto py-10 z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Book Quality Home Services in Bacolod City</h1>
            <p className="text-xl mb-8 text-gray-200">Reliable workers for all your home maintenance needs</p>
          </div>
        </section>
      </div>

      {/* Application Form Container */}
        {/* Form */}
        <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">JD HOMECARE Service Request</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Fill out this form to book a home service. Fields marked with * are required.</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Information Section */}
<section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
  <SectionHeader icon="user" title="Personal Information" />

  {/* Use flex to align form left and image right */}
  <div className="flex flex-col md:flex-row md:justify-between gap-10">
    {/* Left side: Form fields */}
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField 
        label="First Name" 
        name="firstName" 
        register={register} 
        errors={errors} 
        required 
        placeholder="Juan" 
      />
      <FormField 
        label="Last Name" 
        name="lastName" 
        register={register} 
        errors={errors} 
        required 
        placeholder="Dela Cruz" 
      />
      <div>
        <label className="block font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">+63</span>
          </div>
          <input 
            {...register("contactNumber", { 
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10-digit number"
              }
            })} 
            className={`pl-12 w-full border ${errors.contactNumber ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
            placeholder="9123456789"
          />
        </div>
        {errors.contactNumber && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <i className="fas fa-exclamation-circle mr-1"></i> {errors.contactNumber.message}
          </p>
        )}
      </div>
      <FormField 
        label="Email Address" 
        name="email" 
        register={register} 
        errors={errors} 
        type="email" 
        placeholder="your.email@example.com" 
      />
      <FormField 
        label="Street" 
        name="street" 
        register={register} 
        errors={errors} 
        required 
        placeholder="House No. and Street" 
      />
      <FormField 
        label="Barangay" 
        name="barangay" 
        register={register} 
        errors={errors} 
        type="select" 
        required 
        options={barangays}
        placeholder="Select Barangay"
      />
      <div className="col-span-2">
        <textarea 
          {...register("additionalAddress", { required: "Additional address is required" })} 
          className={`w-full border ${errors.additionalAddress ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} 
          rows={2}
          placeholder="Additional address details (landmarks, building name, etc.)"
        />
              <FormField 
  label="Social Media Account" 
  name="socialMedia" 
  register={register} 
  errors={errors} 
  required 
  placeholder="Facebook, Instagram, etc." 
/>
        {errors.additionalAddress && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <i className="fas fa-exclamation-circle mr-1"></i> {errors.additionalAddress.message}
          </p>
        )}
      </div>
    </div>

    {/* Right side: Profile Picture */}
    <div className="w-full md:w-1/3 flex flex-col items-center justify-start mt-6 md:mt-0">
      <label className="block font-medium text-gray-700 mb-2">Profile Picture <span className="text-red-500">*</span></label>
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-3">
        {watch("profilePicture")?.length > 0 ? (
          <img className="h-full w-full object-cover" src={URL.createObjectURL(watch("profilePicture")[0])} alt="Preview" />
        ) : (
          <div className="bg-gray-100 h-full w-full flex items-center justify-center">
            <i className="fas fa-user text-3xl text-gray-400"></i>
          </div>
        )}
      </div>
      {watch("profilePicture")?.length > 0 && (
        <p className="text-sm text-gray-600 mb-1 text-center truncate w-full">{watch("profilePicture")[0].name}</p>
      )}
      <input 
        type="file" 
        {...register("profilePicture", { required: "Profile picture is required" })}
        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        accept="image/*"
      />
      {errors.profilePicture && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i> {errors.profilePicture.message}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-2 text-center">This will be visible to workers - please upload a clear headshot.</p>
    </div>
  </div>
</section>

          {/* Service Information Section */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="tools" title="Service Details" />
            
            <div className="grid grid-cols-1 gap-6">
              <FormField 
                label="Service Type" 
                name="serviceType" 
                register={register} 
                errors={errors} 
                type="select" 
                required 
                options={[
                  {value: "carpenter", label: "Carpenter"},
                  {value: "electrician", label: "Electrician"},
                  {value: "plumber", label: "Plumber"},
                  {value: "carwasher", label: "Car Washer"},
                  {value: "laundry", label: "Laundry Service"}
                ]}
                placeholder="Select service you need..."
              />
              
              {selectedService && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">{serviceDetails[selectedService]}</p>
                </div>
              )}
              
              <div>
                <label className="block font-medium text-gray-700 mb-1">Service Description <span className="text-red-500">*</span></label>
                <textarea 
                  {...register("serviceDescription", { required: "Please describe your service needs" })} 
                  className={`w-full border ${errors.serviceDescription ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  rows={4}
                  placeholder="Please describe in detail what service you need..."
                />
                {errors.serviceDescription && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.serviceDescription.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">The more details you provide, the better we can serve you.</p>
              </div>
              
              <FormField 
                label="Preferred Date" 
                name="preferredDate" 
                register={register} 
                errors={errors} 
                type="date" 
                required 
              />
              
              <FormField 
                label="Preferred Time" 
                name="preferredTime" 
                register={register} 
                errors={errors} 
                type="time" 
                required 
              />
            </div>

{/* 📷 Styled Upload Service Image (Like Certificates) */}
<div className="mt-6">
  <label className="block font-medium text-gray-700 mb-1">Upload Service Image (optional)</label>

  <div
    className={`border-2 border-dashed ${
      watch("serviceImage")?.length > 0 ? "border-transparent" : "border-gray-400"
    } rounded-lg p-4`}
  >
{watch("serviceImage")?.length > 0 ? (
  <div className="w-full h-60 overflow-hidden rounded-md border-2 border-dashed border-black">
    <img
      src={URL.createObjectURL(watch("serviceImage")[0])}
      alt="Service Preview"
      className="w-full h-full object-cover"
    />
  </div>
    ) : (
      <label
        htmlFor="serviceImage"
        className="flex flex-col items-center justify-center h-40 w-full cursor-pointer text-gray-500"
      >
        <span className="font-semibold text-gray-700">Click to upload</span> or drag and drop  
        <p className="text-sm text-gray-400">PDF, JPG, or PNG (max. 5MB)</p>
        <input
          id="serviceImage"
          type="file"
          {...register("serviceImage")}
          accept="image/*"
          className="hidden"
        />
      </label>
    )}
  </div>

  <p className="text-sm text-gray-500 mt-2">Upload a photo of the item or area you need fixed (optional).</p>
</div>
          </section>

          

          {/* Additional Information Section */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="info-circle" title="Additional Information" />
            
            <div className="space-y-4">
              <CheckboxField 
                id="urgentRequest" 
                label="This is an urgent request (additional fees may apply)" 
                register={register}
                errors={errors}
              />

              <CheckboxField 
                id="agreeTerms" 
                label="I agree to JD HOMECARE's Terms of Service and Privacy Policy." 
                description={<><a href="#" className="text-blue-600 hover:underline">View Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></>}
                register={register}
                errors={errors}
                required
              />
            </div>
          </section>

           {/* Submit Button */}
           <div className="text-center pt-8">
            <button 
              type="submit" 
              className="relative overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-blue-400"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative"><i className="fas fa-calendar-check mr-2"></i> Book Service</span>
            </button>
            <p className="text-gray-500 mt-4 text-sm">We'll contact you to confirm your booking details.</p>
          </div>
        </form>
      </div>
      {showReviewNotice && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
    <div className="bg-white/90 text-gray-800 p-6 rounded-xl shadow-xl text-center max-w-md w-full mx-4 animate-fade-in-up border border-gray-200">
      <h3 className="text-lg font-bold mb-2">Thank you for your service request!</h3>
      <p className="text-sm">
        Our team will review your request and contact you within <span className="font-semibold">24–25 hours</span>.<br />
        Please keep your lines open for confirmation.
      </p>
    </div>
  </div>
)}    
      <Footer />
      <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
    </div>
  );
};

// You can export both forms or choose which one to use
export default ClientForm;
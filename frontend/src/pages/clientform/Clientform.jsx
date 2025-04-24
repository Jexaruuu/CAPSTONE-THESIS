import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

// Reusable components to reduce repetition
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
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const onSubmit = (data) => console.log(data);
  
  const heroImages = ["carpenter.jpg", "electrician.jpg", "plumber.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  const selectedService = watch("serviceType");

  const serviceDetails = {
    carpenter: "Furniture repair, installation, and other woodwork services",
    electrician: "Electrical wiring, fixture installation, and repair services",
    plumber: "Pipe installation, leak fixing, and other plumbing services",
    carwasher: "Car washing and detailing services",
    laundry: "Laundry and dry cleaning services"
  };

  const barangays = [
    "Alangilan", "Alijis", "Banago", "Bata", "Cabug", "Estefania", 
    "Felisa", "Granada", "Handumanan", "Lopez Jaena", "Mandalagan", 
    "Mansilingan", "Montevista", "Pahanocoy", "Punta Taytay", 
    "Singcang-Airport", "Sum-ag", "Taculing", "Tangub", "Villa Esperanza"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="bg-[#F8FAFC] font-sans min-h-screen">
      <Navigation />
      
      {/* Hero Section with Image Transition */}
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">JD HOMECARE Service Request</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Fill out this form to book a home service. Fields marked with * are required.</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="user" title="Personal Information" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        message: "Please enter a valid 10-digit phone number (after +63)"
                      }
                    })} 
                    className={`pl-12 w-full border ${errors.contactNumber ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
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
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">Complete Address in Bacolod City <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              </div>
              
              <textarea 
                {...register("additionalAddress", { required: "Additional address details are required" })} 
                className={`w-full border ${errors.additionalAddress ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                rows={2}
                placeholder="Additional address details (landmarks, building name, etc.)"
              />
              {errors.additionalAddress && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i> {errors.additionalAddress.message}
                </p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">Profile Picture <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    {watch("profilePicture")?.length > 0 ? (
                      <img className="h-full w-full object-cover" src={URL.createObjectURL(watch("profilePicture")[0])} alt="Profile preview" />
                    ) : (
                      <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                        <i className="fas fa-user text-3xl text-gray-400"></i>
                      </div>
                    )}
                  </div>
                </div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input 
                    type="file" 
                    {...register("profilePicture", { required: "Profile picture is required" })}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept="image/*"
                  />
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.profilePicture.message}
                    </p>
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">This will be visible to workers - please upload a clear headshot.</p>
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

          {/* Form Submission */}
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
      
      <Footer />
    </div>
  );
};

// You can export both forms or choose which one to use
export default ClientForm;
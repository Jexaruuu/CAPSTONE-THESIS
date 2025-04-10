import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const TaskerForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const onSubmit = (data) => console.log(data);
  
  const heroImages = [
    "/carpenter1.jpg",
    "/electrician1.jpg",
    "/plumber1.jpg",
    "/carwash2.jpg",
    "/laundry2.jpg"
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");

  const selectedJobType = watch("jobType");

  // Service categories based on job type
  const serviceCategories = {
    carpenter: [
      "Furniture Repair", 
      "Furniture Assembly", 
      "Cabinet Installation", 
      "Wood Polishing", 
      "Shelving Installation", 
      "Door Repair/Installation",
      "Wooden Floor Installation/Repair"
    ],
    electrician: [
      "Wiring Repair", 
      "Lighting Fixtures", 
      "Electrical Panel Service", 
      "Ceiling Fan Installation", 
      "Outlet/Switch Installation", 
      "Home Automation Setup",
      "Electric Appliance Repair"
    ],
    plumber: [
      "Leak Fixing", 
      "Pipe Installation", 
      "Toilet Repair/Installation", 
      "Faucet Repair/Installation", 
      "Water Heater Services", 
      "Drain Cleaning",
      "Shower/Bathtub Installation"
    ],
    carwasher: [
      "Exterior Wash", 
      "Interior Detailing", 
      "Full Detailing", 
      "Polish & Wax", 
      "Scratch Removal", 
      "Headlight Restoration",
      "Engine Bay Cleaning"
    ],
    laundry: [
      "Dry Cleaning", 
      "Wash & Fold", 
      "Ironing Service", 
      "Stain Removal", 
      "Delicates Cleaning", 
      "Comforter/Bedding Cleaning",
      "Business Uniform Service"
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % heroImages.length
        );
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="bg-[#F8FAFC] font-sans min-h-screen">
      <Navigation />
      
      {/* Hero Section with Image Transition */}
      <div 
        className="relative w-full h-96 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex flex-col justify-center items-center" 
        style={{ 
          backgroundImage: `url(${heroImages[currentImageIndex]})`, 
          backgroundSize: "cover", 
          opacity: fade ? 1 : 0,
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)"
        }}
      >
        <section className="relative text-center flex flex-col justify-center items-center text-white w-full h-auto py-10 z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Join Our Team of Trusted Home Service Workers
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Earn money doing what you love while helping homeowners with their needs
            </p>
          </div>
        </section>
      </div>

      {/* Application Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Form Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8 sticky top-4 z-10 flex justify-center">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => scrollToSection("personal")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === "personal" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
            >
              <i className="fas fa-user mr-2"></i> Personal Info
            </button>
            <button
              onClick={() => scrollToSection("professional")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === "professional" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
            >
              <i className="fas fa-briefcase mr-2"></i> Professional Info
            </button>
            <button
              onClick={() => scrollToSection("documents")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === "documents" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
            >
              <i className="fas fa-file-alt mr-2"></i> Documents
            </button>
            <button
              onClick={() => scrollToSection("government")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === "government" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
            >
              <i className="fas fa-landmark mr-2"></i> Government IDs
            </button>
            <button
              onClick={() => scrollToSection("agreements")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === "agreements" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
            >
              <i className="fas fa-file-signature mr-2"></i> Agreements
            </button>
          </nav>
        </div>

        {/* Form Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            JD HOMECARE Service Provider Application
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete this form to join our network of trusted professionals. Fields marked with * are required.
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <section id="personal" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <i className="fas fa-user text-blue-600 text-lg w-6 h-6 text-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  {...register("fullName", { required: "Full name is required" })} 
                  className={`w-full border ${errors.fullName ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  placeholder="Juan Dela Cruz"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  {...register("birthDate", { required: "Birth date is required" })} 
                  className={`w-full border ${errors.birthDate ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
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

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })} 
                  className={`w-full border ${errors.email ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">
                Home Address <span className="text-red-500">*</span>
              </label>
              <textarea 
                {...register("address", { required: "Address is required" })} 
                className={`w-full border ${errors.address ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                rows={3}
                placeholder="House No., Street, Barangay, City, Province"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i> {errors.address.message}
                </p>
              )}
            </div>

            {/* Profile Picture Upload - Added Section */}
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    {watch("profilePicture")?.length > 0 ? (
                      <img 
                        className="h-full w-full object-cover" 
                        src={URL.createObjectURL(watch("profilePicture")[0])} 
                        alt="Profile preview" 
                      />
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
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    accept="image/*"
                  />
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.profilePicture.message}
                    </p>
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will be visible to clients - please upload a clear headshot.
              </p>
            </div>
          </section>

          {/* Professional Information Section */}
          <section id="professional" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <i className="fas fa-briefcase text-blue-600 text-lg w-6 h-6 text-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Professional Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Type Selection */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select 
                  {...register("jobType", { required: "Please select a job type" })} 
                  className={`w-full border ${errors.jobType ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  <option value="">Select your job type...</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carwasher">Car Washer</option>
                  <option value="laundry">Laundry Service</option>
                </select>
                {errors.jobType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.jobType.message}
                  </p>
                )}
              </div>

              {/* Service Category (Conditional based on job type) */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Service Category <span className="text-red-500">*</span>
                </label>
                <select 
                  {...register("serviceCategory", { required: "Please select a service category" })} 
                  className={`w-full border ${errors.serviceCategory ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  disabled={!selectedJobType}
                >
                  <option value="">Select your service...</option>
                  {selectedJobType && serviceCategories[selectedJobType] && 
                    serviceCategories[selectedJobType].map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))
                  }
                </select>
                {errors.serviceCategory && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.serviceCategory.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    {...register("experience", { 
                      required: "Years of experience is required",
                      min: { value: 0, message: "Must be 0 or more" }
                    })} 
                    className={`w-full border ${errors.experience ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                    placeholder="3"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">years</span>
                  </div>
                </div>
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">
                Skills & Certifications
              </label>
              <textarea 
                {...register("skills")} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                rows={4}
                placeholder="List your skills and any certifications (TESDA, etc.)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate skills with commas (e.g., Electrical Wiring, Plumbing, Carpentry)
              </p>
            </div>
          </section>

          {/* Documents Section */}
          <section id="documents" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <i className="fas fa-file-alt text-blue-600 text-lg w-6 h-6 text-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Required Documents
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    Primary ID (Front) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("primaryIDFront", { required: "Primary ID is required" })} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    UMID, Passport, Driver's License, etc.
                  </p>
                  {errors.primaryIDFront && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.primaryIDFront.message}
                    </p>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    Primary ID (Back)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("primaryIDBack")} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    Secondary ID <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("secondaryID", { required: "Secondary ID is required" })} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    SSS ID, PhilHealth ID, etc.
                  </p>
                  {errors.secondaryID && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.secondaryID.message}
                    </p>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    NBI/Police Clearance <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("clearance", { required: "Clearance is required" })} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  {errors.clearance && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.clearance.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    Proof of Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("proofOfAddress", { required: "Proof of address is required" })} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Barangay Certificate, Utility Bill
                  </p>
                  {errors.proofOfAddress && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.proofOfAddress.message}
                    </p>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                  <label className="block font-medium text-gray-700 mb-2">
                    Medical Certificate <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (max. 5MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        {...register("medicalCertificate", { required: "Medical certificate is required" })} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  {errors.medicalCertificate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i> {errors.medicalCertificate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                <label className="block font-medium text-gray-700 mb-2">
                  Certificates (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, JPG, or PNG (max. 5MB each)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      {...register("certificates")} 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  TESDA, Training Certificates, etc.
                </p>
              </div>
            </div>
          </section>

          {/* Government Numbers Section */}
          <section id="government" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <i className="fas fa-landmark text-blue-600 text-lg w-6 h-6 text-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Government Numbers
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  TIN Number
                </label>
                <input 
                  {...register("tinNumber")} 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  placeholder="123-456-789-000"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  SSS Number <span className="text-red-500">*</span>
                </label>
                <input 
                  {...register("sssNumber", { required: "SSS number is required" })} 
                  className={`w-full border ${errors.sssNumber ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  placeholder="XX-XXXXXXX-X"
                />
                {errors.sssNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.sssNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  PhilHealth Number <span className="text-red-500">*</span>
                </label>
                <input 
                  {...register("philHealthNumber", { required: "PhilHealth number is required" })} 
                  className={`w-full border ${errors.philHealthNumber ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  placeholder="XX-XXXXXXXXX-X"
                />
                {errors.philHealthNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.philHealthNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Pag-IBIG Number <span className="text-red-500">*</span>
                </label>
                <input 
                  {...register("pagIbigNumber", { required: "Pag-IBIG number is required" })} 
                  className={`w-full border ${errors.pagIbigNumber ? "border-red-300" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`} 
                  placeholder="XXXX-XXXX-XXXX"
                />
                {errors.pagIbigNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i> {errors.pagIbigNumber.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Agreements Section */}
          <section id="agreements" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <i className="fas fa-file-signature text-blue-600 text-lg w-6 h-6 text-center"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Agreements
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input 
                    id="consentBackgroundCheck"
                    type="checkbox" 
                    {...register("consentBackgroundCheck", { required: "You must consent to background checks" })} 
                    className={`focus:ring-blue-500 h-4 w-4 ${errors.consentBackgroundCheck ? "text-red-500 border-red-300" : "text-blue-600 border-gray-300"} rounded`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consentBackgroundCheck" className="font-medium text-gray-700">
                    I consent to background checks and verify my documents. <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500 mt-1">
                    JD HOMECARE may verify the authenticity of your submitted documents.
                  </p>
                </div>
              </div>
              {errors.consentBackgroundCheck && (
                <p className="text-red-500 text-sm mt-1 ml-7 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i> {errors.consentBackgroundCheck.message}
                </p>
              )}

              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input 
                    id="agreeTerms"
                    type="checkbox" 
                    {...register("agreeTerms", { required: "You must agree to the terms" })} 
                    className={`focus:ring-blue-500 h-4 w-4 ${errors.agreeTerms ? "text-red-500 border-red-300" : "text-blue-600 border-gray-300"} rounded`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                    I agree to JD HOMECARE's Terms of Service and Privacy Policy. <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500 mt-1">
                    <a href="#" className="text-blue-600 hover:underline">View Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm mt-1 ml-7 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i> {errors.agreeTerms.message}
                </p>
              )}

              <div className="flex items-start">
                <div className="flex items-center h-5 mt-1">
                  <input 
                    id="consentDataPrivacy"
                    type="checkbox" 
                    {...register("consentDataPrivacy", { required: "You must consent to data privacy terms" })} 
                    className={`focus:ring-blue-500 h-4 w-4 ${errors.consentDataPrivacy ? "text-red-500 border-red-300" : "text-blue-600 border-gray-300"} rounded`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="consentDataPrivacy" className="font-medium text-gray-700">
                    I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173). <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500 mt-1">
                    Your data will be protected and processed in compliance with Philippine law.
                  </p>
                </div>
              </div>
              {errors.consentDataPrivacy && (
                <p className="text-red-500 text-sm mt-1 ml-7 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i> {errors.consentDataPrivacy.message}
                </p>
              )}
            </div>
          </section>

          {/* Form Submission */}
          <div className="text-center pt-8">
          <button 
            type="submit" 
            className="relative overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-blue-400"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative">
              <i className="fas fa-paper-plane mr-2"></i> Submit Application
            </span>
          </button>
            <p className="text-gray-500 mt-4 text-sm">
              By submitting this form, you confirm that all information provided is accurate and complete.
            </p>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaskerForm;
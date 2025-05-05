import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import axios from "axios"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable components...
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

const FileUpload = ({ label, name, register, errors, watch, required = false, hint }) => {
  const selectedFile = watch(name)?.[0];
  const isImage = selectedFile && selectedFile.type.startsWith("image/");

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
      <label className="block font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          className={`flex flex-col w-full ${
            isImage ? "h-60" : "h-32"  // 👈 h-60 for image uploaded (medium height)
          } border-2 border-dashed hover:border-blue-400 hover:bg-gray-50 transition-all rounded-lg cursor-pointer relative overflow-hidden`}
        >
          {selectedFile ? (
            isImage ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg" // 👈 object-cover makes it fit nicely inside the box
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-7">
                <i className="fas fa-file-upload text-3xl text-blue-500 mb-2"></i>
                <p className="text-sm font-semibold text-gray-700">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">Uploaded</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center pt-7">
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, or PNG (max. 5MB)
              </p>
            </div>
          )}
          <input 
            type="file" 
            {...register(name, required && { required: `${label} is required` })} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
      </div>
      {hint && <p className="text-sm text-gray-500 mt-2">{hint}</p>}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <i className="fas fa-exclamation-circle mr-1"></i> {errors[name].message}
        </p>
      )}
    </div>
  );
};

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

// 🧩 Now your main TaskerForm Component
const TaskerForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState("");

  const heroImages = ["/carpenter1.jpg", "/electrician1.jpg", "/plumber1.jpg", "/carwash2.jpg", "/laundry2.jpg"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");

  // ✅ Added for multi-job logic
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});

  const selectedJobType = watch("jobType"); // still used in some legacy parts if needed

  const serviceCategories = {
    carpenter: ["Furniture Repair", "Furniture Assembly", "Cabinet Installation", "Wood Polishing", "Shelving Installation", "Door Repair/Installation", "Wooden Floor Installation/Repair"],
    electrician: ["Wiring Repair", "Lighting Fixtures", "Electrical Panel Service", "Ceiling Fan Installation", "Outlet/Switch Installation", "Home Automation Setup", "Electric Appliance Repair"],
    plumber: ["Leak Fixing", "Pipe Installation", "Toilet Repair/Installation", "Faucet Repair/Installation", "Water Heater Services", "Drain Cleaning", "Shower/Bathtub Installation"],
    carwasher: ["Exterior Wash", "Interior Detailing", "Full Detailing", "Polish & Wax", "Scratch Removal", "Headlight Restoration", "Engine Bay Cleaning"],
    laundry: ["Dry Cleaning", "Wash & Fold", "Ironing Service", "Stain Removal", "Delicates Cleaning", "Comforter/Bedding Cleaning", "Business Uniform Service"]
  };

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

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
  };

  const navButtons = [
    { id: "personal", icon: "user", text: "Personal Info" },
    { id: "professional", icon: "briefcase", text: "Professional Info" },
    { id: "documents", icon: "file-alt", text: "Documents" },
    { id: "government", icon: "landmark", text: "Government IDs" },
    { id: "agreements", icon: "file-signature", text: "Agreements" }
  ];

  // ✅ UPDATED SUBMIT HANDLER
  const onSubmit = async (data) => {
    try {
      data.jobType = JSON.stringify(selectedJobTypes);
      data.serviceCategory = JSON.stringify(selectedCategories);
  
      const formData = new FormData();
      for (const key in data) {
        if (data[key] instanceof FileList && data[key].length > 0) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
  
      const response = await axios.post("http://localhost:3000/api/taskers/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      setSubmitStatus("success");
      toast.success("Application submitted successfully!");
      reset();
      setSelectedJobTypes([]);
      setSelectedCategories({});
    } catch (error) {
      console.error("Error submitting tasker form:", error);
      setSubmitStatus("error");
      toast.error("Please complete all required fields correctly.");
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-sans min-h-screen">
      <Navigation />
      
      {/* Hero Section with Image Transition */}
      <div className="relative w-full h-96 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex flex-col justify-center items-center" 
        style={{ backgroundImage: `url(${heroImages[currentImageIndex]})`, backgroundSize: "cover", opacity: fade ? 1 : 0, boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.6)" }}
      >
        <section className="relative text-center flex flex-col justify-center items-center text-white w-full h-auto py-10 z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Join Our Team of Trusted Home Service Workers</h1>
            <p className="text-xl mb-8 text-gray-200">Earn money doing what you love while helping homeowners with their needs</p>
          </div>
        </section>
      </div>

      {/* Application Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Form Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8 sticky top-4 z-10 flex justify-center">
          <nav className="flex overflow-x-auto">
            {navButtons.map(btn => (
              <button
                key={btn.id}
                onClick={() => scrollToSection(btn.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${activeSection === btn.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"}`}
              >
                <i className={`fas fa-${btn.icon} mr-2`}></i> {btn.text}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">JD HOMECARE Service Provider Application</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Complete this form to join our network of trusted professionals. Fields marked with * are required.</p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
{/* Personal Information Section */}
<section id="personal" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
  <SectionHeader icon="user" title="Personal Information" />

  {/* 👇 Main grid: Left form + Right profile picture */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* 👈 Form fields in 2/3 width */}
    <div className="md:col-span-2 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" name="fullName" register={register} errors={errors} required placeholder="Juan Dela Cruz" />
        <FormField label="Birth Date" name="birthDate" register={register} errors={errors} type="date" required />
        <FormField 
          label="Sex" 
          name="gender" 
          register={register} 
          errors={errors} 
          type="select" 
          required 
          options={[
            {value: "Male", label: "Male"},
            {value: "Female", label: "Female"}
          ]}
          placeholder="Select sex"
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
          required 
          placeholder="your.email@example.com" 
        />
    <FormField 
  label="Social Media Account" 
  name="social_media" 
  register={register} 
  errors={errors} 
  required 
  placeholder="Facebook, Instagram, etc." 
/>

      </div>

      {/* 👇 Address field */}
      <div>
        <label className="block font-medium text-gray-700 mb-1">Home Address <span className="text-red-500">*</span></label>
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
    </div>

{/* 👉 Profile picture on right */}
<div className="flex flex-col items-center justify-start">
  <label className="block font-medium text-gray-700 mb-2">
    Profile Picture <span className="text-red-500">*</span>
  </label>

  {/* Preview Image */}
  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
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

  {/* File Name (if exists) */}
  {watch("profilePicture")?.length > 0 && (
    <p className="text-sm text-gray-700 font-medium mb-1 text-center">
      {watch("profilePicture")[0].name}
    </p>
  )}

  {/* File Input Button */}
  <input
    type="file"
    {...register("profilePicture", { required: "Profile picture is required" })}
    className="block w-full text-sm text-gray-500 file:mx-auto file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    accept="image/*"
  />

  {/* Error Message */}
  {errors.profilePicture && (
    <p className="text-red-500 text-sm mt-1 flex items-center">
      <i className="fas fa-exclamation-circle mr-1"></i> {errors.profilePicture.message}
    </p>
  )}

  {/* Caption */}
  <p className="text-sm text-gray-500 mt-2 text-center">
    This will be visible to clients. Please upload a clear headshot.
  </p>
</div>
  </div>
</section>


{/* Work Information Section */}
<section id="professional" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
  <SectionHeader icon="briefcase" title="Work Information" />

  {/* 🔁 Job Type + Years of Experience SIDE BY SIDE */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* ✅ Job Type */}
    <div>
      <label className="block font-medium text-gray-700 mb-1">Job Type <span className="text-red-500">*</span></label>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(serviceCategories).map((job) => (
          <label key={job} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={job}
              checked={selectedJobTypes.includes(job)}
              onChange={(e) => {
                const updated = [...selectedJobTypes];
                if (e.target.checked) {
                  updated.push(job);
                } else {
                  const index = updated.indexOf(job);
                  if (index > -1) updated.splice(index, 1);
                  const updatedCategories = { ...selectedCategories };
                  delete updatedCategories[job];
                  setSelectedCategories(updatedCategories);
                }
                setSelectedJobTypes(updated);
              }}
              className="accent-blue-600"
            />
            <span className="capitalize">{job}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ✅ Years of Experience aligned to the right */}
    <div>
      <label className="block font-medium text-gray-700 mb-1">Years of Experience <span className="text-red-500">*</span></label>
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

  {/* 🔁 Dynamic Service Category dropdowns */}
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {selectedJobTypes.map((job) => (
      <div key={job}>
        <label className="block font-medium text-gray-700 mb-1">
          Service Category for {job.charAt(0).toUpperCase() + job.slice(1)}
        </label>
        <select
          value={selectedCategories[job] || ""}
          onChange={(e) =>
            setSelectedCategories((prev) => ({
              ...prev,
              [job]: e.target.value,
            }))
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select your service...</option>
          {serviceCategories[job].map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>

  {/* ✅ Skills Textarea */}
  <div className="mt-6">
    <label className="block font-medium text-gray-700 mb-1">Skills & Certifications</label>
    <textarea 
      {...register("skills")} 
      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
      rows={4}
      placeholder="List your skills and any certifications (TESDA, etc.)"
    />
    <p className="text-sm text-gray-500 mt-1">Separate skills with commas (e.g., Electrical Wiring, Plumbing, Carpentry)</p>
  </div>
</section>

          {/* Documents Section */}
          <section id="documents" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="file-alt" title="Required Documents" />
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload 
  label="Primary ID (Front)" 
  name="primaryIDFront" 
  register={register} 
  errors={errors} 
  watch={watch} // 👈 ADD THIS!
  required 
  hint="UMID, Passport, Driver's License, etc."
/>


<FileUpload 
  label="Primary ID (Back)" 
  name="primaryIDBack" 
  register={register} 
  errors={errors}
  watch={watch}
    hint="UMID, Passport, Driver's License, etc."
/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload 
  label="Secondary ID" 
  name="secondaryID" 
  register={register} 
  errors={errors}
  watch={watch}
    hint="UMID, Passport, Driver's License, etc."
/>

<FileUpload 
  label="NBI/Police Clearance" 
  name="clearance" 
  register={register} 
  errors={errors}
  watch={watch}
  hint="Barangay Certificate, Utility Bill"
/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload 
                  label="Proof of Address" 
                  name="proofOfAddress" 
                  register={register} 
                  errors={errors} 
                  watch={watch}
                  hint="Barangay Certificate, Utility Bill"
                />

                <FileUpload 
                  label="Medical Certificate" 
                  name="medicalCertificate" 
                  register={register} 
                  errors={errors} 
                  watch={watch}
                  hint="Barangay Certificate, Utility Bill"
                />
              </div>

              <FileUpload 
                label="Certificates" 
                name="certificates" 
                register={register} 
                errors={errors} 
                watch={watch}
                hint="TESDA, Training Certificates, etc."
              />
            </div>
          </section>

          {/* Government Numbers Section */}
          <section id="government" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="landmark" title="Government Numbers" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="TIN Number" name="tinNumber" register={register} errors={errors} placeholder="123-456-789-000" />
              <FormField label="SSS Number" name="sssNumber" register={register} errors={errors} required placeholder="XX-XXXXXXX-X" />
              <FormField label="PhilHealth Number" name="philHealthNumber" register={register} errors={errors} required placeholder="XX-XXXXXXXXX-X" />
              <FormField label="Pag-IBIG Number" name="pagIbigNumber" register={register} errors={errors} required placeholder="XXXX-XXXX-XXXX" />
            </div>
          </section>

          {/* Agreements Section */}
          <section id="agreements" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <SectionHeader icon="file-signature" title="Agreements" />
            
            <div className="space-y-4">
              <CheckboxField 
                id="consentBackgroundCheck" 
                label="I consent to background checks and verify my documents." 
                description="JD HOMECARE may verify the authenticity of your submitted documents."
                register={register}
                errors={errors}
                required
              />

              <CheckboxField 
                id="agreeTerms" 
                label="I agree to JD HOMECARE's Terms of Service and Privacy Policy." 
                description={<><a href="#" className="text-blue-600 hover:underline">View Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></>}
                register={register}
                errors={errors}
                required
              />

              <CheckboxField 
                id="consentDataPrivacy" 
                label="I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173)." 
                description="Your data will be protected and processed in compliance with Philippine law."
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
              <span className="relative"><i className="fas fa-paper-plane mr-2"></i> Submit Application</span>
            </button>
            <p className="text-gray-500 mt-4 text-sm">By submitting this form, you confirm that all information provided is accurate and complete.</p>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <ToastContainer />
<Footer />
    </div>
  );
};

export default TaskerForm;
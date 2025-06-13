import { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import SidebarMenu from "../../components/sidemenu/SidebarMenu";

const ApplicantsResponse = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Replace with real API call
    setApplicants([
      {
        id: 1,
        name: "Juan Dela Cruz",
        gender: "Male",
        jobType: "Electrician",
        address: "Bacolod City, Negros Occidental",
        profileImage: "/electrician.jpg",
      },
      {
        id: 2,
        name: "Maria Clara",
        gender: "Female",
        jobType: "Carpenter",
        address: "Bago City, Negros Occidental",
        profileImage: "/carpenter.jpg",
      },
    ]);
  }, []);

  const jobTypes = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];
  const genders = ["All", "Male", "Female"];

  const filteredApplicants = applicants.filter((app) => {
    return (
      (selectedCategory === "All" || app.jobType === selectedCategory) &&
      (selectedGender === "All" || app.gender === selectedGender)
    );
  });

  return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[256px_1fr] gap-8">
        <div className="h-fit">
          <div className="sticky top-28">
            <SidebarMenu />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Applicants Response</h1>

          {/* Filter by Service Need */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Service Need:
            </label>
            <div className="flex flex-wrap gap-3">
              {jobTypes.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                    ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Gender (styled like status filter) */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Filter by Status:
            </label>
            <div className="flex flex-wrap gap-3">
              {genders.map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                    ${
                      selectedGender === gender
                        ? gender === "Male"
                          ? "bg-blue-600 text-white"
                          : gender === "Female"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                    }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Applicant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                <img src={app.profileImage} alt="Applicant" className="w-full h-40 object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-bold text-gray-800">{app.name}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Job:</strong> {app.jobType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Gender:</strong> {app.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {app.address}
                  </p>
                </div>
              </div>
            ))}
            {filteredApplicants.length === 0 && (
              <div className="text-gray-600">No applicants found for the selected filters.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplicantsResponse;

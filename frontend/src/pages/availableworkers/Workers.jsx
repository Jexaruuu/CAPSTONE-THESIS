import React, { useState } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const UserAvailableWorkers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["All", "Carpenter", "Electrician", "Plumber", "Carwasher", "Laundry"];

  const workers = [
    {
      name: "Juan Dela Cruz",
      category: "Carpenter",
      description: "Experienced in furniture building and home repairs.",
      image: "/workers/juan.jpg",
    },
    {
      name: "Maria Santos",
      category: "Electrician",
      description: "Licensed electrician with 5 years of experience.",
      image: "/workers/maria.jpg",
    },
    {
      name: "Pedro Reyes",
      category: "Plumber",
      description: "Expert in pipe installation and leakage repair.",
      image: "/workers/pedro.jpg",
    },
    {
      name: "Ana Lopez",
      category: "Laundry",
      description: "Professional laundry services for home and office.",
      image: "/workers/ana.jpg",
    },
    {
      name: "Rico Cruz",
      category: "Carwasher",
      description: "Quick and thorough car cleaning services.",
      image: "/workers/rico.jpg",
    },
  ];

  const filteredWorkers =
    selectedCategory === "All"
      ? workers
      : workers.filter((worker) => worker.category === selectedCategory);

  const openModal = (worker) => {
    setSelectedWorker(worker);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorker(null);
  };

  return (
    <div className="font-sans">
      <Navigation />

      <div className="relative h-64 flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: "url('/homerepair.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Available Workers</h1>
      </div>

      <div className="flex max-w-7xl mx-auto px-6 py-12 gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-md ${
                  selectedCategory === cat ? "bg-yellow-400 text-black font-bold" : "hover:bg-gray-100"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Workers Grid */}
        <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between text-center h-[420px]">
              <div>
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1">{worker.name}</h3>
                <p className="text-sm text-yellow-700 font-medium mb-1">{worker.category}</p>
                <p className="text-gray-600 text-sm">{worker.description}</p>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => openModal(worker)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  View Profile
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Hire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src={selectedWorker.image}
                alt={selectedWorker.name}
                className="mx-auto mb-4 h-32 w-32 object-cover rounded-full"
              />
              <h2 className="text-xl font-semibold mb-1">{selectedWorker.name}</h2>
              <p className="text-yellow-700 font-medium mb-1">{selectedWorker.category}</p>
              <p className="text-gray-600 text-sm mb-4">{selectedWorker.description}</p>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Hire Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserAvailableWorkers;

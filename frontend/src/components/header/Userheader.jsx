import React, { useState, useEffect } from "react";
import { FaHammer, FaBolt, FaWrench, FaCar, FaTshirt } from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = {
  Carpenter: ["General Carpentry", "Furniture Repair", "Wood Polishing", "Door & Window Fitting", "Custom Furniture Design", "Modular Kitchen Installation", "Flooring & Decking", "Cabinet & Wardrobe Fixing", "Wall Paneling & False Ceiling", "Wood Restoration & Refinishing"],
  Electrician: ["Wiring Repair", "Appliance Installation", "Lighting Fixtures", "Circuit Breaker & Fuse Repair", "CCTV & Security System Setup", "Fan & Exhaust Installation", "Inverter & Battery Setup", "Switchboard & Socket Repair", "Electrical Safety Inspection", "Smart Home Automation"],
  Plumber: ["Leak Fixing", "Pipe Installation", "Bathroom Fittings", "Drain Cleaning & Unclogging", "Water Tank Installation", "Gas Pipeline Installation", "Septic Tank & Sewer Repair", "Water Heater Installation", "Toilet & Sink Repair", "Kitchen Plumbing Solutions"],
  "Car Washer": ["Exterior Wash", "Interior Cleaning", "Wax & Polish", "Underbody Cleaning", "Engine Bay Cleaning", "Headlight Restoration", "Ceramic Coating", "Tire & Rim Cleaning", "Vacuum & Odor Removal", "Paint Protection Film Application"],
  Laundry: ["Dry Cleaning", "Ironing", "Wash & Fold", "Steam Pressing", "Stain Removal Treatment", "Curtains & Upholstery Cleaning", "Delicate Fabric Care", "Shoe & Leather Cleaning", "Express Same-Day Laundry", "Eco-Friendly Washing"]
};

const categoryImages = {
  Carpenter: "/carpenter2.jpg",
  Electrician: "/electrician2.jpg",
  Plumber: "/plumber2.jpg",
  "Car Washer": "/carwash1.jpg",
  Laundry: "/laundry1.jpg"
};

const heroImages = ["/carpenter1.jpg", "/electrician1.jpg", "/plumber1.jpg", "/carwash2.jpg", "/laundry2.jpg"];

const popularProjects = [
  { name: "Furniture Repair", image: "/grid1.jpg", rate: "₱300-₱500" },
  { name: "Wiring Repair", image: "/grid2.jpg", rate: "₱400-₱600" },
  { name: "Leak Fixing", image: "/grid3.jpg", rate: "₱350-₱550" },
  { name: "Exterior Wash", image: "/grid4.jpg", rate: "₱250-₱400" },
  { name: "Dry Cleaning", image: "/grid5.jpg", rate: "₱200-₱350" },
  { name: "Pipe Installation", image: "/grid6.jpg", rate: "₱450-₱700" },
  { name: "Wood Polishing", image: "/grid7.jpg", rate: "₱350-₱500" },
  { name: "Lighting Fixtures", image: "/grid8.jpg", rate: "₱300-₱450" }
];

const faqItems = [
  { question: "What services does JD HOMECARE offer?", answer: "We provide home maintenance and repair services like plumbing, electrical, cleaning, and general handyman tasks." },
  { question: "How quickly can I get a service appointment?", answer: "We aim to schedule appointments within 24–48 hours, depending on availability." },
  { question: "Are your workers qualified", answer: "Yes, all our workers are trained, experienced, and background-checked for your safety." },
  { question: "What areas do you service?", answer: "We currently serve Bacolod City. Contact us to confirm if we cover your location." },
  { question: "How are your service prices determined?", answer: "Prices are based on the job type, materials needed, and time required. We offer upfront quotes." },
  { question: "Do you offer warranties on your work?", answer: "Yes, most services come with a 10-day warranty for peace of mind." },
  { question: "What payment methods do you accept?", answer: "We credit/debit cards and mobile payments for convenience." },
  { question: "Can I schedule regular maintenance services?", answer: "Yes! We offer flexible plans for recurring services like cleaning or inspections." }
];

const Header = () => {
  const [selectedCategory, setSelectedCategory] = useState("Carpenter");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

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

  const icons = {
    Carpenter: FaHammer,
    Electrician: FaBolt,
    Plumber: FaWrench,
    "Car Washer": FaCar,
    Laundry: FaTshirt
  };

  const toggleFAQ = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className="w-full flex flex-col relative">
      <div className="relative h-96 bg-cover bg-center transition-opacity duration-1000 flex justify-center items-center" style={{ backgroundImage: `url(${heroImages[currentImageIndex]})`, opacity: fade ? 1 : 0 }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <section className="relative text-white w-full py-10 z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Welcome to JD Homecare</h1>
          <p className="text-xl mb-8 text-gray-200">Where quality service and heartfelt care come together to make your home a better place.</p>
        </section>
      </div>


      <div className="flex flex-col items-center space-y-6 py-10">
        <div className="flex flex-wrap justify-center gap-12 text-[20px]">
          {Object.keys(categories).map((cat) => {
            const Icon = icons[cat];
            const isActive = selectedCategory === cat;
            return (
              <div key={cat} className="text-center cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                <Icon className={`text-3xl mx-auto ${isActive ? "text-[#000081]" : "text-gray-500"}`} />
                <p className={`text-md font-semibold ${isActive ? "text-[#000081]" : "text-gray-700"}`}>{cat}</p>
              </div>
            );
          })}
        </div>
      </div>

  
      <div className="w-full flex justify-center py-6 bg-[#F3F4F6]">
        <div className="max-w-6xl w-full px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories[selectedCategory].map((sub) => (
              <span key={sub} className="text-[20px] cursor-pointer hover:underline">⦁ {sub}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center w-full py-12">
        <div className="p-6 rounded-lg flex flex-col md:flex-row items-center max-w-6xl w-full">
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <img src={categoryImages[selectedCategory]} alt={selectedCategory} className="rounded-lg w-[1080px] h-64 object-cover" />
          </div>
          <div className="w-full md:w-1/2 px-6 text-center md:text-left">
            <h3 className="text-lg font-bold text-center text-gray-800">{selectedCategory}</h3>
            <ul className="list-disc list-inside mt-3 text-gray-700 text-[20px] text-center">
              <li>Get help with {selectedCategory.toLowerCase()} services.</li>
              <li>Book now to experience our convenient services.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full py-10 bg-[#F3F4F6]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[20px] font-bold text-center text-gray-800 mb-8">Popular Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProjects.map((proj, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden h-96 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundImage: `url(${proj.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity cursor-pointer"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#efefef] bg-opacity-70 text-black flex flex-col items-center">
                  <h3 className="font-bold text-lg mb-2">{proj.name}</h3>
                  <p className="text-[14px] font-semibold">Service Rate / Hour: {proj.rate}</p>
                  <Link to="/bookservices">
  <button
    className="relative rounded px-5 py-2.5 overflow-hidden group bg-[#000081] text-white mt-2 
             hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
             hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 
             transition-all ease-out duration-300 cursor-pointer"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    <span
      className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform 
                 translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
    ></span>
    <span className="relative text-base font-semibold">
      Book A Schedule Now
    </span>
  </button>
</Link>


                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="faqs" className="w-full py-16 bg-[#F3F4F6]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-[20px] font-bold text-center text-gray-800 mb-12">JD HOMECARE FAQs</h2>
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6">
                <button className="flex justify-between items-center w-full text-left" onClick={() => toggleFAQ(idx)}>
                  <h3 className="text-[20px] font-semibold text-gray-800 hover:text-[#000081]">{item.question}</h3>
                  <span className="text-gray-500 text-xl ml-4">{activeIndex === idx ? '-' : '+'}</span>
                </button>
                {activeIndex === idx && <div className="mt-4 text-gray-600 text-[20px]">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

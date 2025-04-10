import React, { useState, useEffect } from "react";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

const services = [
  {
    title: "Carpenter",
    description: "Get carpentry services for your home and office.",
    services: ["General Carpentry",
    "Furniture Repair",
    "Wood Polishing",
    "Door & Window Fitting",
    "Custom Furniture Design",
    "Modular Kitchen Installation",
    "Flooring & Decking",
    "Cabinet & Wardrobe Fixing",
    "Wall Paneling & False Ceiling",
    "Wood Restoration & Refinishing"],
    image: "/carpenter3.jpg"
  },
  {
    title: "Electrician",
    description: "Hire an electrician for all electrical needs.",
    services: ["Wiring Repair",
    "Appliance Installation",
    "Lighting Fixtures",
    "Circuit Breaker & Fuse Repair",
    "CCTV & Security System Setup",
    "Fan & Exhaust Installation",
    "Inverter & Battery Setup",
    "Switchboard & Socket Repair",
    "Electrical Safety Inspection",
    "Smart Home Automation"],
    image: "electrician3.jpg"
  },
  {
    title: "Plumber",
    description: "Reliable plumbing services to fix leaks and installations.",
    services: ["Leak Fixing",
    "Pipe Installation",
    "Bathroom Fittings",
    "Drain Cleaning & Unclogging",
    "Water Tank Installation",
    "Gas Pipeline Installation",
    "Septic Tank & Sewer Repair",
    "Water Heater Installation",
    "Toilet & Sink Repair",
    "Kitchen Plumbing Solutions"],
    image: "plumber3.jpg"
  },
  {
    title: "Car Washer",
    description: "Car washing and detailing services.",
    services: ["Exterior Wash",
    "Interior Cleaning",
    "Wax & Polish",
    "Underbody Cleaning",
    "Engine Bay Cleaning",
    "Headlight Restoration",
    "Ceramic Coating",
    "Tire & Rim Cleaning",
    "Vacuum & Odor Removal",
    "Paint Protection Film Application"],
    image: "carwash3.jpg"
  },
  {
    title: "Laundry",
    description: "Efficient laundry and dry cleaning services.",
    services: ["Dry Cleaning",
    "Ironing",
    "Wash & Fold",
    "Steam Pressing",
    "Stain Removal Treatment",
    "Curtains & Upholstery Cleaning",
    "Delicate Fabric Care",
    "Shoe & Leather Cleaning",
    "Express Same-Day Laundry",
    "Eco-Friendly Washing"],
    image: "laundry3.jpg"
  }
];

const heroImages = [
    "/carpenter1.jpg",
    "/electrician1.jpg",
    "/plumber1.jpg",
    "/carwash2.jpg",
    "/laundry2.jpg"
  ];

const BookService = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 font-sans">
      <Navigation />
      <div 
        className="relative w-full h-96 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 flex flex-col justify-center items-center" 
        style={{ backgroundImage: `url(${heroImages[currentImageIndex]})`, backgroundSize: "cover", opacity: fade ? 1 : 0 }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
      
        <section className="relative text-center flex flex-col justify-center items-center text-white w-full h-auto py-10 z-10">
          <div className="bg-opacity-50 px-6 py-4 rounded">
            <h2 className="text-4xl font-bold">Book trusted home help today</h2>
          </div>
        </section>
      </div>

      <div className="py-10 px-5">
  <h2 className="text-center text-[30px] font-bold mb-6">Hire Trusted Workers</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-5xl mx-auto">
    {services.map((service, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-5 flex flex-col">
        <img src={service.image} alt={service.title} className="rounded-md mb-4 w-full h-40 object-cover" />
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-3">{service.description}</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          {service.services.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <div className="mt-auto">
        <button
  class="relative rounded px-4 py-2 overflow-hidden group  bg-[#000081] 
             hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
             text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300 w-full">
  <span
    class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
  <span class="relative text-base font-semibold">Hire Now</span>
</button>
        </div>
      </div>
    ))}
  </div>
</div>

      <Footer />
    </div>
  );
};

export default BookService;
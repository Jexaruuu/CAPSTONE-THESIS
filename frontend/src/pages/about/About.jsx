import React from "react";
import Navigation from "../../components/navigation/Navigation";
import Footer from "../../components/footer/Footer";

const About = () => {
  return (
    <div className="font-sans">
        <Navigation></Navigation>
 
      <div
        className="relative h-96 flex items-center justify-center text-white text-center px-4"
        style={{
          backgroundImage: "url('/homerepair.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
         Quality Home Services You Can Trust
        </h1>
      </div>
      
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-12 px-6">
        {infoCards.map((card, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img src={card.icon} alt={card.title} className="mx-auto mb-4 h-20" />
            <h3 className="text-[20px] font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600 text-[16px]">{card.description}</p>
          </div>
        ))}
      </div>
      <Footer></Footer>
    </div>
  );
};

const infoCards = [
  {
    icon: "/customerservice.png",
    title: "Our Services",
    description: "Providing maintenance and home care services tailored to your needs."
  },
  {
    icon: "/professionals.png",
    title: "Our Workers",
    description: "skilled and vetted workers ensuring reliable service every time."
  },
  {
    icon: "/satisfaction.png",
    title: "Customer Satisfaction",
    description: "Our priority is to exceed your expectations with every service we provide."
  },
  {
    icon: "/trust.png",
    title: "Trust & Safety",
    description: "We prioritize safety and trust, ensuring background checks and secure transactions."
  },
];

export default About;

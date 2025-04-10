import React from "react";
import Navigation from "../../components/navigation/navigation";
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer";


const Home = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <Navigation />
      <Header />
      <Footer />
    </div>
  );
};

export default Home;

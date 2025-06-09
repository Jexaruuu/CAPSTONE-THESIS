import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Userheader";

const UserHome = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  return (
    <div className="bg-gray-100 font-sans">
      <Navigation />
      <Header/>
      <Footer />
    </div>
  );
};

export default UserHome;

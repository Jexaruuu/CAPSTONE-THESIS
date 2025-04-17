import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home/Home";
import UserHome from "./pages/userhome/Userhome";
import Login from '/src/pages/login/Login.jsx';
import Signup from "./pages/signup/Signup";
import ForgotPassword from "./pages/forgotpassword/Forgotpassword";
import Services from "./pages/services/Services";
import TaskerForm from "./pages/taskerform/Taskerform";
import ProtectedRoute from "./components/protectedroutes/ProtectedRoutes";
import About from "./pages/about/About";
import UserAbout from "./pages/about/Userabout";
import AdminLogin from "./pages/admin/Adminlogin";
import AdminSignup from "./pages/admin/Adminsignup";
import EditProfile from "./pages/editprofile/Editprofile";
import BookServices from "./pages/services/Bookservices";
import UserHeader from "./components/header/Userheader";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookservices" element={<ProtectedRoute element={<BookServices />} />} />
        <Route path="/taskerform" element={<ProtectedRoute element={<TaskerForm />} />} />
        <Route path="/about" element={<About />} />
        <Route path="/userabout" element={<ProtectedRoute element={<UserAbout/>} />} />
        <Route path="/adminlogin" element={<AdminLogin/>} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path='/editprofile' element={<ProtectedRoute element={<EditProfile />} />} />
        <Route path="/userhome" element={<ProtectedRoute element={<UserHome />} />} />
        <Route path="/userheader" element={<ProtectedRoute element={<UserHeader />} />} />
      </Routes>
    </Router>
  );
}

export default App;

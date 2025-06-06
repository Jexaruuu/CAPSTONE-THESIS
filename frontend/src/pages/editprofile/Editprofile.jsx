import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";
import SidebarMenu from "../../components/sidemenu/SidebarMenu";

const EditProfile = () => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/user/${userId}`, {
                    withCredentials: true
                });

                const userData = response.data;
                setFirstName(userData.first_name || "");
                setLastName(userData.last_name || "");
                setMobile(userData.mobile || "");
                setEmail(userData.email || "");
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    localStorage.removeItem("userId");
                    localStorage.removeItem("user");
                    navigate("/login");
                } else {
                    setError("Failed to fetch user data");
                }
            }
        };

        if (userId) {
            fetchUser();
        } else {
            setError("User not logged in");
        }
    }, [navigate, userId]);

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete your account? This cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3000/api/user/${userId}`, {
                withCredentials: true,
            });

            alert("Account deleted successfully!");
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            navigate("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            setError(error.response?.data?.message || "Error deleting account. Please try again.");
        }
    };

    const handleDeleteAccountWithScroll = async () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        await handleDeleteAccount();
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!email.endsWith("@gmail.com")) {
            return setError("Only Gmail addresses are allowed.");
        }

        if (!/^[0-9]{11}$/.test(mobile)) {
            return setError("Mobile number must be exactly 11 digits.");
        }

        if (password && password !== confirmPassword) {
            return setError("Passwords do not match!");
        }

        const userData = {
            first_name,
            last_name,
            mobile,
            email,
            password: password || undefined,
        };

        setLoading(true);
        setError("");

        try {
            await axios.put(`http://localhost:3000/api/user/${userId}`, userData);

            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                currentUser.email = email;
                currentUser.first_name = first_name;
                currentUser.last_name = last_name;
                localStorage.setItem("user", JSON.stringify(currentUser));
            }

            if (password) {
                alert("Your password has been updated. Please log out and log in again.");
                localStorage.removeItem("userId");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                alert("Profile updated successfully!");
                navigate("/editprofile");
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error during profile update");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        const userData = {
            first_name,
            last_name,
            mobile,
            email,
        };

        setLoading(true);
        setError("");

        try {
            await axios.put(`http://localhost:3000/api/user/update/${userId}`, userData);
            const currentUser = JSON.parse(localStorage.getItem("user"));
            currentUser.email = email;
            currentUser.first_name = first_name;
            currentUser.last_name = last_name;
            localStorage.setItem("user", JSON.stringify(currentUser));
            alert("Profile updated successfully!");
            navigate(0);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error during profile update");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword) return setError("Current password is required");
        if (!password || password !== confirmPassword) return setError("Passwords don't match");

        try {
            const response = await axios.put(
                `http://localhost:3000/api/user/update-password/${userId}`,
                { currentPassword, newPassword: password },
                { withCredentials: true }
            );

            alert(response.data.message);
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error updating password. Please check your current password.");
        }
    };

    return (
    <div className="bg-[#F3F4F6] min-h-screen font-sans">
  <Navigation />
  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[256px_1fr] gap-8">
    {/* ✅ Sidebar container with sticky */}
    <div className="h-fit">
      <div className="sticky top-28">
        <SidebarMenu />
      </div>
    </div>

 <div className="flex flex-col">
  {/* Page Header */}
<form className="form" onSubmit={handleUpdateInfo}>
  <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 mb-5">

    {/* 🔵 Heading now inside card for alignment */}
    <div className="text-center mb-15">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Update Your Profile</h2>
      <p className="text-gray-600 text-sm">
        Edit your personal information below. Fields marked with <span className="text-red-500 font-bold">*</span> are required.
      </p>
      <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
    </div>

    {/* 🔴 Error inside form */}
    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 shadow">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )}

    {/* 🧾 Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
        <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required className="w-full border border-gray-300 p-3 rounded-lg" />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
        <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required className="w-full border border-gray-300 p-3 rounded-lg" />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">+63</div>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="9123456789" className="pl-12 w-full border border-gray-300 p-3 rounded-lg" />
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your.email@gmail.com" className="w-full border border-gray-300 p-3 rounded-lg" />
      </div>
    </div>

    {/* 🔘 Actions */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 shadow-md">
      <button type="submit" className="bg-[#000081] hover:bg-[#0d05d2] text-white px-6 py-3 rounded-lg transition duration-200 w-full md:w-auto">
        Update Profile
      </button>
      <button type="button" onClick={handleDeleteAccountWithScroll} className="text-red-600 hover:text-red-700 font-medium transition duration-200">
        Delete Account
      </button>
    </div>
  </section>
</form>

  {/* Password Section */}
  <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
    <div className="flex items-center mb-6">
      <div className="bg-blue-100 p-3 rounded-full mr-4">
        <i className="fas fa-lock text-blue-600 text-xl"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-800">Update Password</h3>
    </div>

    <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 gap-6">
      <div>
        <label className="block font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Confirm New Password <span className="text-red-500">*</span></label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div className="pt-4">
        <button type="submit" className="bg-[#000081] hover:bg-[#0d05d2] text-white px-6 py-3 rounded-lg transition duration-200">
          Update Password
        </button>
      </div>
    </form>
  </section>
</div>
</div>
            <Footer />
        </div>
    );
};

export default EditProfile;
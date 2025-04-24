import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../../components/navigation/Usernavigation";
import Footer from "../../components/footer/Footer";

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

    // Assuming userId is stored in localStorage after user logs in
    const userId = localStorage.getItem("userId");  // Make sure the userId is available here

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
                const userData = response.data;
                setFirstName(userData.first_name || "");
                setLastName(userData.last_name || "");
                setMobile(userData.mobile || "");
                setEmail(userData.email || "");
            } catch (err) {
                console.error(err);
                setError("Failed to fetch user data");
            }
        };

        if (userId) {
            fetchUser();
        } else {
            setError("User not logged in");
        }
    }, [userId]);

    // Handle account deletion
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            // Send DELETE request with credentials (cookies/session)
            await axios.delete(`http://localhost:3000/api/user/${userId}`, {
                withCredentials: true, // Ensure credentials are sent with the request
            });

            alert("Account deleted successfully!");

            localStorage.removeItem("userId");
            localStorage.removeItem("user");
            navigate("/");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error deleting account");
        }
    };

    const handleDeleteAccountWithScroll = async () => {
        // Smooth scroll to the top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Call the original handleDeleteAccount function
        await handleDeleteAccount();
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!email.endsWith("@gmail.com")) {
            return setError("Only Gmail addresses are allowed.");
        }

        const mobilePattern = /^[0-9]{11}$/;
        if (!mobilePattern.test(mobile)) {
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
            password: password || undefined, // Only send password if it's being changed
        };

        setLoading(true);
        setError("");

        try {
            const response = await axios.put(`http://localhost:3000/api/user/${userId}`, userData);

            // Update local storage if email or name changed
            const currentUser = JSON.parse(localStorage.getItem("user"));
            if (currentUser) {
                currentUser.email = email;
                currentUser.first_name = first_name;
                currentUser.last_name = last_name;
                localStorage.setItem("user", JSON.stringify(currentUser));
            }

            // Check if the password was updated
            if (password) {
                alert("Your password has been updated. Please log out and log in again.");
                // Optionally log the user out by removing session data
                localStorage.removeItem("userId");
                localStorage.removeItem("user");

                // Redirect to the login page
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

        // if (!email.endsWith("@gmail.com")) {
        //     return setError("Only Gmail addresses are allowed.");
        // }

        // const mobilePattern = /^[0-9]{11}$/;
        // if (!mobilePattern.test(mobile)) {
        //     return setError("Mobile number must be exactly 11 digits.");
        // }

        const userData = {
            first_name,
            last_name,
            mobile,
            email,
        };

        setLoading(true);
        setError("");

        try {
            const response = await axios.put(`http://localhost:3000/api/user/update/${userId}`, userData);

            // Update local storage if email or name changed
            const currentUser = JSON.parse(localStorage.getItem("user"));
            // if (currentUser) {
                currentUser.email = email;
                currentUser.first_name = first_name;
                currentUser.last_name = last_name;
                localStorage.setItem("user", JSON.stringify(currentUser));
    
                alert("Profile updated successfully!");
                navigate(0);
            // }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Error during profile update");
        } 
    };

    // Add this function with your other handlers
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (!currentPassword) {
            return setError("Current password is required");
        }
        
        if (!password || password !== confirmPassword) {
            return setError("Passwords don't match or are empty");
        }
    
        try {
            const response = await axios.put(
                `http://localhost:3000/api/user/update-password/${userId}`,
                {
                    currentPassword: currentPassword,
                    newPassword: password
                },
                {
                    withCredentials: true
                }
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
        <div className="bg-[#F3F4F6] font-sans min-h-screen">
            <Navigation />

            {/* Form Header */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Update Your Profile
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Edit your personal information below. Fields marked with * are required.
                    </p>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* <form onSubmit={handleUpdateProfile} className="space-y-8"> */}
                {/* Personal Information Section */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-exclamation-circle text-red-500"></i>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <form className="form" onSubmit={handleUpdateInfo}>
                    <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-100 p-2 rounded-full mr-4">
                                <i className="fas fa-user text-blue-600 text-lg w-6 h-6 text-center"></i>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Personal Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <span className="text-gray-500">+63</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="pl-12 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required
                                        placeholder="9123456789"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your.email@gmail.com"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full gap-4 mt-4">
  <button
    type="submit"
    className="relative w-full max-w-[200px] rounded px-5 py-2.5 overflow-hidden group bg-[#000081] 
               hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
               text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 
               transition-all ease-out duration-300 cursor-pointer"
  >
    <span
      className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform 
                 translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
    ></span>
    <span className="relative text-base font-semibold">Update Profile</span>
  </button>

  <button
    onClick={handleDeleteAccountWithScroll}
    className="text-red-600 hover:text-red-700 font-semibold"
  >
    Delete Account
  </button>
</div>
                    </section>
                </form>

                <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-6">
    <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-4">
            <i className="fas fa-lock text-blue-600 text-lg w-6 h-6 text-center"></i>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">Password Update</h3>
    </div>

    <form onSubmit={handleUpdatePassword}>
        <div className="grid grid-cols-1 gap-6">
            <div>
                <label className="block font-medium text-gray-700 mb-1">Current Password*</label>
                <input
                    type="password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                />
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1">New Password*</label>
                <input
                    type="password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength="6"
                />
            </div>
            <div>
                <label className="block font-medium text-gray-700 mb-1">Confirm New Password*</label>
                <input
                    type="password"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength="6"
                />
            </div>
        </div>

        {/* Update Password Button */}
        <div className="mt-8">
            <button
                type="submit"
                className="relative w-full max-w-[200px] rounded px-5 py-2.5 overflow-hidden group bg-[#000081] 
                         hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
                         text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 
                         transition-all ease-out duration-300 cursor-pointer"
            >
                <span
                    className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform 
                               translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
                ></span>
                <span className="relative text-base font-semibold">Update Password</span>
            </button>
        </div>
    </form>
</section>

                

{/* Form Submission */}
<div className="relative pt-8">
  {/* Updated Back Button with the same style as the "Book Service" button */}
  <div className="text-center pt-8">
    <Link to="/userhome"
      type="submit"
      className="relative overflow-hidden group bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-blue-400"
    >
      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
      <span className="relative">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </span>
    </Link>
    <p className="text-gray-500 mt-4 text-sm">Go back to previous page.</p>
  </div>
</div>






            </div>

            <Footer />
        </div>
    );
};

export default EditProfile;

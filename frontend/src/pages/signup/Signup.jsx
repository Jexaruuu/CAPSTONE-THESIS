import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

const Signup = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(""); 
    const [passwordStrength, setPasswordStrength] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate(); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

  
    const evaluatePasswordStrength = (password) => {
        if (!password) return "";
        if (password.length < 6) return "Weak";
        if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) return "Weak";
        if (password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)) return "Normal";
        if (password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) return "Strong";
        return "Weak";
    };


    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
            isValid = false;
        }

        if (!formData.mobile.trim()) {
            errors.mobile = "Mobile number is required";
            isValid = false;
        } else if (!/^[0-9]{11}$/.test(formData.mobile)) {
            errors.mobile = "Mobile must be 11 digits";
            isValid = false;
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!formData.email.endsWith("@gmail.com")) {
            errors.email = "Only Gmail addresses allowed";
            isValid = false;
        }

        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords don't match";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    useEffect(() => {
        setPasswordStrength(evaluatePasswordStrength(formData.password));
    }, [formData.password]);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true); 
        setError(""); 

        try {
            const response = await axios.post('http://localhost:3000/api/signup', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            });

            console.log(response.data);  
            alert('Signup successful!');
            navigate('/login'); 
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Error during signup'
            ); 
        } finally {
            setLoading(false); 
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case "Weak": return "text-red-500";
            case "Normal": return "text-yellow-500";
            case "Strong": return "text-green-600";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="flex flex-col md:flex-row-reverse h-screen bg-gray-100 overflow-hidden">
            <div className="hidden md:block md:w-1/2 bg-[url('/carwash.jpg')] bg-cover bg-center"></div>
            
            <div className="flex justify-center items-center w-full md:w-1/2 bg-white shadow-lg p-6 md:p-8">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="w-40 h-40 md:w-45 md:h-45 -mt-10" />
                    <h2 className="text-gray-900 text-2xl md:text-3xl font-semibold mb-2 font-[Poppins]">Sign Up</h2>
                    <p className="text-gray-500 text-sm md:text-md text-center mb-6 md:mb-10">
                        Create an account and start your journey with us.
                    </p>
                    
                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form className="w-full" onSubmit={handleSignup}>
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">First Name *</label>
                            <input 
                                type="text" 
                                name="firstName"
                                className={`w-full p-2 rounded-md border ${
                                    formErrors.firstName ? "border-red-500" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 mt-1`}
                                placeholder="Enter your first name" 
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {formErrors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">Last Name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                className={`w-full p-2 rounded-md border ${
                                    formErrors.lastName ? "border-red-500" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 mt-1`}
                                placeholder="Enter your last name" 
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {formErrors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">Mobile Number *</label>
                            <div className="flex items-center">
                                <span className="mr-2">+63</span>
                                <input 
                                    type="tel" 
                                    name="mobile"
                                    className={`w-full p-2 rounded-md border ${
                                        formErrors.mobile ? "border-red-500" : "border-gray-300"
                                    } focus:ring-2 focus:ring-blue-500 mt-1`}
                                    placeholder="9123456789" 
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    maxLength="11"
                                />
                            </div>
                            {formErrors.mobile && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">Email Address *</label>
                            <input 
                                type="email" 
                                name="email"
                                className={`w-full p-2 rounded-md border ${
                                    formErrors.email ? "border-red-500" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 mt-1`}
                                placeholder="your.email@gmail.com" 
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                            )}
                        </div>
                    
                        <div className="mb-3">
                            <label className="text-gray-700 text-sm">Password *</label>
                            <input 
                                type="password" 
                                name="password"
                                className={`w-full p-2 rounded-md border ${
                                    formErrors.password ? "border-red-500" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 mt-1`}
                                placeholder="Enter your password" 
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {formData.password && (
                                <div className="flex items-center mt-1">
                                    <p className={`text-xs ${getStrengthColor()}`}>
                                        Password Strength: {passwordStrength}
                                    </p>
                                    {formErrors.password && (
                                        <p className="text-red-500 text-xs ml-2">{formErrors.password}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm">Confirm Password *</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                className={`w-full p-2 rounded-md border ${
                                    formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                                } focus:ring-2 focus:ring-blue-500 mt-1`}
                                placeholder="Confirm your password" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {formErrors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                            )}
                        </div>
                    
                        <button 
                            type="submit" 
                            className={`relative w-full rounded px-5 py-2.5 overflow-hidden group font-semibold text-white transition-all ease-out duration-300 ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#000081] hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400'
                            }`}
                            disabled={loading}
                        >
                            {!loading && (
                                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                            )}
                            <span className="relative text-base font-semibold">
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </span>
                        </button>
                    </form>
                    
                    <div className="flex justify-center mt-4 text-gray-600 text-sm w-full">
                        <Link 
                            to="/login" 
                            className="hover:underline cursor-pointer"
                        >
                            Already have an account? Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
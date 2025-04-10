import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleReset = (e) => {
        e.preventDefault();
        console.log("Reset link sent to:", email);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <div className="flex justify-center items-center w-full md:w-1/2 bg-white shadow-lg p-6 md:p-8">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="w-40 h-40 md:w-80 md:h-80" />
                    <h2 className="text-gray-900 text-2xl md:text-3xl font-semibold mb-2 font-[Poppins]">Forgot Password</h2>
                    <p className="text-gray-500 text-sm md:text-md text-center mb-6 md:mb-10">Enter your email address to reset your password.</p>
                    
                    <form className="w-full" onSubmit={handleReset}>
                        <label className="text-gray-700 text-sm">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 mt-1 mb-4" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        
                        <button
  type="submit"
  className="relative w-full rounded px-5 py-2.5 overflow-hidden group bg-[#000081] 
             hover:bg-gradient-to-r hover:from-[#000081] hover:to-[#0d05d2] 
             text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300 cursor-pointer"
>
  <span
    className="absolute right-0 w-14 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"
  ></span>
  <span className="relative text-base font-semibold">Set Password</span>
</button>


                    </form>
                    
                    <div className="flex flex-col sm:flex-row justify-between mt-4 text-gray-600 text-sm w-full">
                        <Link to="/login" className="hover:underline sm:ml-auto mt-2 sm:mt-0 cursor-pointer">Back to Login</Link>
                    </div>
                </div>
            </div>
            
            <div className="hidden md:block md:w-1/2 bg-[url('/plumber.jpg')] bg-cover bg-center"></div>
        </div>
    );
};

export default ForgotPassword;
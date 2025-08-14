import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InteractiveArt from "./InteractiveArt"; // Make sure this component is in the same folder
import { FiEye, FiEyeOff } from "react-icons/fi";

// ==================================================================
// --- API & ICONS ---
// ==================================================================
const BASE_URL = import.meta.env.MODE === "development" ? "/api" : "https://triptoindia-18.onrender.com/api";

// Helper SVG Icons
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const EmailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const CheckIcon = () => ( <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> );


const Signup = ({ theme }) => {
  // ==================================================================
  // --- YOUR LOGIC + UI STATES ---
  // ==================================================================
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", email: "", phone: "", password: "", role: "customer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError(null); // Clear error on change
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be 6+ chars with uppercase, lowercase, number, and special character.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, formData);
      setLoading(false);

      setIsSuccess(true);
      // alert(res.data.message); // Optional: You can still use an alert if you wish

      setTimeout(() => {
        navigate("/login");
      }, 1500); // Navigate after success animation

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.log(err);
    }
  };

  const isDark = theme === "dark";

  return (
   <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      {/* =============================================================== */}
      {/* --- LEFT SIDE: THE SIGNUP FORM --- */}
      {/* =============================================================== */}
      <div className="w-1/2 flex justify-center items-center p-8 transition-colors duration-500 ">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold ">Create an Account</h1>
            <p className="mt-2 ">Join us and start your journey today.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4">
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                    <input type="text" id="firstname" required placeholder="First Name" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`} />
                </div>
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                    <input type="text" id="lastname" required placeholder="Last Name" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`} />
                </div>
            </div>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><EmailIcon /></span>
                <input type="email" id="email" required placeholder="Email Address" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`} />
            </div>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><PhoneIcon /></span>
                <input type="text" id="phone" required placeholder="Phone Number" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`} />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Password"
                onChange={handleChange}
                className={`w-full py-3 pl-10 pr-12 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>

            <button disabled={loading || isSuccess} className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white transition-all duration-300 disabled:opacity-80 h-[52px] ${isSuccess ? 'bg-green-500' : (isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700')} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}>
              {loading ? <Spinner /> : isSuccess ? <CheckIcon /> : "Sign Up"}
            </button>
            
            {error && !isSuccess && ( <p className="text-center text-sm font-medium text-red-500 animate-pulse pt-2">{error}</p> )}
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className={`font-medium transition-colors duration-300 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'}`}>Log in</Link>
          </p>
        </div>
      </div>

      {/* =============================================================== */}
      {/* --- RIGHT SIDE: INTERACTIVE ART --- */}
      {/* =============================================================== */}
      <div className="flex w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default Signup;
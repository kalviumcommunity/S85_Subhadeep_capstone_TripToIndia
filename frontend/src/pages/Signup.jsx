import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice.js";
import axios from "axios";
import InteractiveArt from "./InteractiveArt"; // Make sure this component is in the same folder
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = import.meta.env.MODE === "development" ? "/api" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api";

// Helper SVG Icons
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const EmailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );


const Signup = ({ theme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", email: "", phone: "", password: "", role: "customer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Ensure clean state on component mount (fixes mobile issues)
  useEffect(() => {
    setLoading(false);
    setError(null);
  }, []);

  const handleChange = (e) => {
    setError(null); // Clear error on change
    setFormData({ ...formData, [e.target.id]: e.target.value });

    // Check email availability when email field changes
    if (e.target.id === 'email' && e.target.value) {
      checkEmailAvailability(e.target.value);
    }
  };

  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;

    setEmailChecking(true);
    try {
      const res = await axios.post(`${BASE_URL}/check-email`, { email });
      setEmailExists(res.data.exists);
    } catch (err) {
      console.error('Email check error:', err);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || !formData.password) {
      setError("All fields are required!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError("Please enter a valid phone number (10-15 digits)!");
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be 6+ chars with uppercase, lowercase, number, and special character.");
      return;
    }

    // Check if email already exists
    if (emailExists) {
      setError("This email is already registered. Please use a different email or login instead.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/register`, formData);

      if (res.data.success) {
        setLoading(false);

        // Check if this is OTP-based registration or direct registration
        if (res.data.requiresOTP || res.data.userId) {
          // OTP-based registration - navigate to verification
          navigate('/otp-verification', {
            state: {
              email: formData.email,
              purpose: 'signup',
              from: '/'
            }
          });
        } else if (res.data.token && res.data.user) {
          // Direct registration - user is already logged in
          localStorage.setItem("token", res.data.token);
          dispatch(loginSuccess(res.data.user));
          alert(`Welcome to TripToIndia, ${res.data.user.firstname}! Your account has been created successfully.`);
          navigate('/');
        } else {
          // Fallback - show success message and redirect to login
          alert("Registration successful! Please login to continue.");
          navigate('/login');
        }
      } else {
        setLoading(false);
        setError(res.data.message || "Registration failed. Please try again.");
      }

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Signup error:", err);
    }
  };

  // Google Signup Handler
  const handleGoogleSignup = () => {
    const BASE_URL = import.meta.env.DEV ? "http://localhost:3000" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com";

    console.log('🔧 Environment check:', {
      DEV: import.meta.env.DEV,
      MODE: import.meta.env.MODE,
      BASE_URL: BASE_URL
    });

    // Only block in actual production deployment, not local development
    if (import.meta.env.MODE === 'production' && !window.location.hostname.includes('localhost')) {
      alert("🚀 Google Signup is being configured for production. Please use email/password signup for now.");
      return;
    }

    window.location.href = `${BASE_URL}/api/v1/auth/google`;
  };

  // Facebook Signup Handler
  const handleFacebookSignup = () => {
    alert("🚀 Facebook Signup feature will be added soon! \n\nWe're working on integrating Facebook authentication. For now, please use Google Signup or the regular signup form above.");
  };

  const isDark = theme === "dark";

  return (
   <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      {/* =============================================================== */}
      {/* --- LEFT SIDE: THE SIGNUP FORM --- */}
      {/* =============================================================== */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500 ">
        <div className="w-full max-w-md space-y-4 lg:space-y-6 animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">Create an Account</h1>
            <p className="mt-2 text-sm lg:text-base ">Join us and start your journey today.</p>
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
                <input type="email" id="email" required placeholder="Email Address" onChange={handleChange} className={`w-full py-3 pl-10 pr-12 rounded-lg border transition-colors duration-300 ${
                  emailExists
                    ? 'border-red-500 focus:ring-red-500'
                    : isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`} />
                {emailChecking && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                {!emailChecking && emailExists && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                {!emailChecking && formData.email && !emailExists && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
            </div>
            {emailExists && (
              <p className="text-sm text-red-500 mt-1">
                This email is already registered. <a href="/login" className="underline hover:text-red-400">Login instead?</a>
              </p>
            )}
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

            <button disabled={loading || emailExists || emailChecking} className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white transition-all duration-300 disabled:opacity-80 h-[52px] ${
              emailExists
                ? 'bg-gray-500 cursor-not-allowed'
                : (isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700')
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}>
              {loading ? <Spinner /> : emailExists ? "Email Already Exists" : "Sign Up"}
            </button>

            {error && !isSuccess && ( <p className="text-center text-sm font-medium text-red-500 animate-pulse pt-2">{error}</p> )}
          </form>

          {/* Social Signup Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDark ? 'bg-[#222] text-gray-400' : 'bg-[#ced8ff] text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              {/* Facebook Signup */}
              <button
                type="button"
                onClick={handleFacebookSignup}
                className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className={`font-medium transition-colors duration-300 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'}`}>Log in</Link>
          </p>
        </div>
      </div>

      {/* =============================================================== */}
      {/* --- RIGHT SIDE: INTERACTIVE ART --- */}
      {/* =============================================================== */}
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default Signup;
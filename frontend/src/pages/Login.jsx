import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";
import InteractiveArt from "./InteractiveArt";
import { FiEye, FiEyeOff } from "react-icons/fi";

const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const CheckIcon = () => ( <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> );

const Login = ({ theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const abortControllerRef = useRef(null);


  const handleChange = (e) => {
    if (error) {
      dispatch(loginFailure(null));
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Abort any previous request if user clicks submit again
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      dispatch(loginStart());
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api";

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal, // Use the abort signal
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Server responded with ${res.status}`);
      }

      if (data.success && data.requiresOTP) {
        // Navigate to OTP verification page for manual login
        navigate('/otp-verification', {
          state: {
            email: formData.email,
            purpose: 'login',
            from: '/'
          }
        });
      } else if (data.user) {
        // Direct login success (for social auth or if OTP is disabled)
        localStorage.setItem("token", data.token);
        dispatch(loginSuccess(data.user));
        setIsSuccess(true);

        // Navigate after the success animation completes
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Invalid server response");
      }

    } catch (err) {
      // Only dispatch a failure if the error wasn't from our own AbortController.
      if (err.name !== 'AbortError') {
        dispatch(loginFailure(err.message || "Login failed. Please try again."));
      }
    }
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    const BASE_URL = import.meta.env.DEV ? "http://localhost:3000" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com";

    // Check if we're in production and OAuth might not be configured
    if (!import.meta.env.DEV) {
      alert("🚀 Google Login is being configured for production. Please use email/password login for now.");
      return;
    }

    window.location.href = `${BASE_URL}/api/v1/auth/google`;
  };

  // Facebook Login Handler
  const handleFacebookLogin = () => {
    alert("🚀 Facebook Login feature will be added soon! \n\nWe're working on integrating Facebook authentication. For now, please use Google Login or the regular login form above.");
  };

  const isDark = theme === "dark";

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome Back!</h1>
            <p className="mt-2 text-sm lg:text-base">Sign in to continue your journey.</p>
          </div>
          <form className="mt-6 lg:mt-8 space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
              <input type="email" id="email" required placeholder="Email" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${isDark ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"} focus:outline-none focus:ring-2`} />
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
              {loading ? <Spinner /> : isSuccess ? <CheckIcon /> : "Login"}
            </button>
            {error && !isSuccess && ( <p className="text-center text-sm font-medium text-red-500 animate-pulse pt-2">{error}</p> )}
          </form>

          {/* Social Login Section */}
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
              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
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

              {/* Facebook Login */}
              <button
                type="button"
                onClick={handleFacebookLogin}
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

          <div className="text-center mt-6">
            <Link
              to="/forgot-password"
              className={`text-sm font-medium transition-colors duration-300 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Forgot your password?
            </Link>
          </div>

          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className={`font-medium transition-colors duration-300 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'}`}>Sign up</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default Login;
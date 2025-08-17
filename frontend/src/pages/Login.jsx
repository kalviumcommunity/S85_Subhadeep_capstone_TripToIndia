import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure, clearLoading } from "../redux/user/userSlice.js";
import InteractiveArt from "./InteractiveArt";
import { FiEye, FiEyeOff } from "react-icons/fi";

// --- Icon Components (unchanged) ---
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const Spinner = () => ( <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const CheckIcon = () => ( <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> );

// --- Define API Base URL in one place ---
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000" // Use full URL in dev for clarity
  : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com";

const Login = ({ theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user); // Simplified: only use Redux state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear loading state when component mounts to prevent it from getting stuck
  useEffect(() => {
    dispatch(clearLoading());
    return () => {
      dispatch(clearLoading());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    // Clear previous errors when the user starts typing again
    if (error) {
      dispatch(loginFailure(null));
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Server responded with ${res.status}`);
      }

      if (data.success && data.requiresOTP) {
        dispatch(clearLoading());
        navigate('/otp-verification', { state: { email: formData.email, purpose: 'login' } });
      } else if (data.user) {
        localStorage.setItem("token", data.token);
        dispatch(loginSuccess(data.user));
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      // Dispatch the failure action. This action should handle setting loading to false.
      dispatch(loginFailure(err.message || "Login failed. Please try again."));
      setIsSuccess(false); // Ensure success state is reset
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
  };

  const isDark = theme === "dark";

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="mt-2">Sign in to continue your journey.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Input fields remain the same */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
              <input type="email" id="email" required placeholder="Email" onChange={handleChange} className={`w-full py-3 pl-10 pr-4 rounded-lg ...`} />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
              <input type={showPassword ? "text" : "password"} id="password" required placeholder="Password" onChange={handleChange} className={`w-full py-3 pl-10 pr-12 rounded-lg ...`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 ...">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            <button disabled={loading || isSuccess} className={`w-full flex justify-center items-center py-3 ...`}>
              {loading ? <Spinner /> : isSuccess ? <CheckIcon /> : "Login"}
            </button>
            
            {/* ✅ FIXED: Error message is now uncommented and will display to the user */}
            {error && !isSuccess && (
              <p className="text-center text-sm font-medium text-red-500 animate-pulse pt-2">{error}</p>
            )}
          </form>

          {/* Social login and other links remain the same */}
          <div className="mt-6">
             {/* ... your social login buttons and links ... */}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default Login;
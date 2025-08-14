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
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://triptoindia-18.onrender.com/api";
      
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
      if (!data.user) {
        throw new Error("Invalid server response: missing user data");
      }

      // On success, dispatch the action and trigger the UI animation
      dispatch(loginSuccess(data.user));
      setIsSuccess(true);
      
      // Navigate after the success animation completes
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      // Only dispatch a failure if the error wasn't from our own AbortController.
      if (err.name !== 'AbortError') {
        dispatch(loginFailure(err.message || "Login failed. Please try again."));
      }
    }
  };

  const isDark = theme === "dark";

  //==================================================================
  // --- JSX (UNCHANGED) ---
  //==================================================================
  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-1/2 flex justify-center items-center p-8 transition-colors duration-500">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="mt-2">Sign in to continue your journey.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className={`font-medium transition-colors duration-300 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'}`}>Sign up</Link>
          </p>
        </div>
      </div>
      <div className="flex w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default Login;
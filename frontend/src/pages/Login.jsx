import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";

// Timeout constants
const API_TIMEOUT = 8000; // 8 seconds for API call
const LOADING_SAFETY_TIMEOUT = 10000; // 10 seconds total maximum

const Login = ({ theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ email: "", password: "" });
  
  // Refs for cleanup
  const apiTimeoutRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Safety net effect
  useEffect(() => {
    if (loading) {
      safetyTimeoutRef.current = setTimeout(() => {
        console.error("Loading safety net triggered - forcing reset");
        dispatch(loginFailure("Operation timed out. Please try again."));
      }, LOADING_SAFETY_TIMEOUT);
    }

    return () => {
      clearTimeout(safetyTimeoutRef.current);
    };
  }, [loading, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Cleanup any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Setup new request
    abortControllerRef.current = new AbortController();
    apiTimeoutRef.current = setTimeout(() => {
      abortControllerRef.current.abort();
    }, API_TIMEOUT);

    try {
      dispatch(loginStart());
      
      const BASE_URL = import.meta.env.DEV 
        ? "/api" 
        : "https://triptoindia-18.onrender.com/api";

      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(apiTimeoutRef.current);

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        throw new Error(data.message || `Server responded with ${res.status}`);
      }

      if (!data.user) {
        throw new Error("Invalid server response: missing user data");
      }

      dispatch(loginSuccess(data.user));
      navigate("/");
    } catch (err) {
      clearTimeout(apiTimeoutRef.current);
      
      // Only dispatch failure if it wasn't an abort
      if (err.name !== 'AbortError') {
        dispatch(loginFailure(err.message || "Login failed"));
      }
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`w-screen h-screen flex justify-center items-center transition-all duration-300 ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col border rounded-lg p-6 w-80 sm:w-96 gap-5 shadow-xl ${isDark ? "bg-[#1a1a1a] border-gray-600" : "bg-white bg-opacity-70 border-black"}`}>
          <h1 className="text-3xl text-center font-bold">Login</h1>

          {/* Form inputs... */}
 <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">Email:</label>
            <input
              type="email"
              id="email"
              required
              className={`p-3 rounded border ${isDark ? "bg-[#2a2a2a] border-gray-500 text-white" : "bg-white bg-opacity-90 border-black text-black"}`}
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">Password:</label>
            <input
              type="password"
              id="password"
              required
              className={`p-3 rounded border ${isDark ? "bg-[#2a2a2a] border-gray-500 text-white" : "bg-white bg-opacity-90 border-black text-black"}`}
              onChange={handleChange}
            />
          </div>

          <p className="text-blue-500 text-sm hover:underline">
            <Link to={`/signup`}>Don't have an account? Signup</Link>
          </p>

          <button
            disabled={loading}
            className={`p-3 rounded hover:opacity-95 disabled:opacity-60 ${
              isDark ? "bg-gray-800 text-white" : "bg-slate-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center animate-pulse">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
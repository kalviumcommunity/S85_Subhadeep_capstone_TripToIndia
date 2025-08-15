import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import InteractiveArt from "./InteractiveArt";

// Icons
const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ForgotPassword = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://triptoindia-18.onrender.com/api";
      
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
      
      setIsSuccess(true);
      setMessage(res.data.message);
      setEmail(""); // Clear the form
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Forgot Password?</h1>
            <p className="mt-2 text-sm lg:text-base">Enter your email to reset your password.</p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-600">Email Sent!</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
                <p className="text-xs text-gray-500">
                  Check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className={`block w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-300 ${
                    isDark 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setMessage("");
                    setError("");
                  }}
                  className={`block w-full py-3 px-4 rounded-lg font-semibold border-2 transition-colors duration-300 ${
                    isDark 
                      ? 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  Send Another Email
                </button>
              </div>
            </div>
          ) : (
            <form className="mt-6 lg:mt-8 space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                />
              </div>

              <button 
                disabled={loading} 
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white transition-all duration-300 disabled:opacity-80 h-[52px] ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'
                }`}
              >
                {loading ? <Spinner /> : "Send Reset Email"}
              </button>

              {error && (
                <p className="text-center text-sm font-medium text-red-500 animate-pulse">
                  {error}
                </p>
              )}
            </form>
          )}

          <div className="text-center">
            <Link 
              to="/login" 
              className={`text-sm font-medium transition-colors duration-300 ${
                isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default ForgotPassword;

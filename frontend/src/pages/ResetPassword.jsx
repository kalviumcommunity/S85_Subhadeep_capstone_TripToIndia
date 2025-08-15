import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import InteractiveArt from "./InteractiveArt";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Icons
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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

const ResetPassword = ({ theme }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const isDark = theme === "dark";
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setVerifying(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://triptoindia-18.onrender.com/api";
      const res = await axios.get(`${BASE_URL}/verify-reset-token/${token}`);
      
      if (res.data.success) {
        setUserEmail(res.data.email);
        setVerifying(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset token.");
      setVerifying(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError("Password must be at least 6 characters with uppercase, lowercase, number, and special character.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://triptoindia-18.onrender.com/api";
      
      const res = await axios.post(`${BASE_URL}/reset-password`, {
        token,
        newPassword: formData.newPassword
      });
      
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className={`w-screen h-screen flex items-center justify-center ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
        <div className="text-center">
          <Spinner />
          <p className="mt-4">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className={`w-screen h-screen flex items-center justify-center ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">Invalid Reset Link</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Link
            to="/forgot-password"
            className={`inline-block py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Reset Password</h1>
            <p className="mt-2 text-sm lg:text-base">
              Enter your new password for {userEmail}
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-green-600">Password Reset Successful!</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                </p>
              </div>
              <Link
                to="/login"
                className={`inline-block py-3 px-6 rounded-lg font-semibold transition-colors duration-300 ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="mt-6 lg:mt-8 space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="New Password"
                  className={`w-full py-3 pl-10 pr-12 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm New Password"
                  className={`w-full py-3 pl-10 pr-12 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 6 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
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
                {loading ? <Spinner /> : "Reset Password"}
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

export default ResetPassword;

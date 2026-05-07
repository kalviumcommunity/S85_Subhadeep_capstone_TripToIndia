import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import OTPInput from '../components/OTPInput';
import InteractiveArt from './InteractiveArt';
import { loginSuccess } from '../redux/user/userSlice';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const OTPVerification = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const isDark = theme === 'dark';
  
  // Get data from navigation state
  const { email, purpose, from } = location.state || {};
  
  useEffect(() => {
    if (!email || !purpose) {
      navigate('/login');
    }
  }, [email, purpose, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleOTPComplete = async (otpValue) => {
    setOtp(otpValue);
    await verifyOTP(otpValue);
  };

  const verifyOTP = async (otpValue) => {
    setLoading(true);
    setError('');

    try {
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api";
      
      let endpoint;
      if (purpose === 'login') {
        endpoint = `${BASE_URL}/verify-login-otp`;
      } else if (purpose === 'signup') {
        endpoint = `${BASE_URL}/verify-signup-otp`;
      }

      const res = await axios.post(endpoint, {
        email,
        otp: otpValue
      });

      if (res.data.success) {
        // Store token and user data
        localStorage.setItem('token', res.data.token);
        dispatch(loginSuccess(res.data.user));
        
        // Show success message
        if (purpose === 'signup') {
          alert(`Welcome to TripToIndia, ${res.data.user.firstname}! Your account has been verified successfully.`);
        } else {
          alert(`Welcome back, ${res.data.user.firstname}! Login successful.`);
        }
        
        // Navigate to appropriate page
        navigate(from || '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const BASE_URL = import.meta.env.DEV ? "/api" : "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api";
      
      await axios.post(`${BASE_URL}/resend-otp`, {
        email,
        purpose
      });

      setResendCooldown(60); // 60 seconds cooldown
      alert('New verification code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setResendLoading(false);
    }
  };

  const getPurposeText = () => {
    switch (purpose) {
      case 'login':
        return {
          title: 'Verify Login',
          subtitle: 'Enter the verification code sent to your email to complete login',
          icon: '🔐'
        };
      case 'signup':
        return {
          title: 'Verify Email',
          subtitle: 'Enter the verification code sent to your email to activate your account',
          icon: '📧'
        };
      default:
        return {
          title: 'Verify Code',
          subtitle: 'Enter the verification code sent to your email',
          icon: '🔢'
        };
    }
  };

  const purposeText = getPurposeText();

  if (!email || !purpose) {
    return null;
  }

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500">
        <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl mb-4">{purposeText.icon}</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{purposeText.title}</h1>
            <p className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
              {purposeText.subtitle}
            </p>
            <p className="mt-2 text-sm font-medium">
              Sent to: <span className="text-blue-600 dark:text-blue-400">{email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                disabled={loading}
                theme={theme}
              />
            </div>

            {error && (
              <div className="text-center">
                <p className="text-sm font-medium text-red-500 animate-pulse">
                  {error}
                </p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center space-x-2">
                <Spinner />
                <span className="text-sm">Verifying...</span>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the code?
              </p>
              
              <button
                onClick={handleResendOTP}
                disabled={resendLoading || resendCooldown > 0}
                className={`text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Spinner />
                    <span>Sending...</span>
                  </span>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate(purpose === 'signup' ? '/signup' : '/login')}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                ← Back to {purpose === 'signup' ? 'Signup' : 'Login'}
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Code expires in 10 minutes</p>
            <p>Check your spam folder if you don't see the email</p>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default OTPVerification;

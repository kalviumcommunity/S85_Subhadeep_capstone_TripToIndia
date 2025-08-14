import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutSuccess, loginFailure } from "../redux/user/userSlice"; 
import { IoClose, IoMailOutline, IoCallOutline, IoPersonOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

// You can change this URL to any beautiful, high-resolution image of India.
// This one is a placeholder from Unsplash.
const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop";

const Profile = ({ theme }) => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = () => {
    dispatch(logOutSuccess());
    dispatch(loginFailure(null));
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };

  if (!user) {
    return (
      <div className={`w-screen h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        <div className="text-center">
            <h2 className="text-2xl font-semibold">Please log in to view your profile.</h2>
            <button onClick={() => navigate('/login')} className={`mt-4 font-semibold py-2 px-6 rounded-lg transition-all duration-300 ${isDark ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                Go to Login
            </button>
        </div>
      </div>
    );
  }

  // ==================================================================
  // --- ✨ INCREDIBLE INDIA INSPIRED UI ---
  // ==================================================================
  return (
    <div className="w-screen h-screen flex items-center justify-center relative font-serif">
        {/* 1. Full-Screen Background Image with Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-10" style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}>
            <div className={`w-full h-full transition-colors duration-500 ${isDark ? 'bg-black/60' : 'bg-black/30'}`}></div>
        </div>

        {/* 2. Main Profile Content Card */}
        <div className="max-w-4xl w-full flex flex-row rounded-lg shadow-2xl animate-fade-in-scale mx-4">
            {/* Left Side: User Info & Welcome Message */}
            <div className={`w-1/2 p-12 text-white flex flex-col justify-center rounded-l-lg
                             transition-colors duration-500 ${isDark ? 'bg-gray-900/80' : 'bg-gray-800/80'} backdrop-blur-md`}>

                <div className="text-left">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=A78BFA&color=fff&size=96&font-size=0.33&bold=true`}
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg"
                    />
                    <h1 className="text-5xl font-extrabold mt-6 leading-tight">
                        Hello, {user.firstname}!
                    </h1>
                    <p className="mt-2 text-lg text-white/80">
                        Welcome to your personal dashboard. Your journey through India's wonders is just a click away.
                    </p>
                </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center rounded-b-lg md:rounded-r-lg md:rounded-bl-none
                             transition-colors duration-500 ${isDark ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-md`}>
                
                <h2 className={`text-2xl font-bold mb-6 border-b-2 pb-2 ${isDark ? 'text-white border-purple-400/50' : 'text-gray-800 border-blue-500/50'}`}>
                    Your Details
                </h2>

                <div className="space-y-5">
                    {/* Full Name */}
                    <div className="flex items-center gap-4">
                        <IoPersonOutline size={22} className={isDark ? 'text-purple-300' : 'text-blue-600'} />
                        <div className={isDark ? 'text-white/90' : 'text-gray-700'}>
                            <span className="text-sm opacity-70">Full Name</span>
                            <p className="font-semibold text-lg">{user.firstname} {user.lastname}</p>
                        </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-4">
                        <IoMailOutline size={22} className={isDark ? 'text-purple-300' : 'text-blue-600'} />
                        <div className={isDark ? 'text-white/90' : 'text-gray-700'}>
                            <span className="text-sm opacity-70">Email Address</span>
                            <p className="font-semibold text-lg">{user.email}</p>
                        </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-center gap-4">
                        <IoCallOutline size={22} className={isDark ? 'text-purple-300' : 'text-blue-600'} />
                        <div className={isDark ? 'text-white/90' : 'text-gray-700'}>
                            <span className="text-sm opacity-70">Phone Number</span>
                            <p className="font-semibold text-lg">{user.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-10 pt-6 border-t border-white/20 dark:border-white/10">
                    <button onClick={handleLogout} className="group flex items-center justify-center gap-3 w-full bg-red-500/80 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300">
                        <FiLogOut className="transition-transform duration-300 group-hover:scale-110" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

             {/* Close Button - More discreet */}
            <button onClick={handleClose} className="absolute top-3 right-3 z-20 text-#007BFF hover:text-red-500 transition-all duration-200">
                <IoClose size={28} />
            </button>
        </div>
    </div>
  );
};

export default Profile;
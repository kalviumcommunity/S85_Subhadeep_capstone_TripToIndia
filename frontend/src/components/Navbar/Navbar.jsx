import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import day from "../../assets/day.png";
import night from "../../assets/night.png";
import logo_light from "../../assets/logo_light.png";
import logo_dark from "../../assets/logo_dark.png";
import { useSelector } from "react-redux";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ theme, setTheme }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Top Places", path: "/top-places" },
  ];

  return (
    <>
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Modern Extraordinary Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl">
        {/* Animated Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/navbar-video.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/25 via-gray-400 to-green-400/25 "
          }`}></div>

          {/* Animated Particles */}
          <div className="absolute inset-0">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        </div>

        {/* Glassmorphism Border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <nav className="relative max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4 h-20">
          {/* Futuristic Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-md ${
                theme === "dark" ? "bg-blue-400/50" : "bg-purple-400/50"
              } group-hover:blur-lg transition-all duration-300`}></div>
              <img
                src={theme === "light" ? logo_dark : logo_light}
                alt="Logo"
                className="relative w-12 h-12 hover:rotate-12 transition-all duration-500 hover:scale-110"
              />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${
              theme === "dark"
                ? "from-orange-400 via-gray-300 to-green-400"
                : "from-orange-600 via-gray-300 to-green-700"
            } bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}>
              TripToIndia
            </span>
          </Link>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Center Navigation (Desktop) */}
        <ul className="hidden md:flex items-center justify-center gap-16 flex-1">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="relative group">
              <Link
                to={path}
                className={`relative px-4 py-3 transition-all duration-500 font-bold text-lg hover:scale-105 transform ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                <span className="relative z-10">{name}</span>
                {/* Hover background effect */}
                <div className={`absolute inset-0 rounded-xl transition-all duration-500 transform scale-0 group-hover:scale-100 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/25"
                }`}></div>
                {/* Active state background */}
                {location.pathname === path && (
                  <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 shadow-xl shadow-purple-500/30"
                      : "bg-gradient-to-r from-blue-600/30 to-cyan-600/30 shadow-xl shadow-blue-500/30"
                  }`}></div>
                )}
              </Link>
              {/* Modern underline effect */}
              <span
                className={`absolute left-1/2 -bottom-1 h-1 transform -translate-x-1/2 transition-all duration-500 ease-out rounded-full ${
                  location.pathname === path ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                } ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-fuchsia-400 to-purple-400 shadow-lg shadow-purple-400/50"
                    : "bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-blue-400/50"
                }`}
              />
            </li>
          ))}
        </ul>

        {/* Theme Toggle + Profile/Login (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Modern Theme Toggle */}
          <div
            onClick={toggleMode}
            className={`relative w-16 h-8 rounded-full cursor-pointer transition-all duration-500 ${
              theme === "dark"
                ? "bg-gradient-to-r from-orange-400 to-green-600 shadow-lg shadow-purple-500/30"
                : "bg-gradient-to-r from-orange-400 to-green-400 shadow-lg shadow-yellow-400/30"
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-500 transform ${
              theme === "dark" ? "translate-x-9 bg-gray-800" : "translate-x-1 bg-white"
            } shadow-lg flex items-center justify-center`}>
              <img
                src={theme === "light" ? night : day}
                alt="Toggle Theme"
                className="w-4 h-4 transition-transform duration-300 hover:rotate-12"
              />
            </div>
          </div>

          {user ? (
            <Link to="/profile" title="Profile" className="relative group">
              <div className={`absolute inset-0 rounded-full blur-md ${
                theme === "dark" ? "bg-blue-400/50" : "bg-purple-400/50"
              } group-hover:blur-lg transition-all duration-300`}></div>
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=0D8ABC&color=fff`}
                alt="Profile"
                className="relative w-12 h-12 rounded-full border-2 border-white/50 shadow-xl hover:scale-110 transition-all duration-300"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className={`relative px-6 py-3 rounded-xl font-bold text-sm overflow-hidden group transition-all duration-500 ${
                theme === "dark"
                  ? "text-white border border-white/30 hover:border-white/60"
                  : "text-gray-800 border border-gray-800/30 hover:border-gray-800/60"
              }`}
            >
              <span className="relative z-10">Login</span>
              <div className={`absolute inset-0 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}></div>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <div className="fixed top-0 left-0 w-full z-50 md:hidden animate-slideDown">
              <div className="bg-white dark:bg-[#222] border-b border-pink-500 shadow-xl rounded-b-2xl mx-2 mt-2">
                <ul className="flex flex-col items-center gap-8 py-8">
                  {navLinks.map(({ name, path }) => (
                    <li key={path} className="w-full text-center">
                      <Link
                        to={path}
                        className="block text-xl font-bold py-2 rounded-lg transition
                          hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100
                          dark:hover:from-[#333] dark:hover:to-[#444]
                          hover:text-pink-600 dark:hover:text-blue-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <img
                      onClick={toggleMode}
                      src={theme === "light" ? night : day}
                      alt="Toggle Theme"
                      className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform duration-300 mx-auto"
                    />
                  </li>
                  <li>
                    {user ? (
                      <Link
                        to="/profile"
                        title="Profile"
                        onClick={() => setMenuOpen(false)}
                      >
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=0D8ABC&color=fff`}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg mx-auto"
                        />
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className={`px-5 py-2 rounded-lg border-2 font-bold ${
                          theme === "dark"
                            ? "border-white text-white hover:bg-white hover:text-black"
                            : "border-black text-black hover:bg-black hover:text-white"
                        } transition duration-300`}
                        onClick={() => setMenuOpen(false)}
                      >
                        Log In / Sign In
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
            {/* Animation keyframes */}
            <style>
              {`
                @keyframes slideDown {
                  0% { transform: translateY(-100%);}
                  100% { transform: translateY(0);}
                }
                .animate-slideDown {
                  animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1);
                }
              `}
            </style>
          </>
        )}
      </nav>
    </div>
    </>
  );
};

export default Navbar;
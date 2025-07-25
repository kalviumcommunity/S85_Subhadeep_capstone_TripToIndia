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
    <div
      className={`w-screen z-50 shadow-md ${
        theme === "dark"
          ? "bg-gradient-to-r from-black via-gray-900 to-black text-white"
          : "bg-white text-black"
      } transition-colors duration-500`}
    >
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 text-lg font-medium h-20 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={theme === "light" ? logo_dark : logo_light}
            alt="Logo"
            className="w-12 h-12 hover:rotate-12 transition-transform duration-300"
          />
        </Link>

        {/* Hamburger Icon */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Center Navigation (Desktop) */}
        <ul className="hidden md:flex items-center justify-center gap-20 flex-1">
          {navLinks.map(({ name, path }) => (
            <li key={path} className="relative group">
              <Link
                to={path}
                className={`transition-colors duration-300 font-semibold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {name}
              </Link>
              <span
                className={`absolute left-0 -bottom-1 h-[3px] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${
                  location.pathname === path
                    ? "scale-x-100 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                    : "bg-blue-500"
                }`}
              />
            </li>
          ))}
        </ul>

        {/* Theme Toggle + Profile/Login (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <img
            onClick={toggleMode}
            src={theme === "light" ? night : day}
            alt="Toggle Theme"
            className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
          />

          {user ? (
            <Link to="/profile" title="Profile">
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=0D8ABC&color=fff`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-1 rounded-lg border font-semibold ${
                theme === "dark"
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              } transition duration-300`}
            >
              Log In / Sign In
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
  );
};

export default Navbar;

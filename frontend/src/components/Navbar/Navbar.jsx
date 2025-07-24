import React from "react";
import { Link, useLocation } from "react-router-dom";
import day from "../../assets/day.png";
import night from "../../assets/night.png";
import logo_light from "../../assets/logo_light.png";
import logo_dark from "../../assets/logo_dark.png";
import { useSelector } from "react-redux";

const Navbar = ({ theme, setTheme }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);

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
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4 text-lg font-medium h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={theme === "light" ? logo_dark : logo_light}
            alt="Logo"
            className="w-12 h-12 hover:rotate-12 transition-transform duration-300"
          />
        </Link>

        {/* Center Navigation */}
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

        {/* Theme Toggle + Profile/Login */}
        <div className="flex items-center gap-4">
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
      </nav>
    </div>
  );
};

export default Navbar;

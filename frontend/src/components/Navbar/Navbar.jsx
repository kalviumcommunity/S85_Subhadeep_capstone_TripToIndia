import React from "react";
import { Link } from "react-router-dom";
import day from "../../assets/day.png";
import night from "../../assets/night.png";
import logo_light from "../../assets/logo_light.png";
import logo_dark from "../../assets/logo_dark.png";
import { useSelector } from "react-redux";

const Navbar = ({ theme, setTheme }) => {
  const toggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const user = useSelector((state) => state.user.currentUser);

  return (
    <div
      className={`w-screen ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <nav className="relative max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 transition-colors duration-500 text-[20px]">
        {/* Logo - Left */}
        <Link to="/">
          <img
            src={theme === "light" ? logo_dark : logo_light}
            alt="Logo"
            className="w-12 h-12 cursor-pointer"
          />
        </Link>

        {/* Center Nav Links */}
        <ul className="flex items-center justify-center gap-32 flex-1">
          <li>
            <Link
              to="/"
              className={`font-semibold hover:text-blue-500 transition-colors ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`font-semibold hover:text-blue-500 transition-colors ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/top-places"
              className={`font-semibold hover:text-blue-500 transition-colors ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Top Places
            </Link>
          </li>
        </ul>

        {/* Right Side: Theme Toggle + Profile */}
        <div className="flex items-center gap-4">
          <img
            onClick={toggleMode}
            src={theme === "light" ? night : day}
            alt="Theme Toggle"
            className="w-8 h-8 cursor-pointer"
          />

           {user ? (
            <Link to="/profile" title="Profile">
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=0D8ABC&color=fff`}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-blue-500 shadow hover:scale-105 transition duration-300"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className={`font-semibold hover:text-blue-500 transition-colors ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
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

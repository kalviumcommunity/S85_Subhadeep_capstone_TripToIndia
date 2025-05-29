import React from 'react';
import { Link } from 'react-router-dom';
import day from '../../assets/day.png';
import night from '../../assets/night.png';
import logo_light from '../../assets/logo_light.png';
import logo_dark from '../../assets/logo_dark.png';

const Navbar = ({ theme, setTheme }) => {
  const toggleMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`w-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 transition-colors duration-500 text-[20px]">
        <Link to="/">
          <img 
            src={theme === 'light' ? logo_dark : logo_light} 
            alt="Logo" 
            className="w-12 h-12 cursor-pointer" 
          />
        </Link>
        
        <ul className="flex-1 flex items-center justify-center gap-14">
          <li>
            <Link to="/" className={`font-semibold hover:text-blue-500 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={`font-semibold hover:text-blue-500 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              About
            </Link>
          </li>
          <li>
            <Link to="/top-places" className={`font-semibold hover:text-blue-500 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Top Places
            </Link>
          </li>
          <li>
            <Link to="/login" className={`font-semibold hover:text-blue-500 transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Log In / Sign In
            </Link>
          </li>
        </ul>
        
        <img 
          onClick={toggleMode} 
          src={theme === 'light' ? night : day} 
          alt="Theme Toggle" 
          className="w-8 h-8 cursor-pointer ml-10" 
        />
      </nav>
    </div>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import day from '../../assets/day.png';
import night from '../../assets/night.png';
import logo_light from '../../assets/logo_light.png';
import logo_dark from '../../assets/logo_dark.png';

const Navbar = ({ theme, settheme }) => {
  const toggle_mode = () => {
    theme === 'light' ? settheme('dark') : settheme('light');
  };

  return (
    <div className='navbar'>
      <Link to="/">
      <img src={theme === 'light' ? logo_dark : logo_light} alt="" className='logo'  />
      </Link>
      <ul>
        <li><Link to="/"><b>Home</b></Link></li>
        <li><Link to="/about"><b>About</b></Link></li>
        <li><Link to="/top-places"><b>Top Places</b></Link></li>
        <li><Link to="/login"><b>Log In / Sign In</b></Link></li>
      </ul>
      <img onClick={toggle_mode} src={theme === 'light' ? night : day} alt="" className='toggle-icon' />
    </div>
  );
};

export default Navbar;

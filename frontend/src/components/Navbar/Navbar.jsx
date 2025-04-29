import React from 'react'
import "./Navbar.css"
import day from "../../assets/day.png"
import night from  "../../assets/night.png"
import logo from  "../../assets/logo.png"

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="" className='logo'/>
       <ul>
        <li>Home</li>
        <li>About</li>
        <li>Top places</li>
        <li>log-in/sign-in</li>
       </ul>

       <img src={night} alt="" className='toggle-icon'/>
       </div>
  )
}

export default Navbar

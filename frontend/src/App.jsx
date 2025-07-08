import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TopPlaces from './pages/TopPlaces.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Add_info from './pages/Add_info.jsx';
import PlaceDetails from './pages/PlaceDetails.jsx';
const App = () => {
  const [theme, settheme] = useState('light');

  return (
    <Router>
      <div className={`w-screen min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#222] text-white' : 'bg-[#ced8ff] text-black'}`}>

      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={settheme} />

        <Routes>
          <Route path="/" element={<Home theme={theme}/>} />
          <Route path="/about" element={<About theme={theme}/>} />
          <Route path="/top-places" element={<TopPlaces theme={theme}/>} />
          <Route path="/login" element={<Login theme={theme}/>} />
          <Route path="/signup" element={<Signup theme={theme}/>} />
          <Route path="/profile" element={<Profile theme={theme} />} />
          <Route path="/add-info" element={<Add_info theme={theme} />}/>
          <Route path="/place/:id" element={<PlaceDetails theme={theme} />} />

        </Routes>
      </div>
      </div>
    </Router>
  );
};

export default App;

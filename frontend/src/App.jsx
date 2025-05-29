import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import TopPlaces from './pages/TopPlaces.jsx';
import Login from './pages/Login.jsx';
const App = () => {
  const [theme, settheme] = useState('light');

  return (
    <Router>
      <div className={`w-screen min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#222] text-white' : 'bg-[#ced8ff] text-black'}`}>

      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={settheme} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About theme={theme}/>} />
          <Route path="/top-places" element={<TopPlaces />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
};

export default App;

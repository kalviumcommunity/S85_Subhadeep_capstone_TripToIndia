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
      <div className={`container ${theme}`}>
        <Navbar theme={theme} settheme={settheme} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/top-places" element={<TopPlaces />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

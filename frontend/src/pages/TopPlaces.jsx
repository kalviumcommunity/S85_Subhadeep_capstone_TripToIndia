import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopPlaces = ({ theme }) => {
  const [places, setPlaces] = useState([]);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomPlaces = async () => {
      try {
        const res = await axios.get("https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/places/random");
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching random places", err);
      }
    };
    fetchRandomPlaces();
  }, []);
  return (
    <div className={`min-h-screen px-4 lg:ml-20 lg:px-6 py-6 lg:py-10 ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Top Places →</h1>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:ml-16 gap-4 lg:gap-6`}>
        {places.map((place) => (
          <div
            key={place._id}
            onClick={() => navigate(`/place/${place._id}`)}
            className={`cursor-pointer rounded-lg border shadow-lg p-4 hover:shadow-xl transition ${isDark ? "bg-[#222] text-white" : "bg-[white] text-black"} hover:shadow-blue-200`}
          >
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-40 lg:h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg lg:text-xl font-semibold">{place.name}</h2>
          </div>
        ))}
      </div>
      {/* About TripToIndia Section */}
<div
  className={`mt-6 lg:mt-8 px-4 lg:px-6 lg:ml-16 py-6 lg:py-10 rounded-2xl shadow-inner transition-all duration-500 ${
    isDark ? "bg-[#111] text-gray-300" : "bg-white text-gray-800"
  }`}
>
  <h2 className="text-2xl lg:text-3xl font-bold text-center mb-4 text-pink-500">
    Why TripToIndia?
  </h2>
  <p className="text-center text-base lg:text-lg leading-relaxed max-w-4xl mx-auto">
    At <span className="font-semibold text-blue-500">TripToIndia</span>, we believe that every journey is more than a destination—it's a story.
    Our mission is to connect explorers with the heart and soul of India's most beautiful and hidden gems. 🌄
  </p>
  <p className="text-center text-sm lg:text-base leading-relaxed mt-4 max-w-3xl mx-auto italic">
    From the snowy peaks of the Himalayas to the calm shores of the Indian Ocean, we help you discover, share, and relive moments that matter. ✨
  </p>
  <div className="mt-6 text-center">
    <span className="text-sm text-gray-500">
      ✈️ Plan. Explore. Share. — Only with  
      <a href="/" className="hover:text-pink-500 font-medium text-blue-600 transition">
                <span> TripToIndia</span>
              
              </a>
    </span>
  </div>
</div>

    </div>
  );
};

export default TopPlaces;
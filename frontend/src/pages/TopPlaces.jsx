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
    <div className={`min-h-screen ml-20 px-6 py-10`}>
      <h1 className="text-3xl font-bold mb-8">Top Places →</h1>
      <div className={`grid grid-cols-1 ml-16 sm:grid-cols-2 lg:grid-cols-3 gap-6 `}>
        {places.map((place) => (
          <div
            key={place._id}
            onClick={() => navigate(`/place/${place._id}`)}
            className={`cursor-pointer rounded-lg border shadow-lg p-4 hover:shadow-xl transition ${isDark ? "bg-[#222] text-white" : "bg-[white] text-black"} hover:shadow-blue-200`}
          >
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{place.name}</h2>
          </div>
        ))}
      </div>
      {/* About TripToIndia Section */}
<div
  className={`mt-8 px-6 ml-16  py-10 rounded-2xl shadow-inner transition-all duration-500 ${
    isDark ? "bg-[#111] text-gray-300" : "bg-white text-gray-800"
  }`}
>
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-pink-500">
    Why TripToIndia?
  </h2>
  <p className="text-center text-lg leading-relaxed max-w-4xl mx-auto">
    At <span className="font-semibold text-blue-500">TripToIndia</span>, we believe that every journey is more than a destination—it's a story.
    Our mission is to connect explorers with the heart and soul of India's most beautiful and hidden gems. 🌄
  </p>
  <p className="text-center text-md leading-relaxed mt-4 max-w-3xl mx-auto italic">
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
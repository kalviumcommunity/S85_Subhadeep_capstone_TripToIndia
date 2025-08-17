import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopPlaces = ({ theme }) => {
  // State for the places, loading status, and any potential errors
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomPlaces = async () => {
      try {
        const res = await axios.get(
          "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/add/random"
        );
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching random places", err);
        setError("Could not fetch places. Please try again later.");
      } finally {
        // This will run after the try or catch block is finished
        setLoading(false);
      }
    };
    fetchRandomPlaces();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Conditional Rendering ---

  // 1. Show a loading message while fetching data
  if (loading) {
    return (
      <div className={`min-h-screen p-10 text-center ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
        <p>Loading Top Places...</p>
      </div>
    );
  }

  // 2. Show an error message if the fetch fails
  if (error) {
    return (
      <div className={`min-h-screen p-10 text-center text-red-500 ${isDark ? "bg-[#222]" : "bg-[#ced8ff]"}`}>
        <p>{error}</p>
      </div>
    );
  }

  // 3. Render the places data once it's successfully loaded
  return (
    <div className={`min-h-screen px-4 lg:ml-20 lg:px-6 py-6 lg:py-10 ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center lg:text-left">Top Places →</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:ml-16 gap-4 lg:gap-6">
        {places.map((place) => (
          <div
            key={place._id}
            onClick={() => navigate(`/place/${place._id}`)}
            className={`cursor-pointer rounded-lg border shadow-lg p-4 hover:shadow-xl transition ${isDark ? "bg-[#222] text-white" : "bg-white text-black"} hover:shadow-blue-200`}
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
          At <span className="font-semibold text-blue-500">TripToIndia</span>, we believe that every journey is more than a destination—it's a story. Our mission is to connect explorers with the heart and soul of India's most beautiful and hidden gems. 🌄
        </p>
      </div>
    </div>
  );
};

export default TopPlaces;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://triptoindia.onrender.com/api";

const TopPlaces = ({ theme }) => {
  const isDark = theme === "dark";
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchRandomPlaces = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/add/random`);
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching random places", err);
      }
    };
    fetchRandomPlaces();
  }, []);

  return (
    <div
      className={`min-h-screen pt-16 px-6 sm:px-10 transition-all duration-300 ${
        isDark ? "bg-[#111] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-pink-500">Top Places</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => (
          <div
            key={place._id}
            className="bg-white dark:bg-[#222] rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <img
              src={`${BASE_URL.replace("/api", "")}/add/image/${place._id}`}
              alt={place.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-pink-500">{place.name}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {place.description}
            </p>
            <p className="mt-1 text-xs text-gray-400 italic">{place.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPlaces;

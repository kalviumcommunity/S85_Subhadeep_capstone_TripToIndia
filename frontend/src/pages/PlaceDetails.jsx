// src/pages/PlaceDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const PlaceDetails = ({ theme }) => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const isDark = theme === "dark";
    
const navigate = useNavigate();
  const handleClose = () => {
    navigate("/");
  };
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/add/place/${id}`);
        setPlace(res.data);
      } catch (err) {
        console.error("Failed to fetch place", err);
      }
    };
    fetchPlace();
  }, [id]);

  if (!place) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center px-4 transition-all duration-300 ${
        isDark ? "bg-[#1a1a1a] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      <div
        className={`relative -mt-10 max-w-3xl w-full rounded-2xl shadow-2xl p-8 border flex flex-col justify-between ${
          isDark ? "bg-[#2b2b2b] border-gray-700" : "bg-white border-gray-300"
        } transition-all duration-300 hover:shadow-blue-200`}
      >
       <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              >
                <IoClose />
              </button>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{place.name}</h1>
          <img
            src={`http://localhost:3000/add/image/${place._id}`}
            alt={place.name}
            className="rounded-lg mb-6 shadow-lg border object-cover w-full max-h-[400px]"
          />
          <p className="text-lg">{place.description}</p>
          <p className="mt-4 text-sm text-gray-500">{place.address}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;

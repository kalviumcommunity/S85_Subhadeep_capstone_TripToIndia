import React from "react";
import pic from "../assets/images/IMG_20250619_171659.jpg"
import { useNavigate } from "react-router-dom"; 
const About = ({ theme }) => {
  const isDark = theme === "dark";
const navigate = useNavigate(); 

  const handleStartJourney = () => {
    navigate("/"); 
  };
  return (
    <div
      className={`w-screen min-h-screen py-10 transition-all duration-500 ${
        isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      <div className="w-full px-8">
        <div className="flex flex-row items-center justify-between gap-8">
          {/* Image Section */}
          <div className="w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1627895457805-c7bf42cb9873?auto=format&fit=crop&w=600&q=80"
                    alt="Culture"
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-xl">
                  <img
                    src={pic}
                    alt="Adventure"
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1594993877167-a08f13013dc3?auto=format&fit=crop&w=600&q=80"
                    alt="Destination"
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="w-1/2 pl-8">
            <span className="italic text-3xl  font-thin mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500 tracking-normal">
              𝐃𝐢𝐬𝐜𝐨𝐯𝐞𝐫 𝐈𝐧𝐝𝐢𝐚
            </span>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Why TripToIndia is Your Ideal Travel Companion
            </h2>
            <div className="space-y-4">
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Explore the majestic beauty, cultural richness, and hidden gems of India with us.
                From Himalayan peaks to Goan beaches, we bring you handpicked destinations that
                match your travel dreams.
              </p>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Our platform offers trusted guides, curated experiences, and 24/7 support to make
                your journey smooth and memorable. Let every step in India be full of wonder!
              </p>
            </div>
            <div className="mt-8">
              <button onClick={handleStartJourney} className="bg-[#41A4FF] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300 transform hover:-translate-y-1">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

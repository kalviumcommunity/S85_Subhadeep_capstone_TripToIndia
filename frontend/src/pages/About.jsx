import React from "react";
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
        isDark ? "bg-[#ced8ff] text-black" : "bg-[black] text-white"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
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
                    src="https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?auto=format&fit=crop&w=600&q=80"
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
          <div className="w-full lg:w-1/2 lg:pl-8">
            <span className="text-[#41A4FF] text-lg font-semibold uppercase tracking-wide mb-3 block">
              Discover India
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              Why TripToIndia is Your Ideal Travel Companion
            </h2>
            <div className="space-y-4">
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-700" : "text-gray-300"
                }`}
              >
                Explore the majestic beauty, cultural richness, and hidden gems of India with us.
                From Himalayan peaks to Goan beaches, we bring you handpicked destinations that
                match your travel dreams.
              </p>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? "text-gray-700" : "text-gray-300"
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

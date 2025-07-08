import React, { useState } from "react";
import heroImg from "../assets/images/IMG_20240902_151136 copy.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import experienceImg from "../assets/images/trip.png";
import MasonryImagesGallery from "../Image-gallery/MasonryImagesGallery";
import Testimonials from "../Testimonial/Testimonials";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const Home = ({ theme }) => {
  const isDark = theme === "dark";
  const user = useSelector((state) => state.user.currentUser);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm === "") {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://triptoindia-97vr.onrender.com/api/add/search?q=${searchTerm}`
        );
        setSearchResults(res.data);
      } catch (error) {
        console.error("Search failed", error);
      }
    };
    fetchResults();
  }, [searchTerm]);

  return (
    <>
      <div
        className={`transition-all ml-20 duration-500 ${
          isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end items-center">
          <div className="w-full max-w-xs relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FiSearch size={18} />
            </span>

            <input
              type="text"
              placeholder="Search places..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md border outline-none transition-all duration-200 ${
                isDark
                  ? "bg-[#333] text-white placeholder-gray-400 border-gray-600"
                  : "bg-white text-black placeholder-gray-500 border-gray-300"
              }`}
            />

            {searchResults.length > 0 && (
              <ul
                className={`absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-md border shadow-lg ${
                  isDark
                    ? "bg-[#333] text-white border-gray-700"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {searchResults.map((place) => (
                  <li
                    key={place._id}
                    onClick={() => navigate(`/place/${place._id}`)}
                    className="px-4 py-2 hover:bg-pink-100 dark:hover:bg-[#444] cursor-pointer"
                  >
                    {place.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-7xl sm:px-6 lg:px-8 mx-auto px-4">
            {user &&
              (() => {
                const hour = new Date().getHours();
                let greeting = "Hi";
                if (hour < 12) greeting = "Good Morning";
                else if (hour < 18) greeting = "Good Afternoon";
                else greeting = "Good Evening";

                return (
                  <div className="max-w-xl px-6 py-4">
                    <p className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 drop-shadow-lg text-left tracking-wide">
                      {greeting}, {user.firstname}!...👋
                    </p>
                    <p className="text-sm mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 italic text-left">
                      Hope you're having a great{" "}
                      {hour < 12 ? "morning" : hour < 18 ? "day" : "evening"}.
                    </p>
                  </div>
                );
              })()}

            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-6/12 px-4">
                <div className="pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
                  <h1
                    className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Athithidevo Bhava!
                  </h1>
                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-lime-200 to-green-500 leading-[1.3] tracking-normal"
                    style={{
                      fontFamily: `'Noto Sans Devanagari', sans-serif`,
                      lineHeight: "1.4",
                      marginTop: "0.25rem",
                    }}
                  >
                    अतिथिदेवो भव!
                  </h2>

                  <p
                    className={`text-lg md:text-xl leading-relaxed max-w-2xl ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Life is a journey, enjoy the trip.{" "}
                    <span className="font-medium">Aim for the sky</span>, but
                    move slowly, enjoying every step along the way.
                    <span className="block mt-2 italic font-semibold">
                      The journey is a reward.
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-1/2 lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-0">
                  <img
                    src={heroImg}
                    alt=""
                    className="w-full h-[350px] rounded-2xl border border-orange-500 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              <div className="w-1/2 lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-[1cm]">
                  <video
                    src={heroVideo}
                    controls
                    className="w-full h-[350px] transition-transform duration-300 hover:scale-105 rounded-2xl border border-pink-500 object-cover"
                  />
                </div>
              </div>

              <div className="w-1/2 lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-[2cm]">
                  <img
                    src={heroImg02}
                    alt=""
                    className="w-full h-[350px] transition-transform duration-300 hover:scale-105 rounded-2xl border border-orange-500 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Place / Share Info Section */}

        {user && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border border-dashed rounded-2xl p-10 shadow-md bg-white dark:bg-[#333] transition-all">
              <h2 className="text-3xl font-bold mb-4 text-pink-500">
                {user.role === "admin" ? "Add Place" : "Share Your Information"}
              </h2>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-6`}
              >
                {user.role === "admin"
                  ? "Fill out details to add a new destination to the platform."
                  : "Let others know about your experience or favorite place to visit!"}
              </p>
              <button
                onClick={() =>
                  navigate(user.role === "admin" ? "/add-info" : "/share-info")
                }
                className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition"
              >
                {user.role === "admin" ? "Add Place" : "Share Your Information"}
              </button>
            </div>
          </section>
        )}

        {/* Experience Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h5 className="text-2xl font-medium text-pink-500">Experience</h5>
              <h2 className="text-3xl font-semibold mt-4">
                With our all experience <br /> we will serve you.
              </h2>
              <p
                className={`text-lg mt-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Traveling, it leaves you speechless, then turns you into a
                storyteller. <br />
                We travel, some of us forever, to seek other states, other
                lives, other souls.
              </p>

              <div className="flex items-center gap-6 mt-10 flex-wrap ">
                {[
                  { count: "12k+", label: "Successful Trips!" },
                  { count: "2k+", label: "Regular Clients" },
                  { count: "10", label: "Years of Experience!" },
                ].map(({ count, label }) => (
                  <div
                    key={label}
                    className="text-center transition-transform duration-300 hover:scale-105"
                  >
                    <span className="w-16 h-16 flex items-center justify-center bg-pink-500 text-white text-xl font-semibold rounded-lg mx-auto">
                      {count}
                    </span>
                    <h6
                      className={`text-lg mt-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {label}
                    </h6>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <img
                src={experienceImg}
                alt="experience"
                className="rounded-xl w-full"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-2xl font-medium text-pink-500">
              <a href="/top-places" className="hover:text-blue-500 transition">
                Top Places →
              </a>
            </h5>
            <p
              className={`text-lg mt-4 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Click on “Top Places” to discover the best tourist destinations.
              To view the top tourist places, select the “Top Places” option.
              Explore the most popular locations by clicking on “Top Places”.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-2xl font-medium text-pink-500">Gallery</h5>
            <h2 className="text-3xl font-semibold mt-2 mb-10">
              Visit our users Tour Gallery!
            </h2>
            <MasonryImagesGallery />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h5 className="text-2xl font-medium text-pink-500">
              Customer's Love
            </h5>
            <h2 className="text-3xl font-semibold mt-2 mb-6">
              What our Customer's say about us?
            </h2>
            <Testimonials />
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <div className="w-full">
        <footer
          className={`w-screen py-6 ${
            isDark
              ? "bg-[#111] border-gray-700 text-gray-300"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          <div className=" w-full max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-500 mb-4">
                TripToIndia
              </h3>
              <p className="text-sm leading-relaxed">
                Discover incredible destinations, plan your adventures, and make
                memories that last a lifetime.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-pink-500">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="hover:text-blue-500 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-blue-500 transition">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/top-places"
                    className="hover:text-blue-500 transition"
                  >
                    Top Places
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-blue-500 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-pink-500">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-pink-500">
                Contact
              </h4>
              <p className="text-sm">📍 India</p>
              <p className="text-sm">📞 +91 7001293796</p>
              <p className="text-sm">✉️ subhadeepsamanta1535@gmail.com</p>
            </div>
          </div>

          <div className="text-center py-4 border-t border-gray-600 text-sm">
            © {new Date().getFullYear()} TripToIndia. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;

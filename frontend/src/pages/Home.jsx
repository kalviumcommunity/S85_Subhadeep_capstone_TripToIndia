import React, { useState, useRef, useEffect } from "react";
import heroImg from "../assets/images/IMG_20240902_151136 copy.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import experienceImg from "../assets/images/trip.png";
import MasonryImagesGallery from "../Image-gallery/MasonryImagesGallery";
import Testimonials from "../Testimonial/Testimonials";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../redux/user/userSlice";
const Home = ({ theme }) => {
  const isDark = theme === "dark";
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const galleryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    const authStatus = urlParams.get('auth');

    if (token && userData && authStatus === 'success') {
      try {
        // Store token in localStorage
        localStorage.setItem('token', token);

        // Parse user data and update Redux store
        const user = JSON.parse(decodeURIComponent(userData));
        dispatch(loginSuccess(user));

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Show success message
        alert(`Welcome ${user.firstname}! You have successfully logged in with ${user.authProvider}.`);
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        alert('Authentication successful, but there was an error processing your login. Please try again.');
      }
    } else if (urlParams.get('error')) {
      const error = urlParams.get('error');
      alert(`Authentication failed: ${error}. Please try again.`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm === "") {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/places/search?q=${searchTerm}`
        );
        setSearchResults(res.data);
      } catch (error) {
        console.error("Search failed", error);
      }
    };
    fetchResults();
  }, [searchTerm]);

  // Handle scroll progress for gallery
  const handleScroll = () => {
    if (galleryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(Math.min(progress, 1));
    }
  };

  // Scroll to specific position
  const scrollToPosition = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = galleryRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? galleryRef.current.scrollLeft - scrollAmount
        : galleryRef.current.scrollLeft + scrollAmount;

      galleryRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div
        className={`transition-all duration-500 ${
          isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-end items-center">
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

            {searchTerm.trim() !== "" && searchResults.length > 0 && (
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
                <div className="pt-8 lg:pt-20 px-4 lg:px-8 text-center lg:text-left">
                  <h1
                    className={`text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 lg:mb-6 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Athithidevo Bhava!
                  </h1>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-6xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-lime-200 to-green-500 leading-[1.3] tracking-normal"
                    style={{
                      fontFamily: `'Noto Sans Devanagari', sans-serif`,
                      lineHeight: "1.4",
                      marginTop: "0.25rem",
                    }}
                  >
                    अतिथिदेवो भव!
                  </h2>

                  <p
                    className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 ${
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

              {/* Desktop Images - Original Layout */}
              <div className="hidden lg:block lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-0">
                  <img
                    src={heroImg}
                    alt=""
                    className="rounded-2xl border border-orange-500 object-cover transition-transform duration-300 hover:scale-105"
                    style={{ width: '200px', height: '350px' }}
                  />
                </div>
              </div>

              <div className="hidden lg:block lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-[1cm]">
                  <video
                    src={heroVideo}
                    controls
                    className="w-full h-[350px] transition-transform duration-300 hover:scale-105 rounded-2xl border border-pink-500 object-cover"
                  />
                </div>
              </div>

              <div className="hidden lg:block lg:w-2/12 px-4">
                <div className="overflow-hidden pt-8 mt-[2cm]">
                  <img
                    src={heroImg02}
                    alt=""
                    className="transition-transform duration-300 hover:scale-105 rounded-2xl border border-orange-500 object-cover"
                    style={{ width: '200px', height: '350px' }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Images - Horizontal Scroll Layout */}
            <div className="lg:hidden mt-8 px-4">
              <div
                ref={galleryRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                id="heroGallery"
              >
                <div className="flex-shrink-0 w-64">
                  <img
                    src={heroImg}
                    alt="Travel destination"
                    className="w-full h-48 rounded-2xl border border-orange-500 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex-shrink-0 w-64">
                  <video
                    src={heroVideo}
                    controls
                    className="w-full h-48 rounded-2xl border border-pink-500 object-cover object-center transition-transform duration-300 hover:scale-105"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-shrink-0 w-64">
                  <img
                    src={heroImg02}
                    alt="Travel destination"
                    className="w-full h-48 rounded-2xl border border-orange-500 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Functional Scroll Indicator */}
              <div className="flex items-center justify-center mt-4 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollToPosition('left')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className={`relative w-32 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                        isDark ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-orange-500 to-green-500'
                      }`}
                      style={{ width: `${Math.max(scrollProgress * 100, 10)}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => scrollToPosition('right')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isDark
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scroll Hint Text */}
              <div className="text-center">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} italic`}>
                  ← Swipe to explore more →
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Add Place / Share Info Section */}

        {user && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border border-dashed rounded-2xl p-10 shadow-md bg-white dark:bg-[#333] transition-all">
              <h2 className="text-3xl font-bold mb-4 text-pink-500">
                {user.role === "admin" ? "Add Place" : "Share Your Feedback"}
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
                  navigate(user.role === "admin" ? "/add-info" : "/FeedBack")
                }
                className="px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition"
              >
                {user.role === "admin" ? "Add Place" : "Share Your Feedback"}
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
      <footer
        className={`w-screen py-6 ${
          isDark
            ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Compact Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Brand and Description */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">TripToIndia</h3>
              <p className="text-gray-300 text-sm max-w-md">
                Discover incredible destinations and make memories that last a lifetime.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About</a>
              <a href="/top-places" className="text-gray-300 hover:text-white transition-colors duration-300">Top Places</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-right text-sm text-gray-300">
              <p>📞 +91 7001293796</p>
              <p>✉️ subhadeepsamanta1535@gmail.com</p>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-6 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TripToIndia. All rights reserved. Made with ❤️ in India
            </p>
          </div>
        </div>
        </footer>
    </>
  );
};

export default Home;
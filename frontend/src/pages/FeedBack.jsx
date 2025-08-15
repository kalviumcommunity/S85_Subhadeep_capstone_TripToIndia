import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import InteractiveArt from './InteractiveArt';

// API Base URL
const BASE_URL = "https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api";

// Helper SVG Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
  </svg>
);

const StarIcon = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-100 hover:text-yellow-300'}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const FeedBack = ({ theme }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: user ? `${user.firstname} ${user.lastname}` : '',
    email: user ? user.email : '',
    placeName: '',
    message: '',
    rating: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const dropdownRef = useRef(null);

  // Search functionality for places (exactly like your original code)
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm === "") {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        const res = await axios.get(
          `https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/add/search?q=${searchTerm}`
        );
        setSearchResults(res.data);
        setShowDropdown(res.data.length > 0);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Handle place name search
    if (name === 'placeName') {
      setSearchTerm(value);
      setSelectedPlace(null);
      if (value === '') {
        setShowDropdown(false);
      }
    }
  };

  // Handle place selection from dropdown
  const handlePlaceSelect = (place) => {
    const placeName = place.title || place.name || place.placeName || 'Unknown Place';
    setFormData({
      ...formData,
      placeName: placeName
    });
    setSearchTerm(placeName);
    setSelectedPlace(place);
    setShowDropdown(false);
  };

  // Handle input focus to show dropdown
  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle clicking outside to close dropdown
  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for click on dropdown items
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if a place has been selected
    if (!selectedPlace) {
      alert('❌ Please select a place from the dropdown list before submitting your feedback.');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);

      // Show success alert with place name
      alert(`🎉 Thank you for your valuable feedback about "${formData.placeName}", ${formData.name}!\n\nYour feedback helps us improve our services and provide better experiences for all travelers. We truly appreciate you taking the time to share your thoughts with us.\n\nHave a wonderful day! ✨`);

      // Navigate to home page
      navigate('/');
    }, 1000);
  };

  return (
    <div className={`w-screen h-screen flex overflow-hidden ${isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"}`}>

      {/* Left Side: Feedback Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 transition-colors duration-500">
        <div className={`w-full max-w-md transition-all duration-500 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>

          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Share Your Feedback
            </h1>
            <p className={`text-sm sm:text-base lg:text-lg ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Help us improve your travel experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">

            {/* Name Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><EmailIcon /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>

            {/* Place Name Field with Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="placeName"
                  value={formData.placeName}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                  placeholder="Search for a place..."
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 ${
                    selectedPlace
                      ? isDark
                        ? "border-green-500 focus:ring-green-500 bg-gray-800 text-white"
                        : "border-green-500 focus:ring-green-500 bg-gray-50 text-gray-900"
                      : isDark
                      ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                  } focus:outline-none focus:ring-2`}
                />

                {/* Search Results Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-y-auto ${
                      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                    }`}
                  >
                    {searchResults.map((place, index) => (
                      <div
                        key={place._id || place.id || index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceSelect(place);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                        }}
                        className={`px-4 py-3 cursor-pointer transition-colors duration-200 border-b last:border-b-0 ${
                          isDark
                            ? "hover:bg-gray-700 border-gray-700 text-white"
                            : "hover:bg-gray-50 border-gray-200 text-gray-900"
                        }`}
                      >
                        <div className="font-semibold">
                          {place.title || place.name || place.placeName || 'Unknown Place'}
                        </div>
                        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {place.city && place.address
                            ? `${place.city} • ${place.address}`
                            : place.city || place.address || place.location || 'Location not specified'
                          }
                        </div>
                        {place.price && (
                          <div className={`text-sm ${isDark ? "text-green-400" : "text-green-600"}`}>
                            ₹{place.price}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message */}
                {showDropdown && searchTerm && searchResults.length === 0 && (
                  <div className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg border p-4 text-center ${
                    isDark ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-white border-gray-300 text-gray-600"
                  }`}>
                    ❌ No places found. Try a different search term.
                  </div>
                )}
              </div>

              {/* Selected Place Confirmation */}
              {selectedPlace && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {selectedPlace.title || selectedPlace.name || selectedPlace.placeName}
                  {(selectedPlace.city || selectedPlace.location) &&
                    ` in ${selectedPlace.city || selectedPlace.location}`
                  }
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Rate Your Experience
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      filled={star <= formData.rating}
                      onClick={() => handleRatingClick(star)}
                    />
                  ))}
                </div>
              </div>
              {formData.rating > 0 && (
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {formData.rating} out of 5 stars
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="relative">
              <span className="absolute top-3 left-3">
                <MessageIcon />
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Share your feedback..."
                className={`w-full py-3 pl-10 pr-4 rounded-lg border transition-colors duration-300 resize-none ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white transition-all duration-300 disabled:opacity-80 h-[52px] ${
                isSubmitting ? 'bg-green-500' : (isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700')
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>

          </form>
        </div>
      </div>

      {/* Right Side: Interactive Art - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative overflow-hidden">
        <InteractiveArt theme={theme} />
      </div>
    </div>
  );
};

export default FeedBack;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

const PlaceDetails = ({ theme }) => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(
          `https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/add/places/${id}`
        );
        setPlace(res.data);
      } catch (err) {
        console.error("Failed to fetch place", err);
      }
    };
    fetchPlace();
  }, [id]);

  const handleGetDirections = async () => {
    if (!place || !window.google || !window.google.maps) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(origin);

          let destination = null;

          // Use stored lat/lng if available
          if (place.latitude && place.longitude) {
            destination = {
              lat: place.latitude,
              lng: place.longitude,
            };
          } else {
            // Use Geocoding API to convert address to lat/lng
            try {
              const geoRes = await fetch(
                `https://s85-subhadeep-capstone-triptoindia-18.onrender.com/api/geocode?address=${encodeURIComponent(
                  place.address
                )}`
              );
              const geoData = await geoRes.json();
              const location = geoData.results[0]?.geometry?.location;

              console.log("Geocoded destination location:", location);

              if (!location) {
                alert(
                  `Could not find coordinates for this address:\n${place.address}`
                );
                console.log("Geocode full response:", geoData);
                return;
              }

              destination = {
                lat: location.lat,
                lng: location.lng,
              };
            } catch (err) {
              console.error("Geocoding failed", err);
              return;
            }
          }

          calculateDirections(origin, destination);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Could not get your current location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const calculateDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("Origin:", origin);
        console.log("Destination:", destination);
        console.log("Directions status:", status);
        console.log("Directions result:", result);

        if (status === "OK") {
          setDirections(result);
          setShowRoute(true);
        } else {
          console.error("Error fetching directions", result);
          alert("Could not calculate directions. Please try again or use actual Map by this location name.");
        }
      }
    );
  };

  if (!place) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div
      className={`w-screen min-h-screen flex flex-col items-center justify-start px-4 py-6 lg:py-10 transition-all duration-300 ${
        isDark ? "bg-[#1a1a1a] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      {!showRoute && (
        <div
          className={`relative max-w-3xl w-full rounded-2xl shadow-2xl p-4 lg:p-8 border flex flex-col justify-between ${
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center">
                {place.name}
              </h1>
              <button
                onClick={handleGetDirections}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow w-full sm:w-auto"
              >
                Go There →
              </button>
            </div>

            <img
              src={place.imageUrl}
              alt={place.name}
              className="rounded-lg mb-4 lg:mb-6 shadow-lg border object-cover w-full max-h-[300px] lg:max-h-[400px]"
            />
            <p className="text-base lg:text-lg">{place.description}</p>
            <p className="mt-4 text-sm text-gray-500">{place.address}</p>
          </div>
        </div>
      )}

      {showRoute && currentLocation && (
        <div className="mt-6 lg:mt-10 w-full max-w-3xl h-[300px] lg:h-[400px]">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={currentLocation}
            zoom={10}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default PlaceDetails;
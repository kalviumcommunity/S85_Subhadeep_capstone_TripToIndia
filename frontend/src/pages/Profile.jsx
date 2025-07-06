import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/user/userSlice"; 
import { loginFailure } from "../redux/user/userSlice";
import { IoClose } from "react-icons/io5";

const Profile = ({ theme }) => {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = () => {
    dispatch(loginSuccess(null)); 
    dispatch(loginFailure(null)); 
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };

  if (!user) {
    return (
      <div
        className={`w-screen h-screen flex items-center justify-center ${
          isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
        }`}
      >
        <h2 className="text-2xl font-semibold">Please login to view profile.</h2>
      </div>
    );
  }

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center px-4 transition-all duration-300 ${
        isDark ? "bg-[#1a1a1a] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      <div
        className={`relative max-w-3xl w-full rounded-2xl shadow-2xl p-8 border flex flex-col justify-between ${
          isDark ? "bg-[#2b2b2b] border-gray-700" : "bg-white border-gray-300"
        } transition-all duration-300 hover:shadow-blue-200`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          <IoClose />
        </button>

        <div>
          <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Profile Details
          </h1>

          <div className="flex flex-col items-center gap-6">
            <img
              src={`https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md"
            />

            <div className="w-full space-y-5 mt-4">
              <div className="bg-opacity-10 p-4 rounded-md border border-blue-300">
                <label className="block font-medium text-blue-600">Full Name:</label>
                <p className="text-xl font-semibold">{user.firstname} {user.lastname}</p>
              </div>

              <div className="bg-opacity-10 p-4 rounded-md border border-blue-300">
                <label className="block font-medium text-blue-600">Email:</label>
                <p className="text-xl font-semibold">{user.email}</p>
              </div>

              <div className="bg-opacity-10 p-4 rounded-md border border-blue-300">
                <label className="block font-medium text-blue-600">Phone:</label>
                <p className="text-xl font-semibold">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

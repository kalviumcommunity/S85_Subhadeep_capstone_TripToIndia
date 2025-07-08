import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Add_info = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleClose = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://triptoindia.onrender.com/api/add/register",
        formData
      );
      setMessage("✅ Place added successfully!");
      setFormData({ name: "", description: "", address: "", imageUrl: "" });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding place");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-3 py-10 transition duration-300 ${
        isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      <div
        className={`relative w-full max-w-xl p-5 rounded-3xl shadow-xl ml-40 border transition ${
          isDark ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          <IoClose />
        </button>

        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
          Add New Place
        </h2>

        {message && (
          <div className="mb-4 text-center font-semibold text-green-500">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-white focus:ring-pink-500"
                  : "bg-white border-gray-300 text-black focus:ring-pink-500"
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition resize-none ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-white focus:ring-pink-500"
                  : "bg-white border-gray-300 text-black focus:ring-pink-500"
              }`}
            ></textarea>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-white focus:ring-pink-500"
                  : "bg-white border-gray-300 text-black focus:ring-pink-500"
              }`}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="Paste direct image URL (e.g., from Postimages)"
              className={`mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-white focus:ring-pink-500"
                  : "bg-white border-gray-300 text-black focus:ring-pink-500"
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_info;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ theme }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname:"",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const password = formData.password;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  if (!passwordRegex.test(password)) {
    alert(
      "Password must contain at least 6 characters with at least 1 uppercase, 1 lowercase, 1 special character, and 1 number."
    );
    return;
  }

  try {
    const res = await axios.post("/api/register", formData);
    const { success, message } = res.data;

    alert(message);
    navigate("/login");
    
  } catch (error) {
    console.log(error);
  }
};


  const isDark = theme === "dark";

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center transition-all duration-300 ${
        isDark ? "bg-[#222] text-white" : "bg-[#ced8ff] text-black"
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div
          className={`flex flex-col border rounded-lg p-6 w-80 sm:w-96 gap-5 shadow-xl ${
            isDark
              ? "bg-[#1a1a1a] border-gray-600"
              : "bg-white bg-opacity-70 border-black"
          }`}
        > <h1 className="text-3xl text-center font-semibold">Signup</h1>
          <div className="flex flex-col">
            <label htmlFor="firstname" className="font-semibold">
              First name:
            </label>
            <input
              type="text"
              id="firstname"
              className={`p-2 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`} 
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname" className="font-semibold">
              Last name:
            </label>
            <input
              type="text"
              id="lastname"
              className={`p-2 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className={`p-2 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="font-semibold">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              className={`p-2 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className={`p-2 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`}
              onChange={handleChange}
            />
          </div>
          
          <p className="text-blue-700 text-sm hover:underline">
            <Link to={`/login`}>Have an account? Login</Link>
          </p>
          <button className="p-3 text-white bg-slate-700 rounded hover:opacity-95">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
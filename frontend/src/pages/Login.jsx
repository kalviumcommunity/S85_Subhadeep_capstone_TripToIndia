import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Login = ({ theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
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
  try {
    dispatch(loginStart());

    const BASE_URL =
      import.meta.env.MODE === 'development'
        ? '/api'
        : 'https://triptoindia-97vr.onrender.com/api';

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const contentLength = res.headers.get('Content-Length');
    if (contentLength === '0' || !res.ok) {
      throw new Error(res.statusText || 'Login failed');
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      throw new Error(res.statusText || 'Invalid server response');
    }

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    dispatch(loginSuccess(data.user));
    alert(data.message);
    navigate("/");

  } catch (error) {
    dispatch(loginFailure("504 Error", error.message));
    console.error("Login error:", error.message);
  }
};



  const isDark = theme === "dark";

  return (
    <div
      className={`w-screen h-screen flex justify-center items-center transition-all duration-300 ${
        isDark
          ? "bg-[#222] text-white"
          : "bg-[#ced8ff] text-black"
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div
          className={`flex flex-col border rounded-lg p-6 w-80 sm:w-96 gap-5 shadow-xl ${
            isDark
              ? "bg-[#1a1a1a] border-gray-600"
              : "bg-white bg-opacity-70 border-black"
          }`}
        >
          <h1 className="text-3xl text-center font-bold">Login</h1>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              required
              className={`p-3 rounded border ${
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
              required
              className={`p-3 rounded border ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-500 text-white"
                  : "bg-white bg-opacity-90 border-black text-black"
              }`}
              onChange={handleChange}
            />
          </div>
          <p className="text-blue-500 text-sm hover:underline">
            <Link to={`/signup`}>Don't have an account? Signup</Link>
          </p>
          <button
            disabled={loading}
            className={`p-3 rounded hover:opacity-95 disabled:opacity-60 ${
              isDark ? "bg-gray-800 text-white" : "bg-slate-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;

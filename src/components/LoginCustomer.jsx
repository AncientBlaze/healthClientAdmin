import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { Toaster } from "react-hot-toast";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

function LoginCustomer() {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const [userDetails, setUserDetails] = useState({
    number: "",
    password: "",
  });

  const handelSubmit = async (e) => {
    e.preventDefault();

    const isLogin = await useUserStore.getState().login(userDetails);
    console.log(isLogin);
    if (isLogin) {
      navigate(`/pro/${isLogin._id}`);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Welcome Back</h1>

        <form onSubmit={handelSubmit} className="w-full">
          <label
            htmlFor="number"
            className="block text-green-600 font-semibold text-lg mb-2"
          >
            Registered Mobile Number
          </label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-green-400 transition-colors mb-6">
            <input
              id="number"
              required
              value={userDetails.number}
              onChange={(e) =>
                setUserDetails({ ...userDetails, number: e.target.value })
              }
              placeholder="Enter Mobile Number"
              className="flex-grow py-2 px-1 bg-transparent text-gray-900 placeholder-gray-400 text-base outline-none"
              type="text"
            />
            <FaUser className="text-green-400 ml-3" size={20} />
          </div>

          <label
            htmlFor="password"
            className="block text-green-600 font-semibold text-lg mb-2"
          >
            Password
          </label>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-green-400 transition-colors mb-3">
            <input
              id="password"
              required
              value={userDetails.password}
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
              placeholder="Enter Password"
              className="flex-grow py-2 px-1 bg-transparent text-gray-900 placeholder-gray-400 text-base outline-none"
              type={eye ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setEye(!eye)}
              className="text-green-400 ml-3 focus:outline-none"
              aria-label={eye ? "Hide password" : "Show password"}
            >
              {!eye ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={() => navigate("/forgotPassword")}
              className="text-green-500 hover:text-green-700 text-sm font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Log In
          </button>

          <div className="flex items-center justify-center gap-4 my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-500 font-semibold">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center items-center gap-1">
            <p className="text-gray-700 text-sm font-medium">Don't have an account?</p>
            <button
              onClick={() => navigate("/CustomerSignUp")}
              type="button"
              className="text-green-500 hover:text-green-700 font-semibold text-sm focus:outline-none transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default LoginCustomer;

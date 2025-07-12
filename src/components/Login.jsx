/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from '../utils/axios';

function Login() {
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/admin/login', {
        email: userDetails.email,
        password: userDetails.password
      });
      console.log(res)
      if (res.data.status == 200) {
        navigate('/dashboard');
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-12 bg-white rounded-lg shadow-lg"
        >
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
            Welcome Back, Admin!
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-2 text-blue-600 font-semibold text-lg"
              >
                Registered Email
              </label>
              <div className="flex items-center border rounded-lg p-3 bg-gray-100">
                <input
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  id="email"
                  type="email"
                  required
                  placeholder="Enter Email"
                  className="text-gray-900 rounded-lg focus:outline-none text-lg"
                />
                <FaUser className="text-blue-500 ml-3" size={24} />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-2 text-blue-600 font-semibold text-lg"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg p-3 bg-gray-100">
                <input
                  id="password"
                  value={userDetails.password}
                  onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                  type={eye ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  className="text-gray-900 rounded-lg focus:outline-none text-lg"
                />
                <button
                  type="button"
                  onClick={() => setEye(!eye)}
                  className="text-blue-500 ml-3 focus:outline-none"
                  aria-label={eye ? "Hide password" : "Show password"}
                >
                  {!eye ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              {/* <button
                type="button"
                onClick={() => navigate("/forgotPassword")}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </button> */}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            >
              Log In
            </button>

            {/* <p className="text-center text-gray-700 text-sm font-medium">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                type="button"
                className="text-blue-500 hover:text-blue-700 font-semibold text-lg transition-colors"
              >
                Sign Up
              </button>
            </p> */}
          </form>
        </motion.div>
      </motion.div>
      <Toaster />
    </>
  );
}

export default Login;
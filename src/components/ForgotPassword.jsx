import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isOTPsent, setIsOTPsent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOPT] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [id, setID] = useState("");

  const sendOTP = async (e) => {
    e.preventDefault();

    if (!phoneNumber.startsWith("+91") && phoneNumber.length !== 13)
    return toast.error("Please enter a valid phone number with +91");
    const res = await useUserStore.getState().forgatePass(phoneNumber);

    if (res !== false) {
      setID(res.id);
      setIsOTPsent(true);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword)
      return toast.error("Password and Confirm Password doesn't match");

    const res = await useUserStore
      .getState()
      .verifyOTPForPassword(id, otp, password);
    if (res === true) {
      navigate("/loginCustomer");
    }
  };
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-green-200 via-teal-100 to-blue-200 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {!isOTPsent ? (
            <form onSubmit={sendOTP} className="flex flex-col">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Forgot Password
              </h2>

              <label className="text-sm font-semibold text-gray-700 mb-2">
                Enter Mobile Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="e.g. +919876543210"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="flex flex-col">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Verify OTP
              </h2>

              <label className="text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOPT(e.target.value)}
                placeholder="Enter the 4-digit OTP"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Enter Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter New Password"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="text-sm font-semibold text-gray-700 mb-2">
                Enter Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter Confirm Password"
                className="border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
        <Toaster />
      </div>
    );
}

export default ForgotPassword;

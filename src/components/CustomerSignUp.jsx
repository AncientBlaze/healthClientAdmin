import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

function CustomerSignUp() {
  const navigate = useNavigate();
  const [ user, serUser ] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const otpSent = async (e) => {
    e.preventDefault();

    if (!phoneNumber.startsWith("+91") || phoneNumber.length < 13) {
      toast.error("Please enter a valid phone number with +91");
      return;
    }

    const res = await useUserStore.getState().sendOTP(phoneNumber);
    if( res ) {
      serUser(res);
      setIsOTPSent(true);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    const res = await useUserStore.getState().verifyOTP(user._id, otp);
    console.log(res);
    if (res === true) {
      setIsOTPVerified(true);
    }
  };

  const compliteProfile = async (e) => {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const isLogin = await useUserStore.getState().signup(user._id, userDetails);
    if (isLogin) {
      toast.success("Profile created successfully!");
      navigate('/loginCustomer');
    }
  };

  const setProfilePicture = (e) => {
    console.log(e);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setUserDetails((prev) => ({
        ...prev,
        profilePicture: reader.result,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 via-teal-200 to-blue-400 px-6 py-12">
      {!isOTPVerified ? (
        <div className="w-full max-w-md rounded-xl bg-white bg-opacity-20 backdrop-blur-md shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
            OTP Verification
          </h2>

          {isOTPSent ? (
            <form onSubmit={verifyOtp} className="flex flex-col gap-6">
              <label className="text-gray-800 font-semibold">Enter OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="One Time Password"
                type="text"
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
              >
                Submit
              </button>
            </form>
          ) : (
            <form onSubmit={otpSent} className="flex flex-col gap-6">
              <label className="text-gray-800 font-semibold">
                Enter Mobile Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                type="tel"
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                required
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
              >
                Send OTP
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="w-full max-w-xl rounded-2xl bg-white bg-opacity-30 backdrop-blur-md shadow-2xl p-10 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Complete Your Profile
          </h2>

          <form onSubmit={compliteProfile} className="space-y-5">
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Full Name
              </label>
              <input
                placeholder="Your full name"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                type="text"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Gender
              </label>
              <select
                value={userDetails.gender}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, gender: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Date of Birth
              </label>
              <input
                value={userDetails.dateOfBirth}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    dateOfBirth: e.target.value,
                  })
                }
                type="date"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Password
              </label>
              <input
                placeholder="Password"
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
                type="password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                value={userDetails.confirmPassword}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    confirmPassword: e.target.value,
                  })
                }
                type="password"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="text-gray-800 font-medium mb-2 flex items-center gap-2">
                <FaCamera className="text-green-600" />
                Upload Profile Picture
              </label>
              <input
                onChange={setProfilePicture} // ✅ FIXED HERE
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-100 file:text-green-700
                  hover:file:bg-green-200 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* IMPORTANT: this is required for reCAPTCHA */}
      <div id="recaptcha-container"></div>
      <Toaster position="top-center" />
    </div>
  );
}

export default CustomerSignUp;

import React, { useEffect } from "react";
import useUserStore from "../store/userStore";
import { RiImageEditFill } from "react-icons/ri";
import { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

function UpdateProfile() {
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const handleImageChange = async (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      await useUserStore.getState().setUpdatedProfileImage(base64Image);
    };
  };

  useEffect(() => {
    console.log("Fetching user by ID:", id);
    useUserStore.getState().fetchUserByID(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      {user && (
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8 w-full max-w-sm md:max-w-md text-center space-y-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Update Profile Picture
          </h2>

          <div className="relative inline-block">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-green-400"
            />
            <label className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full cursor-pointer hover:bg-yellow-300 transition">
              <RiImageEditFill size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="w-full space-y-3 text-left text-gray-700 text-sm md:text-base">
            <div>
              <p className="font-semibold text-gray-500">Full Name</p>
              <p>{user.name}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">Phone Number</p>
              <p>{user.phone}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">Gender</p>
              <p>{user.gender || "Not specified"}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-500">Date of Birth</p>
              <p>
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </div>
          <Toaster />
        </div>
      )}
    </div>
  );
}

export default UpdateProfile;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "../assets/profile.svg";
import { FiCamera, FiUser, FiMail, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [frontendImage, setFrontendImage] = useState(
    userData?.image || profile
  );
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const imageInputRef = useRef(null);

  useEffect(() => {
    if (userData?.image) {
      setFrontendImage(userData.image);
    }
  }, [userData?.image]);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#23262f] p-4 font-sans">
      <div className="relative w-full max-w-md rounded-2xl bg-[#343440] p-8 shadow-2xl shadow-black/30">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close profile"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-gray-200">My Profile</h1>

          {/* Profile Picture */}
          <div className="relative">
            <label
              htmlFor="profile-image-upload"
              className="group relative h-32 w-32 cursor-pointer rounded-full border-4 border-[#00e4e3] bg-gray-600 shadow-lg shadow-black/20 overflow-hidden flex justify-center items-center"
            >
              <img
                src={frontendImage}
                alt="profile"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FiCamera size={32} className="text-white" />
              </div>
            </label>
            <input
              id="profile-image-upload"
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#00e4e3] text-gray-800 shadow-md transition-transform hover:scale-110 hover:bg-[#00c2c1] focus:outline-none focus:ring-2 focus:ring-[#00e4e3] focus:ring-offset-2 focus:ring-offset-[#343440]"
              aria-label="Change profile picture"
            >
              <FiCamera size={20} />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{userData?.name}</h2>
            <p className="text-md text-gray-400">@{userData?.username}</p>
          </div>

          {/* User Information Form */}
          <form className="w-full space-y-6" onSubmit={handleProfileUpdate}>
            <div className="relative">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-400"
              >
                Name
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-8">
                <FiUser className="text-gray-500" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-lg border-2 border-gray-700 bg-[#2d2d39] px-4 py-3 pl-10 text-gray-200 shadow-inner shadow-black/10 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-2 focus:ring-[#00e4e3]/50"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-400"
              >
                Email
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-8">
                <FiMail className="text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-lg border-2 border-gray-700 bg-[#2d2d39] px-4 py-3 pl-10 text-gray-200 shadow-inner shadow-black/10 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-2 focus:ring-[#00e4e3]/50"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00e4e3] px-6 py-3 text-lg font-bold text-gray-800 shadow-lg shadow-black/20 transition-all duration-300 hover:bg-[#00c2c1] hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-[#00e4e3] focus:ring-offset-2 focus:ring-offset-[#343440] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "../assets/profile.svg";
import {
  FiUser,
  FiSearch,
  FiX,
  FiPower,
  FiMessageSquare,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { setUserData, setUsersData } from "../redux/userSlice";
import axios from "axios";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const { userData, usersData } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setUsersData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = useMemo(
    () =>
      usersData?.filter(
        (user) =>
          user._id !== userData?._id &&
          (user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()))
      ) || [],
    [usersData, userData?._id, search]
  );

  const UserListItem = React.memo(({ user, isSelected, onClick }) => (
    <div
      key={user._id}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        isSelected ? "bg-[#00e4e3]/20" : "hover:bg-[#2d2d39] "
      }`}
      onClick={onClick}
    >
      <img
        src={user.image || profile}
        alt={user.name}
        className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
      />
      <div>
        <h3 className="font-semibold text-white">{user.name}</h3>
        <p className="text-sm text-gray-400">@{user.username}</p>
      </div>
    </div>
  ));

  return (
    <div className="flex h-screen w-full flex-col bg-[#23262f] lg:w-[360px] lg:flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 h-20 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">GiggleChat</h1>
      </div>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <form className="relative">
          <FiSearch className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-full border-2 border-transparent bg-[#2d2d39] py-2.5 pl-11 pr-10 text-gray-200 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-1 focus:ring-[#00e4e3]/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <FiX size={20} />
            </button>
          )}
        </form>
      </div>

      {/* Chat/User List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                onClick={() => setSelectedUser(user)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-10">
              <FiMessageSquare size={40} className="mb-2" />
              {search ? (
                <p>No users found.</p>
              ) : (
                <p>No other users to chat with.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer with Profile and Logout */}
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-700 p-3 h-20">
        <div
          className="flex items-center gap-3 cursor-pointer rounded-lg p-2 flex-grow hover:bg-[#2d2d39] transition-colors"
          onClick={() => navigate("/profile")}
        >
          <img
            src={userData?.image || profile}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="overflow-hidden">
            <h2 className="text-md font-bold text-white truncate">
              {userData?.name}
            </h2>
            <p className="text-sm text-gray-400 truncate">
              @{userData?.username}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="group relative flex-shrink-0 p-3 rounded-full text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
          aria-label="Logout"
        >
          <FiPower size={22} />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

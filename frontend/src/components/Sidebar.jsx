import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "../assets/profile.svg";
import {
  FiUser,
  FiSearch,
  FiX,
  FiPower,
  FiMessageSquare,
  FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import {
  setUserData,
  setUsersData,
  setOnlineUsers,
  setSocket,
  setSelectedUser,
} from "../redux/userSlice";
import axios from "axios";
import { setMessages } from "../redux/messageSlice";

const SidebarHeader = () => (
  <div className="flex items-center justify-between p-4 border-b border-gray-700 h-20 flex-shrink-0">
    <h1 className="text-2xl font-bold text-white">GiggleChat</h1>
  </div>
);

const SearchBar = ({ search, setSearch }) => (
  <div className="p-4 border-b border-gray-700">
    <form className="relative" onSubmit={(e) => e.preventDefault()}>
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
);

const UserProfileFooter = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      if (socket) {
        socket.close();
      }
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setUsersData(null));
      dispatch(setOnlineUsers([]));
      dispatch(setSocket(null));
      dispatch(setSelectedUser(null));
      dispatch(setMessages([]));
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate, socket]);

  return (
    <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-700 p-3 h-20">
      <div
        className="flex items-center gap-3 cursor-pointer rounded-lg p-2 flex-grow hover:bg-[#2d2d39] transition-colors"
        onClick={() => navigate("/profile")}
        role="button"
        aria-label="View your profile"
      >
        <img
          src={userData?.image || profile}
          alt="Your profile"
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
        disabled={isLoggingOut}
        className="group relative flex-shrink-0 p-3 rounded-full text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Logout"
      >
        {isLoggingOut ? (
          <FiLoader size={22} className="animate-spin" />
        ) : (
          <FiPower size={22} />
        )}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Logout
        </span>
      </button>
    </div>
  );
};

const UserListItem = React.memo(({ user, isSelected, onClick }) => {
  const { selectedUser } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.user);
  const isOnline = onlineUsers?.includes(user._id);

  return (
    <button
      key={user._id}
      className={`w-full flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 text-left relative ${
        isSelected ? "bg-[#00e4e3]/20" : "hover:bg-[#2d2d39] hover:scale-[1.02]"
      }`}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00e4e3] rounded-l-lg" />
      )}
      <div className="relative">
        <img
          src={user.image || profile}
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover border-2 border-gray-700"
        />
        {isOnline && (
          <div
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[#23262f]"
            title="Online"
          />
        )}
      </div>
      <div className="overflow-hidden">
        <h3 className="font-semibold text-white truncate">{user.name}</h3>
        <p className="text-sm text-gray-400 truncate">@{user.username}</p>
      </div>
    </button>
  );
});

const UserList = ({ users, search }) => {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-10 text-center px-4">
        <FiMessageSquare size={40} className="mb-2" />
        <p>{search ? "No users found." : "No other users to chat with."}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            isSelected={selectedUser?._id === user._id}
            onClick={() => dispatch(setSelectedUser(user))}
          />
        ))}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { userData, usersData } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");

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

  return (
    <div className="flex h-screen w-full flex-col bg-[#23262f] lg:w-[360px] lg:flex-shrink-0">
      <SidebarHeader />
      <SearchBar search={search} setSearch={setSearch} />
      <UserList users={filteredUsers} search={search} />
      <UserProfileFooter />
    </div>
  );
};

export default Sidebar;

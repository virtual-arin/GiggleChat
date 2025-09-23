import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiMessageCircle, FiSend } from "react-icons/fi";
import profile from "../assets/profile.svg";

const MessageArea = ({ selectedUser, setSelectedUser }) => {
  const { userData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  // Dummy messages for now - replace with API call
  useEffect(() => {
    if (selectedUser) {
      setMessages([
        {
          _id: "1",
          senderId: selectedUser._id,
          text: "Hey! How's it going?",
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
        },
        {
          _id: "2",
          senderId: userData._id,
          text: "Hi! I'm doing great, thanks for asking. How about you?",
          createdAt: new Date(Date.now() - 1000 * 60 * 4),
        },
        {
          _id: "3",
          senderId: selectedUser._id,
          text: "Doing well! Just working on this chat app.",
          createdAt: new Date(Date.now() - 1000 * 60 * 3),
        },
        {
          _id: "4",
          senderId: userData._id,
          text: "Oh cool! It's looking really good.",
          createdAt: new Date(Date.now() - 1000 * 60 * 2),
        },
        {
          _id: "5",
          senderId: selectedUser._id,
          text: "Thanks! I appreciate it.",
          createdAt: new Date(Date.now() - 1000 * 60 * 1),
        },
      ]);
    }
  }, [selectedUser, userData]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message = {
      _id: Date.now().toString(),
      senderId: userData._id,
      text: newMessage,
      createdAt: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="hidden h-full w-full flex-col items-center justify-center bg-[#343440] lg:flex">
        <div className="text-center text-gray-400">
          <FiMessageCircle size={60} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">
            Welcome to GiggleChat!
          </h2>
          <p>Select a user from the sidebar to start a conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#343440]">
      <div className="flex items-center p-4 bg-[#23262f] shadow-md">
        <button
          onClick={() => setSelectedUser(null)}
          className="mr-4 text-white lg:hidden"
          aria-label="Back to user list"
        >
          <FiArrowLeft size={24} />
        </button>
        <img
          src={selectedUser.profileImage || profile}
          alt={selectedUser.name}
          className="h-10 w-10 rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isSender = msg.senderId === userData._id;
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-3 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={selectedUser.profileImage || profile}
                  alt={selectedUser.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-white ${
                  isSender
                    ? "bg-[#00e4e3] text-gray-800 rounded-br-none"
                    : "bg-[#23262f] rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#23262f]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-2 border-gray-700 bg-[#2d2d39] py-3 px-5 text-gray-200 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-1 focus:ring-[#00e4e3]/50"
          />
          <button
            type="submit"
            className="rounded-full bg-[#00e4e3] p-3 text-gray-800 transition-colors hover:bg-[#00c2c1]"
            aria-label="Send message"
          >
            <FiSend size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageArea;

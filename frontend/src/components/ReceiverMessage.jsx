import React from "react";
import profile from "../assets/profile.svg";

const ReceiverMessage = ({ msg, selectedUser }) => {
  const messageTime = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-end gap-3 justify-start">
      <img
        src={selectedUser?.image || profile}
        alt={selectedUser?.name}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-white bg-[#2d2d39] rounded-bl-lg">
        {msg.image && (
          <img
            src={msg.image}
            alt="message attachment"
            className="mb-2 rounded-lg max-h-48 w-full object-cover"
          />
        )}
        {msg.message && <p className="text-sm">{msg.message}</p>}
        <span className="block text-xs mt-1 text-gray-400 text-left">
          {messageTime}
        </span>
      </div>
    </div>
  );
};

export default ReceiverMessage;

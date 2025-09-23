import React from "react";

const SenderMessage = ({ msg }) => {
  const messageTime = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-end gap-3 justify-end">
      <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-gray-800 bg-[#00e4e3] rounded-br-lg">
        {msg.image && (
          <img
            src={msg.image}
            alt="message attachment"
            className="mb-2 rounded-lg max-h-48 w-full object-cover"
          />
        )}
        {msg.message && <p className="text-sm">{msg.message}</p>}
        <span className="block text-xs mt-1 text-gray-600 text-right">
          {messageTime}
        </span>
      </div>
    </div>
  );
};

export default SenderMessage;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiSend,
  FiPaperclip,
  FiX,
  FiSmile,
} from "react-icons/fi";
import profile from "../assets/profile.svg";
import EmojiPicker from "emoji-picker-react";
import { setMessages } from "../redux/messageSlice";
import GetMessage from "../customHooks/GetMessage";
import axios from "axios";
import { serverUrl } from "../main";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

const MessageArea = ({ selectedUser, setSelectedUser }) => {
  const { userData } = useSelector((state) => state.user);
  const {
    messages,
    isLoading: isLoadingMessages,
    isSending,
  } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messageEndRef = useRef(null);

  GetMessage();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup object URL to prevent memory leaks when the component unmounts
  // or when the preview URL changes.
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    // Reset message input when user changes
    setNewMessage("");
    clearImage();
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !imageFile) return;

    const formData = new FormData();
    formData.append("message", newMessage.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      dispatch(setMessages([...messages, res.data]));
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setNewMessage("");
    clearImage();
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
  };

  if (!selectedUser) {
    return (
      <div className="hidden h-full w-full flex-col items-center justify-center bg-[#343440] lg:flex">
        <div className="text-center text-gray-400 p-8 rounded-2xl bg-[#23262f]/50">
          <img
            src="/logo.png"
            alt="GiggleChat Logo"
            className="h-24 w-24 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to GiggleChat!
          </h2>
          <p className="text-lg text-gray-500">
            Select a conversation to start giggling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#343440]">
      <div className="flex items-center p-4 bg-[#23262f] shadow-md h-20 flex-shrink-0 border-b border-gray-700">
        <button
          onClick={() => setSelectedUser(null)}
          className="mr-4 text-gray-400 hover:text-white transition-colors lg:hidden"
          aria-label="Back to user list"
        >
          <FiArrowLeft size={24} />
        </button>
        <img
          src={selectedUser.image || profile}
          alt={`${selectedUser.name}'s profile`}
          className="h-10 w-10 rounded-full object-cover mr-4"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white">{selectedUser.name}</h2>
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full bg-green-500"
              title="Online"
            ></span>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00e4e3]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiMessageCircle size={40} className="mb-2" />
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg) =>
            msg.sender === userData._id ? (
              <SenderMessage key={msg._id} msg={msg} />
            ) : (
              <ReceiverMessage
                key={msg._id}
                msg={msg}
                selectedUser={selectedUser}
              />
            )
          )
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <div className="relative p-4 bg-[#23262f] border-t border-gray-700">
        {imagePreviewUrl && (
          <div className="relative w-24 h-24 mb-2 bg-gray-700/50 p-1 rounded-lg">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 flex items-center justify-center bg-gray-800 text-white rounded-full p-1 shadow-lg transition-transform hover:scale-110"
              aria-label="Remove image"
            >
              <FiX size={16} />
            </button>
          </div>
        )}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-10">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              emojiStyle="native"
            />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="file"
              accept="image/*"
              hidden
              id="image-upload"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image-upload"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-400 transition-colors hover:text-white"
              aria-label="Attach file"
            >
              <FiPaperclip size={22} />
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full rounded-full border-2 border-gray-700 bg-[#2d2d39] py-3 px-5 pl-12 pr-12 text-gray-200 transition duration-300 focus:border-[#00e4e3] focus:outline-none focus:ring-1 focus:ring-[#00e4e3]/50"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              aria-label="Toggle emoji picker"
            >
              <FiSmile size={22} />
            </button>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#00e4e3] p-3 text-gray-800 transition-colors hover:bg-[#00c2c1] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending || (newMessage.trim() === "" && !imageFile)}
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

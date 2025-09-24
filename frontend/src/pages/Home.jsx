import React from "react";
import { useSelector } from "react-redux";
import MessageArea from "../components/MessageArea";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const { selectedUser } = useSelector((state) => state.user);
  return (
    <div className="flex h-screen w-full flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden" : "flex"
        } h-full w-full lg:flex lg:w-auto`}
      >
        <Sidebar />
      </div>

      {/* Message Area */}
      <div className="h-full w-full">
        <MessageArea />
      </div>
    </div>
  );
};

export default Home;

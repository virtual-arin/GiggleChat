import React, { useState } from "react";
import MessageArea from "../components/MessageArea";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen w-full flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden" : "flex"
        } h-full w-full lg:flex lg:w-auto`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Message Area */}
      <div className="h-full w-full">
        <MessageArea
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default Home;

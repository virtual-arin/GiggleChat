import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GetUsers from "./customHooks/GetUsers";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { serverUrl } from "./main";
import { setSocket, setOnlineUsers } from "./redux/userSlice";
import { addMessage } from "./redux/messageSlice";

const App = () => {
  GetCurrentUser();
  GetUsers();
  const { userData, socket, onlineUsers, selectedUser } = useSelector(
    (state) => state.user
  );
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socketio.on("newMessage", (message) => {
        if (
          selectedUser?._id === message.sender ||
          selectedUser?._id === message.receiver
        ) {
          dispatch(addMessage(message));
        }
      });

      return () => {
        socketio.off("newMessage");
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData, dispatch, selectedUser]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/login"} />}
      />
      <Route path="/profile" element={!userData ? <Login /> : <Profile />} />
    </Routes>
  );
};

export default App;

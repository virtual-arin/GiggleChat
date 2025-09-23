import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const GetMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser?._id) {
        try {
          const result = await axios.get(
            `${serverUrl}/api/message/get/${selectedUser._id}`,
            { withCredentials: true }
          );
          dispatch(setMessages(result.data));
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedUser?._id, dispatch]);
};

export default GetMessage;

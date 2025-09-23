import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUsersData } from "../redux/userSlice";

const GetUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      if (userData) {
        try {
          const result = await axios.get(`${serverUrl}/api/user/users`, {
            withCredentials: true,
          });
          dispatch(setUsersData(result.data));
        } catch (error) {
          console.log("An error occurred while fetching users list.");
        }
      }
    };
    fetchUser();
  }, [userData, dispatch]);
};

export default GetUsers;

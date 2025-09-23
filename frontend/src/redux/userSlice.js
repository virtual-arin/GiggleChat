import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    usersData: null,
    selectedUser: null,
    socket: null,
    onlineUsers: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    getOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setUserData,
  setUsersData,
  setSelectedUser,
  setSocket,
  getOnlineUsers,
} = userSlice.actions;
export default userSlice.reducer;

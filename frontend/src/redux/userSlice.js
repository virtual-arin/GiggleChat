import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  usersData: null,
  onlineUsers: null,
  socket: null,
  selectedUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUsersData: (state, action) => {
      state.usersData = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setUserData,
  setUsersData,
  setOnlineUsers,
  setSocket,
  setSelectedUser,
} = userSlice.actions;
export default userSlice.reducer;

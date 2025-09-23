import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    usersData: null,
    selectedUser: null,
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
  },
});

export const { setUserData, setUsersData, setSelectedUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = {};

export const ProfileSlice = createSlice({
  name: "googleProfile",
  initialState: { value: initialStateValue },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
        state.value = initialStateValue;
      },
  },
});

export const {login,logout} = ProfileSlice.actions

export default ProfileSlice.reducer;
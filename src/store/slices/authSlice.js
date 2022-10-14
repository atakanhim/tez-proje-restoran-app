import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin",
      role: "admin",
    },
    {
      id: 2,
      username: "chef",
      password: "chef",
      role: "chef",
    },
  ],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});
console.log(authSlice);
export const {} = authSlice.actions;

export default authSlice.reducer;

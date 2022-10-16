import { configureStore } from "@reduxjs/toolkit";
import restoranSlice from "./slices/restoranSlice";
import authSlice from "./slices/authSlice";

const store = configureStore({
  reducer: {
    restoran: restoranSlice,
    auth: authSlice,
  },
});

export default store;

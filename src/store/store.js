import { configureStore } from "@reduxjs/toolkit";
import restoranSlice from "./slices/restoranSlice";

const store = configureStore({
  reducer: {
    restoran: restoranSlice,
  },
});

export default store;

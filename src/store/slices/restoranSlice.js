import { createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "@reduxjs/toolkit";
const localMasaNo = Number(sessionStorage.getItem("masaNo")) || null;
const initialState = {
  masaNo: localMasaNo,
  cart: [],
  total: 0,
  user: "admin",
  categories: [],
  currentCategory: "all",
};

const restoranSlice = createSlice({
  name: "restoran",
  initialState,
  reducers: {
    setMasaNo: {
      reducer: (state, action) => {
        return { ...state, masaNo: action.payload };
      },
    },
    setCategories: {
      reducer: (state, action) => {
        return { ...state, categories: action.payload };
      },
    },
    setCurrentCategory: {
      reducer: (state, action) => {
        return { ...state, currentCategory: action.payload };
      },
    },
  },
});
console.log(restoranSlice);
export const { setMasaNo, setCategories, setCurrentCategory } =
  restoranSlice.actions;

export default restoranSlice.reducer;

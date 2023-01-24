import { createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "@reduxjs/toolkit";
const localMasaNo = Number(sessionStorage.getItem("masaNo")) || null;
const user = sessionStorage.getItem("user") || null;
const initialState = {
  masaNo: localMasaNo,
  cart: [],
  total: 0,
  user: user,
  categories: [],
  products: [],
  menus: [],
  currentCategory: "Tüm Ürünler",
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
    setMenus: {
      reducer: (state, action) => {
        return { ...state, menus: action.payload };
      },
    },
    setProducts: {
      reducer: (state, action) => {
        return { ...state, products: action.payload };
      },
    },
    setUser: {
      reducer: (state, action) => {
        return { ...state, user: action.payload };
      },
    },
    addToCart: {
      reducer: (state, action) => {
        return { ...state, cart: action.payload };
      },
    },
  },
});
console.log(restoranSlice);
export const {
  setMasaNo,
  setCategories,
  setCurrentCategory,
  setUser,
  setProducts,
  setMenus,
  addToCart,
} = restoranSlice.actions;

export default restoranSlice.reducer;

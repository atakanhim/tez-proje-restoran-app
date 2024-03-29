import { createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "@reduxjs/toolkit";
const localMasaNo = Number(sessionStorage.getItem("masaNo")) || null;
const user = sessionStorage.getItem("user") || null;
// random masaNo
const random = Math.floor(Math.random() * 1000) + 1;

const initialState = {
  masaNo: localMasaNo || random,
  cart: [],
  total: 0,
  user: user,
  categories: [],
  products: [],
  menus: [],
  orders: [],
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
    setOrders: {
      reducer: (state, action) => {
        return { ...state, orders: action.payload };
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
    clearCart: {
      reducer: (state, action) => {
        return { ...state, cart: [] };
      },
    },
  },
});
console.log(restoranSlice);
export const {
  setMasaNo,
  setOrders,
  setCategories,
  setCurrentCategory,
  setUser,
  setProducts,
  setMenus,
  addToCart,
  clearCart,
} = restoranSlice.actions;

export default restoranSlice.reducer;

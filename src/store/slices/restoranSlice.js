import { createSlice } from "@reduxjs/toolkit";
// import { nanoid } from "@reduxjs/toolkit";
const localMasaNo = Number(sessionStorage.getItem("masaNo")) || null;
const initialState = {
  masaNo: localMasaNo,
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
  },
});
console.log(restoranSlice);
export const { setMasaNo } = restoranSlice.actions;

export default restoranSlice.reducer;

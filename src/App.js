import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Categories, Header, Home, Loading, Login } from "./components";
//import axios
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
//import setCategories
import { setCategories } from "./store/slices/restoranSlice";
import { getCategories } from "./api/api";
import Products from "./components/Admin/Products";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // axios get req
  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = async () => {
    const response = await getCategories();
    dispatch(setCategories(response));
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <div className=" w-screen bg-slate-100 gap-2  flex  flex-col  text-base font-bold  ">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/restoran/table/*" element={<Loading />} />
          <Route path="/admin/categories/*" element={<Categories />} />
          <Route path="/admin/products/*" element={<Products />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

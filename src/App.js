import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Categories, Header, Home, Loading, Login } from "./components";
//import axios
import Axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
//import setCategories
import { setCategories } from "./store/slices/restoranSlice";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // axios get req
  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const response = await Axios.get("http://localhost:5000/api/category");
    console.log(response.data);
    dispatch(setCategories(response.data));
  };
  return (
    <AnimatePresence exitBeforeEnter>
      <div className=" w-screen bg-slate-100 gap-2  flex  flex-col  text-base font-bold   ">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/restoran/table/*" element={<Loading />} />
          <Route path="/admin/categories/*" element={<Categories />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

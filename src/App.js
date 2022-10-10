import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Categories, Header, Home, Loading, Login } from "./components";

import { AnimatePresence } from "framer-motion";

const App = () => {
  const navigate = useNavigate();
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
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

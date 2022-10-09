import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header, Home, Loading, Login } from "./components";

import { AnimatePresence } from "framer-motion";

const App = () => {
  return (
    <AnimatePresence exitBeforeEnter>
      <div className=" w-screen bg-slate-100 gap-2  flex  flex-col  text-base font-bold   ">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Home />} />
          <Route path="/restoran/table/*" element={<Loading />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

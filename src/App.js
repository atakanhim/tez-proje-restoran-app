import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header, Home, Login } from "./components";

import { AnimatePresence } from "framer-motion";
const App = () => {
  return (
    <AnimatePresence exitBeforeEnter>
      <div className=" w-screen bg-slate-600 gap-2  flex  flex-col  text-base font-bold  ">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

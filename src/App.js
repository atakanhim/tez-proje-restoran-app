import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login } from "./components";

import { AnimatePresence } from "framer-motion";
const App = () => {
  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-screen h-screen bg-primary flex justify-center items-center text-base font-bold ">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;

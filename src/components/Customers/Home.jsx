import React from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
var url = window.location.href;
url = url.split("/"); // url aldım ve böldüm
const Home = () => {
  const navigate = useNavigate();
  const { masaNo } = useSelector((state) => state.restoran);

  return (
    <div className="relative w-full h-800 bg-black top-24 text-slate-50">
      Home {masaNo}
    </div>
  );
};

export default Home;

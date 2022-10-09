import React from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const { masaNo } = useSelector((state) => state.restoran);
  React.useEffect(() => {
    // masa numarası zaten state te varsa hiçbişey istemeyecek
    if (sessionStorage.getItem("masaNo") === null) {
      navigate("/restoran/table", { replace: true });
    }
  }, [navigate]);
  return (
    <div className="relative w-full h-800 bg-black top-24 text-slate-50">
      Home {masaNo}
    </div>
  );
};

export default Home;

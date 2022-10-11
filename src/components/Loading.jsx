import React from "react";
// import restoran slice
import { useDispatch } from "react-redux";

import { setMasaNo } from "../store/slices/restoranSlice";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Loading = () => {
  const [loading, setLoading] = React.useState(false);
  const message = useRef(null);

  var url = window.location.href;
  url = url.split("/"); // url aldım ve böldüm
  const masanumara = Number(url[5]); // masa no olarak aldım

  const navigate = useNavigate();
  const dispatch = useDispatch();
  React.useEffect(() => {
    return () => {
      if (sessionStorage.getItem("masaNo") === null) {
        numberControl(masanumara);
      } else {
        // zaten 1 kere masa numarası girildiyse tekrar girmeye gerek yok
        navigate("/", { replace: true });
      }
    };
  }, [masanumara]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        navigate("/", { replace: true });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading, navigate]);

  const numberControl = (masaId) => {
    if (masaId > 0 && isNaN(masaId) === false && masaId < 13) {
      dispatch(setMasaNo(masaId));
      sessionStorage.setItem("masaNo", masaId);

      message.current.innerHTML =
        masaId + " Nolu Masa ile giriş gerçekleeşiyor \n ...";
      setLoading(true);
    } else {
      message.current.innerHTML =
        "Masa numaranız 1-12 arasında olmalıdır \n Lütfen yeni bir numara giriniz";
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0	bg-black w-full h-screen z-20 text-slate-50 flex items-center justify-center">
      <p className="text-lg" ref={message}></p>
    </div>
  );
};

export default Loading;

import React from "react";
import { useEffect } from "react";
import { BsCart2 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import lospolos from "../../img/lospolos.png";
import "./Header.css";

const Header = () => {
  // reducers
  const { masaNo, cart, total, user } = useSelector((state) => state.restoran);
  // local states
  const [menuOpen, setMenuOpen] = React.useState(false); // hamburger menu
  const [showHeader, setShowHeader] = React.useState(true); // search bar

  useEffect(() => {
    if (user === "musteri") {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  }, [user]);

  //hamburge menu bitiş

  return (
    <div
      className={
        showHeader ? "fixed flex z-10 w-full h-16  bg-[#2e2e2efb]" : "hidden"
      }
    >
      <div className="flex w-full h-full items-center justify-between ">
        <div
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="menu-btn__burger"></div>
        </div>

        <NavLink to={"/"}>
          <img src={lospolos} alt="logo" className=" customlogo" />
        </NavLink>

        <div className="sepetLogo">
          {/* aynı zamanda açılır menu olacak */}
          {cart.length > 0 ? (
            <p className=" text-sm text-white font-semibold ">{cart.length}</p>
          ) : (
            <p>0</p>
          )}

          <p>₺{total}</p>
          <BsCart2 className="text-lg md:text-2xl" />
        </div>
      </div>
      <ul className={`menu-btn__links ${menuOpen ? "open" : ""}`}>
        <li className={`menu-btn__link active`}>menu1</li>
      </ul>
      {/* for mobile : h-screen */}
    </div>
  );
};

export default Header;

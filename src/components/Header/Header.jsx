import React from "react";
import { BsCart2 } from "react-icons/bs";
import { NavLink } from "react-router-dom";

import lospolos from "../../img/lospolos.png";
import "./Header.css";

const Header = () => {
  // reducers

  // local states
  const [menuOpen, setMenuOpen] = React.useState(false); // hamburger menu

  //hamburge menu bitiş

  return (
    <div className="fixed flex z-10 w-full h-16  bg-[#2e2e2efb]">
      {/* for pc : h-screen */}
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

          <p className="text-sm text-white font-semibold">12</p>

          <p>₺12</p>
          <BsCart2 className="text-xl md:text-2xl" />
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

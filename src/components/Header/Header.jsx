import React from "react";
import { useEffect } from "react";
import { BsCart2 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentCategory } from "../../store/slices/restoranSlice";

import lospolos from "../../img/lospolos.png";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();

  // global states
  const { masaNo, cart, total, user, categories, currentCategory } =
    useSelector((state) => state.restoran);

  // local states
  const [menuOpen, setMenuOpen] = React.useState(false); // hamburger menu
  const [showHeader, setShowHeader] = React.useState(true); // search bar

  // this.url
  var url = window.location.href;
  url = url.split("/"); // url aldım ve böldüm
  useEffect(() => {
    if (url[3] === "admin") {
      setShowHeader(true);
    } else {
      setShowHeader(true);
    }
  }, [url]);

  //hamburge menu bitiş
  const changeCategory = (category) => {
    if (category === currentCategory) {
      dispatch(setCurrentCategory("all"));
    } else {
      dispatch(setCurrentCategory(category));
    }
  };
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
        {categories.length > 0 &&
          categories.map((category) => (
            <li
              key={category._id}
              className={`menu-btn__link ${
                currentCategory === category.category_name ? "active" : ""
              }`}
              onClick={() => changeCategory(category.category_name)}
            >
              <NavLink to={`/category/${category._id}`}>
                {category.category_name}
              </NavLink>
            </li>
          ))}
      </ul>
      {/* for mobile : h-screen */}
    </div>
  );
};

export default Header;

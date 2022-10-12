import React from "react";
import { useEffect } from "react";
import { BsCart2 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentCategory } from "../../store/slices/restoranSlice";
import { useNavigate } from "react-router-dom";
import lospolos from "../../img/lospolos.png";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // global states
  const { masaNo, cart, total, user, categories, currentCategory } =
    useSelector((state) => state.restoran);

  // local states
  const [menuOpen, setMenuOpen] = React.useState(false); // hamburger menu

  const [showAdminBar, setShowAdminBar] = React.useState(false); // search bar

  // this.url
  var url = window.location.href;
  url = url.split("/"); // url aldım ve böldüm
  useEffect(() => {
    if (user === "admin") {
      setShowAdminBar(true);
    } else {
      setShowAdminBar(false);
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
  const changePage = (page) => {
    navigate(page, { replace: true });
  };

  return (
    <div className={"fixed flex z-10 w-full h-16  bg-[#2e2e2efb]"}>
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
              onClick={() => {
                changeCategory(category.category_name);
                changePage(`/category/${category._id}`);
              }}
            >
              <p>{category.category_name}</p>
            </li>
          ))}

        <hr className="mt-3" />
        {showAdminBar ? (
          <>
            <li
              className={`menu-btn__link ${
                currentCategory === "kategoriler" ? "active" : ""
              }`}
              onClick={() => {
                changeCategory("kategoriler");
                changePage("/admin/categories");
              }}
            >
              <p>Kategori Paneli</p>
            </li>
            <li
              className={`menu-btn__link ${
                currentCategory === "urunler" ? "active" : ""
              }`}
              onClick={() => {
                changeCategory("urunler");
                changePage("/admin/products");
              }}
            >
              <p className="w-full h-full text-6xl">Ürün Paneli</p>
            </li>
          </>
        ) : (
          <></>
        )}
      </ul>
      {/* for mobile : h-screen */}
    </div>
  );
};

export default Header;

import React, { useEffect } from "react";
import "./Footer.css";

import { deepPurple } from "@mui/material/colors";

import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const navigate = useNavigate();
  const changePage = (page) => {
    navigate(page, { replace: true });
  };
  const customPurple = deepPurple[600]; // renge benzer bulduk
  // menu styles
  const activeStyle = {
    fontSize: 50,
    color: customPurple,
    borderBottom: "3px solid purple",
    radius: "50%",
    padding: "5px",
    TransitionEvent: "all 0.5s ease",
    duration: "500ms",
  };
  const deActiveStyle = {
    fontSize: 35,
    color: "gray",
    TransitionEvent: "all 0.5s ease",
    duration: "500ms",
  };
  const activeShoppingCartStyle = {
    ...deActiveStyle,
    color: "yellow",
    fontSize: 35,
  };
  const deactiveShoppingCartStyle = {
    ...deActiveStyle,
    color: "white",
    fontSize: 30,
  };

  var shoppingCartStyle;
  var homeStyle;
  var historyStyle;

  switch (window.location.pathname) {
    case "/":
      shoppingCartStyle = deactiveShoppingCartStyle;
      homeStyle = activeStyle;
      historyStyle = deActiveStyle;
      break;
    case "/Orders":
      shoppingCartStyle = deactiveShoppingCartStyle;
      homeStyle = deActiveStyle;
      historyStyle = activeStyle;
      break;
    case "/Cart":
      shoppingCartStyle = activeShoppingCartStyle;
      homeStyle = deActiveStyle;
      historyStyle = deActiveStyle;
      break;
    default:
      shoppingCartStyle = deactiveShoppingCartStyle;
      homeStyle = deActiveStyle;
      historyStyle = deActiveStyle;
      break;
  }
  const { cart } = useSelector((state) => state.restoran);

  return (
    <div className=" w-full sm:w-[425px] flex items-center flex-row  h-20 pt-4 bg-slate-100 bottom-0 fixed">
      <div className="flex relative flex-row w-full h-full justify-between  items-center bg-white ">
        <div className="flex flex-col w-1/3 h-full justify-center items-center ">
          <HomeIcon
            className="flex flex-row  justify-center items-center  "
            style={homeStyle}
            onClick={() => changePage("/")}
          />
        </div>
        <div className="relative flex flex-col w-16 h-16  justify-center items-center">
          <div
            className=" flex items-center justify-center w-full h-full rounded-full border-4 border-slate-100 bg-purple-600 absolute bottom-4 "
            onClick={() => changePage("/Cart")}
          >
            <p className="absolute bottom-10 right-4 text-xs text-white">
              {cart.length < 9 ? cart.length : "9+"}
            </p>
            <ShoppingCartIcon
              className="flex flex-row w-full h-full justify-center items-center"
              style={shoppingCartStyle}
            />
          </div>
        </div>

        <div className="flex flex-col w-1/3 h-full justify-center items-center">
          <HistoryIcon
            className="flex flex-row w-1/2 h-full justify-center items-center"
            style={historyStyle}
            onClick={() => changePage("/Orders")}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;

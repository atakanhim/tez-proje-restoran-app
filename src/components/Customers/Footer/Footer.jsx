import React from "react";
import "./Footer.css";

import { deepPurple } from "@mui/material/colors";

import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const Footer = () => {
  const customPurple = deepPurple[600]; // renge benzer bulduk
  const activeStyle = {
    fontSize: 50,
    color: customPurple,
    fontWeight: "italic",
    borderBottom: "3px solid purple",
    radius: "50%",
    padding: "5px",
  };
  const deActiveStyle = {
    fontSize: 35,
    color: "gray",
    fontWeight: "italic",
  };

  const shoppingCartStyle = {
    fontSize: 30,
    color: "white",
    fontWeight: "italic",
  };
  const homeStyle = activeStyle;
  const historyStyle = deActiveStyle;

  return (
    <div className=" flex items-center flex-row w-full h-20 pt-4 bg-slate-100 bottom-0 fixed">
      <div className="flex relative flex-row w-full h-full justify-between  items-center bg-white ">
        <div className="flex flex-col w-1/3 h-full justify-center items-center ">
          <HomeIcon
            className="flex flex-row  justify-center items-center  "
            style={homeStyle}
          />
        </div>
        <div className="relative flex flex-col w-16 h-16  justify-center items-center">
          <div className=" flex items-center justify-center w-full h-full rounded-full border border-purple-500 bg-purple-600 absolute bottom-4 ">
            <p className="absolute bottom-11 right-4 text-xs text-white">0</p>
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
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;

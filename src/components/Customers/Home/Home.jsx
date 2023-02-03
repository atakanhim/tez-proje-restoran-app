import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddToCart from "../../CustomCarts/AddToCart";
import "./Home.css";

const Home = () => {
  const { masaNo, currentCategory, products, categories, menus } = useSelector(
    (state) => state.restoran
  );
  const navigate = useNavigate();

  const handleProductDetail = (product) => {
    navigate("/add-to-cart/" + product._id);
  };
  const handleMenuDetail = (menu) => {
    navigate("/add-to-cart-for-menus/" + menu._id);
  };

  return (
    <div className="  w-full bg-white flex items-center flex-col gap-3 mb-[110px] p-3  ">
      {/* menuler listeleniyor */}
      <div className="flex flex-col w-full px-5">
        <p className="text-xl text-slate-400 ml-5">Menuler</p>
        {menus.map((menu) => {
          return (
            <div
              className="flex flex-col  border-b border-b-gray-400  w-full hover:scale-105   transition duration-500 ease-in-out "
              onClick={() => handleMenuDetail(menu)}
              key={menu._id}
            >
              <div className="flex flex-row h-28 justify-center w-full  py-1 px-6 items-center gap-4">
                <div className=" flex justify-center  flex-col   w-4/5 h-full">
                  <h1 className="text-sm font-bold">{menu.menu_name}</h1>
                  <h1 className="text-xs font-bold text-textColor w-4/5 h-9 overflow-hidden">
                    {menu.menu_burger_selection.map((burger) => {
                      return burger[0] + " + ";
                    })}
                    {menu.menu_cips_selection.map((burger) => {
                      return burger[0] + " + ";
                    })}
                    {menu.menu_drink_selection.map((burger) => {
                      return burger[0] + " + ";
                    })}
                  </h1>
                  <h1 className="text-xs mt-3">{menu.menu_price} TL</h1>
                </div>
                <div className=" flex justify-center items-center flex-col hover:scale-110 transform transition duration-500 ease-in-out  w-1/5 h-3/5">
                  <img
                    src={menu.menu_image}
                    alt="uploaded"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* kategoriler listeleniyor */}
      <div className="flex flex-col justify-between w-full  h-1/2 gap-5 px-5">
        {categories.map((category) => {
          return (
            <div key={category._id} className="flex flex-col">
              <p className="text-xl text-slate-400 ml-5">
                {category.category_name}
              </p>
              {products.map(
                (product) =>
                  product.product_category === category.category_name && (
                    <div
                      className="flex flex-col  border-b border-b-gray-400  w-full hover:scale-105   transition duration-500 ease-in-out "
                      onClick={() => handleProductDetail(product)}
                      key={product._id}
                    >
                      <div className="flex flex-row h-28 justify-center w-full  py-1 px-6 items-center gap-4">
                        <div className=" flex justify-center  flex-col   w-4/5 h-full">
                          <h1 className="text-sm font-bold">
                            {product.product_name}
                          </h1>
                          <h1 className="text-xs font-bold text-textColor w-4/5 h-9 overflow-hidden">
                            {product.product_description}
                          </h1>
                          <h1 className="text-xs mt-3">
                            {product.product_price} TL
                          </h1>
                        </div>
                        <div className=" flex justify-center items-center flex-col hover:scale-110 transform transition duration-500 ease-in-out  w-1/5 h-3/5">
                          <img
                            src={product.product_image}
                            alt="uploaded"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

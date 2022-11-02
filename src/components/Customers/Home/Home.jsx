import React from "react";
import { useState } from "react";

import { useSelector } from "react-redux";
import AddToCart from "../../CustomCarts/AddToCart";

const Home = () => {
  const { masaNo, currentCategory, products } = useSelector(
    (state) => state.restoran
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleProductDetail = (product) => {
    console.log(product);
    setSelectedProduct(product);
  };

  return (
    <div className="  w-full mt-16 bg-gray-300 flex flex-col gap-3 items-center  ">
      <div className="flex flex-col  text-yellow-600  items-center w-full">
        <h1 className="text-5xl font-bold">Masa No: {masaNo}</h1>
        <h1 className="text-5xl font-bold">Kategori: {currentCategory}</h1>
      </div>
      <div className="flex flex-col items-center justify-between w-full md:w-1/2 h-1/2 gap-1 p-1">
        {/* URUNLER BURADA LISTELENECEK DİKEY OLARAK SOLDA KUCUK FOFOTGRAF SAG TARAFTAÜRÜN FİYATI */}
        {products.map((products) => (
          <div
            className="flex flex-col  border-2 border-b-gray-400 rounded-lg w-full hover:scale-105  transform transition duration-500 ease-in-out "
            onClick={() => handleProductDetail(products)}
            key={products.product_id}
          >
            <div className="flex flex-row h-28 justify-center w-full  py-1 px-6 items-center gap-4">
              <div className=" flex justify-center  flex-col   w-4/5 h-full">
                <h1 className="text-sm font-bold">{products.product_name}</h1>
                <h1 className="text-xs font-bold text-textColor w-4/5 h-9 overflow-hidden">
                  {products.product_description}
                </h1>
                <h1 className="text-xs mt-3">{products.product_price} TL</h1>
              </div>
              <div className=" flex justify-center items-center flex-col hover:scale-110 transform transition duration-500 ease-in-out  w-1/5 h-full">
                <img
                  src={products.product_image}
                  alt="uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddToCart
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </div>
  );
};

export default Home;

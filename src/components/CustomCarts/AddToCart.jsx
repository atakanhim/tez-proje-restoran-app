import React from "react";
import { useState } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import Button from "@mui/material/Button";
const AddToCart = ({ selectedProduct, setSelectedProduct }) => {
  const [urunNotu, setUrunNotu] = useState("");
  const [urunAdet, setUrunAdet] = useState(1);
  const inCrease = () => {
    setUrunAdet(urunAdet + 1);
  };
  const deCrease = () => {
    if (urunAdet > 1) {
      setUrunAdet(urunAdet - 1);
    }
  };
  const addToCartButton = () => {};
  const closeWindow = () => {
    setSelectedProduct(null);
  };
  return (
    <>
      {selectedProduct && (
        <div className="absolute  top-0 left-0 flex w-full min-h-screen items-center justify-center h-auto z-50 bg-slate-100 ">
          <div className="flex flex-col p-1 w-full items-center gap-2 md:w-1/2">
            <div className="flex   absolute left-0 top-0 p-3">
              <ClearOutlinedIcon
                onClick={closeWindow}
                className="cursor-pointer hover:scale-105 transform transition-all ease-in-out duration-300"
              />
            </div>
            <div className="relative flex w-full h-56 p-6">
              <img
                src={selectedProduct.product_image}
                alt="uploaded"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col w-full px-3 ">
              <div className="flex flex-row p-2 items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {selectedProduct.product_name}
                </h1>
                <h1 className="text-lg font-semibold to-textColor">
                  {selectedProduct.product_price} TL
                </h1>
              </div>
              <h1 className="text-sm font-bold p-2 text-textColor w-4/5 h-9 overflow-hidden">
                aciklama{selectedProduct.product_description}
              </h1>
            </div>
            <div className="relative flex flex-col mt-auto p-2 h-60   w-full">
              <h1 className="text-lg font-bold">Ürün Notu</h1>
              <textarea
                onChange={(e) => setUrunNotu(e.target.value)}
                className="w-full mt-3 h-full border border-slate-600 p-2"
                placeholder="Ürünle ilgili bilgi yazabilirsiniz."
                maxLength={250}
              ></textarea>
              <h4 className="text-xs text-textColor ml-auto mr-4 mt-1">
                {urunNotu.length}/250
              </h4>
            </div>
            <div className="flex flex-row p-2 mt-auto  gap-2 h-20 w-full border border-t-slate-400 ">
              <div className="flex flex-row items-center justify-center  w-1/2 h-full py-2 px-3 md:px-12">
                <Button
                  onClick={addToCartButton}
                  variant="contained"
                  className="w-full h-full"
                >
                  Sepete Ekle
                </Button>
              </div>

              <div className="flex flex-row items-center justify-between p-3 w-1/2 h-full ">
                <RemoveCircleOutlinedIcon
                  onClick={deCrease}
                  color={`${urunAdet > 1 ? "primary" : "disabled"}`}
                  className="animate-pulse cursor-pointer  h-14 hover:scale-105 transform transition-all ease-in-out duration-300"
                />

                <div className=" w-10 h-10  rounded-full flex items-center justify-center">
                  <h1 className=" text-2xl font-smallbold">{urunAdet}</h1>
                </div>
                <AddCircleOutlinedIcon
                  color="primary"
                  onClick={inCrease}
                  className="animate-pulse cursor-pointer  h-14 hover:scale-105 transform transition-all ease-in-out duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;

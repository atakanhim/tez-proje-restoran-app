import React from "react";
import { useState } from "react";

const AddToCard = ({ selectedProduct }) => {
  const [urunNotu, setUrunNotu] = useState("");
  const [urunAdet, setUrunAdet] = useState(1);
  return (
    <div className="absolute top-0 left-0 flex w-full min-h-screen h-auto z-50 bg-slate-100">
      <div className="flex flex-col p-1 w-full items-center gap-2">
        <div className="relative flex w-full h-56 p-6  ">
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
        <div className="relative flex flex-col mt-auto p-2 h-64   w-full">
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
        <div className="flex flex-row p-2 mt-auto gap-2 h-24 w-full border border-t-slate-400 ">
          <button className="flex flex-row items-center justify-center border border-slate-400 rounded-xl w-1/2 h-full hover:bg-slate-600 hover:text-white transition duration-500 ease-in-out">
            <h1 className="text-lg font-bold">Sepete Ekle</h1>
          </button>
          <div className="flex flex-row items-center justify-between p-3 w-1/2 h-full ">
            <div className="bg-gray-500 w-10 h-10  rounded-full flex items-center justify-center">
              <h1 className=" text-2xl font-smallbold">-</h1>
            </div>
            <div className=" w-10 h-10  rounded-full flex items-center justify-center">
              <h1 className=" text-2xl font-smallbold">{urunAdet}</h1>
            </div>
            <div className="bg-red-500 w-10 h-10  rounded-full flex items-center justify-center">
              <h1 className=" text-2xl font-smallbold">+</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCard;

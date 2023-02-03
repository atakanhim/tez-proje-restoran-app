import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrders, clearCart } from "../../../store/slices/restoranSlice";
import { useSelector } from "react-redux";

import { getOrdersFromDB, addOrderDB } from "../../../api/api";

import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { useEffect } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const { products, categories, menus, cart, masaNo } = useSelector(
    (state) => state.restoran
  );
  const cartTotal = cart.reduce((total, item) => {
    return (total += item.siparisToplamTutar);
  }, 0);

  const refreshOrdersFunction = async () => {
    const response = await getOrdersFromDB(); // apiden gelen verileri response değişkenine atadık
    dispatch(setOrders(response)); // response değişkenini global state e atadık
  };

  const setOrderDbFunction = async () => {
    const order = {
      orderTableNo: masaNo,
      orderStatus: "Restoran Onayı Bekleniyor",
      orderTotalPrice: cartTotal,
      orderProducts: cart,
      orderDate: new Date(),
    };
    // eslint-disable-next-line no-unused-vars
    const response = await addOrderDB(order);

    dispatch(clearCart());
    alertify.success("siparis verildi takip ekranından takip edebilirsiniz");
    refreshOrdersFunction();
  };
  const addOrder = () => {
    setOrderDbFunction();
    console.log("siparis verildi");
  };

  return (
    <div className="">
      {cart.length > 0 ? (
        cart.map((item) => (
          <div
            key={item.__id}
            className="relative border border-black p-5 flex flex-col items-start justify-center"
          >
            <h1>ad: {item.urunAdi}</h1>
            <h1>fiyat: {item.urunFiyat}</h1>
            <h1>adet: {item.urunAdet}</h1>
            <h1>not: {item.urunNotu}</h1>
            <h4>total: {item.siparisToplamTutar}</h4>
          </div>
        ))
      ) : (
        <h1>Sepet bos , masa no : {masaNo} </h1>
      )}
      <h1>Toplam Tutar : {cartTotal}</h1>
      <button
        className="border-4 bg-green-300 text-black border-green-600"
        onClick={addOrder}
      >
        Sipariş ver
      </button>
    </div>
  );
};

export default Cart;

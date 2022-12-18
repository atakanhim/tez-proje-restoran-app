import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector((state) => state.restoran);
  // get masa no code
  const { masaNo } = useSelector((state) => state.restoran);
  const cartTotal = cart.reduce((total, item) => {
    return (total += item.siparisToplamTutar);
  }, 0);
  useEffect(() => {
    console.log(cart);
  }, []);

  return (
    <div>
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
      <button className="border-4 bg-green-300 text-black border-green-600">
        Sipariş ver
      </button>
    </div>
  );
};

export default Cart;

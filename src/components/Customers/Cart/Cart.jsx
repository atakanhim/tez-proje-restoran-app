import React from "react";
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector((state) => state.restoran);

  return (
    <div>
      {cart.map((item) => (
        <div key={item.__id}>
          <h1>{item.urunAdi}</h1>
          <h1>{item.product_price}</h1>
          <h1>{item.urunFiyat}</h1>
          <h1>{item.urunAdet}</h1>
          <h1>{item.urunNotu}</h1>
        </div>
      ))}
    </div>
  );
};

export default Cart;

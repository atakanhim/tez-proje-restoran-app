import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersFromDB } from "../../../api/api";
import { setOrders } from "../../../store/slices/restoranSlice";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Button } from "@mui/material";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          style={{ color: "red" }}
        />
      </Box>
    </Box>
  );
}

const Orders = () => {
  const dispatch = useDispatch();
  const { masaNo, currentCategory, orders, products } = useSelector(
    (state) => state.restoran
  );
  const [progresValue, setProgresValue] = useState(0);

  const Yenile = async () => {
    const response = await getOrdersFromDB(); // veritabanından kategorileri çekiyoruz

    dispatch(setOrders(response));
  };

  const setValuefunction = (status) => {
    if (status === "Restoran Onayı Bekleniyor") {
      return 0;
    } else if (status === "Sipariş Hazırlanıyor") {
      return 33;
    } else if (status === "Sipariş Hazır") {
      return 66;
    } else if (status === "Sipariş Teslim Edildi") {
      return 100;
    } else {
      return 0;
    }
  };

  return (
    <div className="flex flex-col gap-5 p-3 items-center w-full h-auto ">
      <h1 className="flex gap-6 p-2 text-lg">SİPARİŞLERİM</h1>
      <Button variant="contained" onClick={Yenile}>
        Yenile
      </Button>

      {orders.map(
        (item) =>
          item.orderTableNo === masaNo && (
            // item.orderStatus !== "Sipariş Teslim Edildi" && (
            <div
              key={item._id}
              className="w-full h-auto border border-purple-600 p-3"
            >
              <div>
                <p className="text-xs">{item.orderStatus}</p>
                <Box sx={{ width: "100%", color: "grey.500" }}>
                  <LinearProgressWithLabel
                    value={setValuefunction(item.orderStatus)}
                    color="secondary"
                  />
                </Box>
              </div>
              <div className="flex  w-full  p-1 mt-1 items-center justify-between ">
                <p className="flex mr-1 text-sm">Toplam Fiyat</p>
                <p className="flex mr-1 text-xs">{item.orderTotalPrice} ₺</p>
              </div>

              <div className="flex flex-col border border-gray-300 w-full min-h-36 h-auto p-1">
                <p className="flex  text-xs ">Sipariş içerigi; </p>
                <div className="flex flex-col gap-1 w-full p-2 ">
                  {item.orderProducts.map((item) => (
                    <div
                      key={item.__id}
                      className=" gap-1 flex flex-col rounded-lg border-y border-y-purple-600  "
                    >
                      <p className="text-xs w-full p-1 ">
                        - Urun adi: {item.urunAdi}
                      </p>
                      <p className="text-xs  w-full p-1">
                        - Cikarilacak Malzemeler: {item.istenmeyenMalzemeler}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
      )}

      <span className="relative w-full border border-gray-300 mb-16"></span>
    </div>
  );
};

export default Orders;

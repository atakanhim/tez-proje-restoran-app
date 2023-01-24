import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOrders } from "../../../store/slices/restoranSlice";
import alertify from "alertifyjs";
import {
  getOrdersFromDB,
  deleteOrderDB,
  addOrderDB,
  deleteAllOrdersDB,
  updateOrderDB,
} from "../../../api/api";
import { useEffect } from "react";
import { Button } from "@mui/material";
const OrderControl = () => {
  const { masaNo, currentCategory, orders, products } = useSelector(
    (state) => state.restoran
  );
  const dispatch = useDispatch();

  const siparisOnayla = (id) => {
    let btn = document.getElementById(id);

    let order = orders.find((item) => item._id === id);
    if (order.orderStatus === "Restoran Onayı Bekleniyor") {
      order = { ...order, orderStatus: "Sipariş Hazırlanıyor" };
      updateOrderFunction(order);
      alertify.success("Sipariş Onaylandı");

      // btn value
      btn.innerHTML = "Sipariş Hazırlandı";
    } else if (order.orderStatus === "Sipariş Hazırlanıyor") {
      order = { ...order, orderStatus: "Sipariş Hazır" };
      updateOrderFunction(order);
      alertify.success("Sipariş Hazırlandı");

      btn.innerHTML = "Teslim Et";
    } else if (order.orderStatus === "Sipariş Hazır") {
      order = { ...order, orderStatus: "Sipariş Teslim Edildi" };
      updateOrderFunction(order);
      alertify.success("Sipariş Teslim Edildi");

      btn.innerHTML = "Sipariş Teslim Edildi";
      btn.disabled = true;
      btn.classList.add("opacity-0");
    }
  };

  const reloadOrders = async () => {
    const response = await getOrdersFromDB(); // veritabanından kategorileri çekiyoruz

    dispatch(setOrders(response));
  };

  const updateOrderFunction = async (values) => {
    updateOrderDB(values)
      .then((res) => {
        reloadOrders();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const orderProducts = (order) => {
    let dizi = [];
    let orderProducts = order.orderProducts.map((item) => {
      dizi.push(item.urunAdet + " Adet " + item.urunAdi + " /");
    });

    return dizi;
  };
  const orderStatus = (order) => {
    return (
      <>
        <p className="flex   ">{order.orderStatus} </p>

        <Button
          variant="outlined"
          id={order._id}
          onClick={() => siparisOnayla(order._id)}
          color="success"
          style={{
            width: "80%",

            textAlign: "center",
            hover: "none",
            borderColor: "green",
            marginBottom: "10px",
            marginTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "5px",
            paddingBottom: "5px",
            display: setButtonsValue(order) === "kapat" ? "none" : "block",
          }}
        >
          {setButtonsValue(order)}
        </Button>
      </>
    );
  };

  const notlar = (order) => {
    let dizi = [];
    let orderProducts = order.orderProducts.map((item) => {
      dizi.push(item.urunNotu + " /");
    });

    return dizi;
  };

  const istenmeyenMalzemeler = (order) => {
    let dizi = [];
    let orderProducts = order.orderProducts.map((item) => {
      dizi.push(item.istenmeyenMalzemeler + " /");
    });

    return dizi;
  };
  const setButtonsValue = (order) => {
    let text = "";
    if (order.orderStatus === "Restoran Onayı Bekleniyor") {
      text = "Sipariş Onayla";
    } else if (order.orderStatus === "Sipariş Hazırlanıyor") {
      text = "Sipariş Hazırlandı";
    } else if (order.orderStatus === "Sipariş Hazır") {
      text = "Sipariş Teslim Edildi";
    } else if (order.orderStatus === "Sipariş Teslim Edildi") {
      text = "kapat";
    }

    return text;
  };

  const detaylar = (order) => {};

  useEffect(() => {
    reloadOrders();
  }, []);

  return (
    <>
      <TableContainer component={Paper} className="mt-20">
        <Button
          variant="outlined"
          onClick={reloadOrders}
          style={{
            marginLeft: "90%",
            marginBottom: "10px",
            marginTop: "10px",
            paddingLeft: "15px",
            paddingRight: "15px",
            paddingTop: "5px",
            paddingBottom: "5px",
          }}
        >
          Yenile
        </Button>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Masa No</TableCell>
              <TableCell>Siparis Durumu</TableCell>
              <TableCell align="right">Sipariş Menusu</TableCell>
              <TableCell align="right">İstenmeyen İçerikler</TableCell>

              <TableCell align="right">Not</TableCell>
              <TableCell align="right">Fiyat&nbsp;(TL)</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">{order.orderTableNo}</TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  className="flex items-center justify-center w-[250px] gap-3  p-3"
                >
                  {orderStatus(order)}
                </TableCell>

                <TableCell align="right" className="w-[250px]">
                  {" "}
                  {orderProducts(order)}
                </TableCell>
                <TableCell align="right" className="w-[250px]">
                  {istenmeyenMalzemeler(order)}
                </TableCell>
                <TableCell align="right" className="w-[250px]">
                  {" "}
                  {notlar(order)}
                </TableCell>
                <TableCell align="right">{order.orderTotalPrice}</TableCell>
                <TableCell align="right" className="w-[250px]">
                  <span
                    className="w-12 h-10 border border-red-300 rounded-lg p-3 ml-9 ease-in-out  hover:cursor-pointer transition-all duration-150  hover:border-2 hover:border-red-500   "
                    onClick={() => {
                      deleteOrderDB(order._id)
                        .then((res) => {
                          reloadOrders();
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Sil
                  </span>

                  <span
                    className="w-12 h-10 border border-blue-300 rounded-lg p-3 ml-9 hover:cursor-pointer ease-in-out transition-all duration-150  hover:border-2 hover:border-blue-500   "
                    onClick={() => {
                      detaylar(order);
                    }}
                  >
                    Detaylar
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderControl;

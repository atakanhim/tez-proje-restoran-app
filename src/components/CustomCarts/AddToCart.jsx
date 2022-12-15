import React from "react";
import { useState, useEffect } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import Button from "@mui/material/Button";
import "./AddToCart.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { addToCart } from "../../store/slices/restoranSlice";
import alertify from "alertifyjs";

const AddToCart = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [urunNotu, setUrunNotu] = useState("");
  const [urunAdet, setUrunAdet] = useState(1);
  const { products, categories, cart } = useSelector((state) => state.restoran);
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_content: "",
    product_category: "",
    product_image: "",
    _id: "",
  });
  const [productContentArray, setProductContentArray] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  //get id from url

  const handleDelete = (item) => {
    const newProductContentArray = productContentArray.filter(
      (content) => content !== item
    );
    setProductContentArray(newProductContentArray);
    setDeletedItems([...deletedItems, item]);
  };

  const handleAdd = (item) => {
    setProductContentArray([...productContentArray, item]);
    const newDeletedItems = deletedItems.filter((content) => content !== item);
    setDeletedItems(newDeletedItems);
  };

  useEffect(() => {
    initSetProduct();
    setShow(true);
    window.scrollTo(0, 0);
  }, [products, id]);

  const initSetProduct = () => {
    const product = products.find((item) => item._id === id);
    setProduct({
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: product.product_price,
      product_category: product.product_category,
      product_image: product.product_image,
      product_content: product.product_content,
      _id: product._id,
    });
    var productContentArrayI = product.product_content.split(",");
    setProductContentArray(productContentArrayI);
  };
  const inCrease = () => {
    setUrunAdet(urunAdet + 1);
  };
  const deCrease = () => {
    if (urunAdet > 1) {
      setUrunAdet(urunAdet - 1);
    }
  };
  const addToCartButton = () => {
    const urun = {
      __id: Math.random(),
      urunId: product._id,
      urunAdi: product.product_name,
      urunFiyat: product.product_price,
      urunAdet: urunAdet,
      urunNotu: urunNotu,
    };
    if (deletedItems.length > 0) {
      urun.urunNotu =
        urun.urunNotu + " Çıkarılacak Malzemeler : " + deletedItems.join(", ");
    }

    var newCart = [...cart, urun];
    dispatch(addToCart(newCart));
    alertify.success(urun.urunAdi + " Sepete Eklendi");
    closeWindow();
  };
  const closeWindow = () => {
    // go back to previous window code
    setShow(false);
    // window.history.back();
    window.history.go(-1);
  };
  return (
    <>
      <div
        className={`relative flex w-full  items-center justify-center h-screen mb-32  transition-all duration-500 ease-in-out  ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col p-1 w-full items-center gap-2 md:w-1/2">
          <div
            className="flex  left-0 top-0 p-3 z-50 fixed"
            onClick={closeWindow}
          >
            <ClearOutlinedIcon className="cursor-pointer hover:scale-105 transform transition-all ease-in-out" />
          </div>
          <div className="relative flex w-full h-56 p-6">
            <img
              src={product.product_image}
              alt="uploaded"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full px-3 ">
            <div className="flex flex-row p-2 items-center justify-between">
              <h1 className="text-2xl font-bold">{product.product_name}</h1>
              <h1 className="text-lg font-semibold to-textColor">
                {product.product_price} TL
              </h1>
            </div>
            <h1 className="text-xs flex font-bold p-2 text-textColor w-4/5 h-auto overflow-hidden">
              {product.product_description}
            </h1>
          </div>
          {product.product_category === "Burgerler" && (
            <div className="relative flex flex-col mt-auto  h-auto p-4   w-full">
              <h1 className="text-lg font-bold ">Ürün İçindekiler</h1>
              <ul className="flex  p-2 gap-2 flex-wrap flex-grow flex-row w-full h-auto  ">
                {productContentArray.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleDelete(item);
                    }}
                    className="transition-all ease-in-out duration-500 p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-green-500"
                  >
                    <h1 className="text-xs font-bold m-auto">{item}</h1>
                    <h1 className="text-xs  m-auto">
                      <CloseIcon fontSize="xs" />
                    </h1>
                  </li>
                ))}
                {deletedItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleAdd(item);
                    }}
                    className="transition-all ease-in-out duration-500 relative p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-red-600"
                  >
                    <h1 className="text-xs font-bold m-auto">{item}</h1>
                    <h1 className=" m-auto">
                      <CloseIcon fontSize="xs" />
                    </h1>
                    <p className="absolute w-full opacity-40 top-5 rotate-[20deg] left-0 border border-red-500 "></p>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                className=" cursor-pointer  h-14 hover:scale-105 transform transition-all ease-in-out duration-300"
              />

              <div className=" w-10 h-10  rounded-full flex items-center justify-center">
                <h1 className=" text-2xl font-smallbold">{urunAdet}</h1>
              </div>
              <AddCircleOutlinedIcon
                color="primary"
                onClick={inCrease}
                className="cursor-pointer  h-14 transform transition-all ease-in-out duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCart;

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
import { current } from "@reduxjs/toolkit";

const AddToCartForMenus = () => {
  const params = useParams();
  const { id } = params;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const [menuNotu, setMenuNotu] = useState("");
  const [menuAdet, setMenuAdet] = useState(1);
  const [menuSoslar, setMenuSoslar] = useState({
    menu_sos1: "",
    menu_sos2: "",
  });

  const { products, categories, cart, menus } = useSelector(
    (state) => state.restoran
  );
  const [menu, setMenu] = useState({
    menu_name: "",
    menu_burger_selection: [],
    menu_snacks_selection: [],
    menu_drink_selection: [],
    menu_cips_selection: [],
    menu_sauce_selection: [],
    menu_price: "",
    menu_image: "",
    _id: "",
  });

  // burger icindei seceneklerin bilgileri alınıyor
  const [productContentArray, setProductContentArray] = useState([]);
  const [productContentArray2, setProductContentArray2] = useState([]);
  const [productContentArray3, setProductContentArray3] = useState([]);
  const [productContentArray4, setProductContentArray4] = useState([]);

  const [deletedItems, setDeletedItems] = useState([]);
  const [deletedItems2, setDeletedItems2] = useState([]);
  const [deletedItems3, setDeletedItems3] = useState([]);
  const [deletedItems4, setDeletedItems4] = useState([]);

  // item silme islemi
  const handleDelete = (item, i) => {
    switch (i) {
      case 0:
        const newProductContentArray = productContentArray.filter(
          (content) => content !== item
        );
        setProductContentArray(newProductContentArray);
        setDeletedItems([...deletedItems, item]);
        break;

      case 1:
        const newProductContentArray1 = productContentArray2.filter(
          (content) => content !== item
        );
        setProductContentArray2(newProductContentArray1);
        setDeletedItems2([...deletedItems2, item]);
        break;
      case 2:
        const newProductContentArray2 = productContentArray3.filter(
          (content) => content !== item
        );
        setProductContentArray3(newProductContentArray2);
        setDeletedItems3([...deletedItems3, item]);
        break;

      case 3:
        const newProductContentArray3 = productContentArray4.filter(
          (content) => content !== item
        );
        setProductContentArray4(newProductContentArray3);
        setDeletedItems4([...deletedItems4, item]);
        break;
      default:
        break;
    }
  };

  // silinen itemleri tekrar ekleme
  const handleAdd = (item, i) => {
    switch (i) {
      case 0:
        setProductContentArray([...productContentArray, item]);
        const newDeletedItems = deletedItems.filter(
          (content) => content !== item
        );
        setDeletedItems(newDeletedItems);
        break;
      case 1:
        setProductContentArray2([...productContentArray2, item]);
        const newDeletedItems2 = deletedItems2.filter(
          (content) => content !== item
        );
        setDeletedItems2(newDeletedItems2);
        break;
      case 2:
        setProductContentArray3([...productContentArray3, item]);
        const newDeletedItems3 = deletedItems3.filter(
          (content) => content !== item
        );
        setDeletedItems3(newDeletedItems3);
        break;
      case 3:
        setProductContentArray4([...productContentArray4, item]);
        const newDeletedItems4 = deletedItems4.filter(
          (content) => content !== item
        );
        setDeletedItems4(newDeletedItems4);
        break;
      default:
        break;
    }
  };

  // sayfa yüklendiginde bilgiler alınıp local state e atılıyor
  const initSetMenu = () => {
    const menu = menus.find((item) => item._id === id);
    // create await function for filter
    if (menu.menu_burger_selection.length > 0) {
      for (let i = 0; i < menu.menu_burger_selection.length; i++) {
        let product = products.find(
          (item) => item._id === menu.menu_burger_selection[i][1]
        );
        let productContentArrayI = product.product_content.split(",");
        switch (i) {
          case 0:
            setProductContentArray(productContentArrayI);
            break;
          case 1:
            setProductContentArray2(productContentArrayI);
            break;
          case 2:
            setProductContentArray3(productContentArrayI);
            break;
          case 3:
            setProductContentArray4(productContentArrayI);
            break;
          default:
            break;
        }
      }
    }

    setMenu({
      menu_name: menu.menu_name,
      menu_burger_selection: menu.menu_burger_selection,
      menu_snacks_selection: menu.menu_snacks_selection,
      menu_drink_selection: menu.menu_drink_selection,
      menu_cips_selection: menu.menu_cips_selection,
      menu_sauce_selection: menu.menu_sauce_selection,
      menu_price: menu.menu_price,
      menu_image: menu.menu_image,
      _id: menu._id,
    });
  };

  // menu sayısı arttırlıp azaltıulıyor
  const inCrease = () => {
    setMenuAdet(menuAdet + 1);
  };
  const deCrease = () => {
    if (menuAdet > 1) {
      setMenuAdet(menuAdet - 1);
    }
  };

  // menu sepete ekleniyor
  const addToCartButton = () => {
    const urun = {
      __id: Math.random(),
      urunId: menu._id,
      urunAdi: menu.menu_name,
      urunFiyat: menu.menu_price,
      urunAdet: menuAdet,
      urunNotu: menuNotu,
      menu: {
        menu_burger_selection: menu.menu_burger_selection,
        menu_snacks_selection: menu.menu_snacks_selection,
        menu_drink_selection: menu.menu_drink_selection,
        menu_cips_selection: menu.menu_cips_selection,
        menu_sauce_selection: menu.menu_sauce_selection,
      },
      siparisToplamTutar: menuAdet * menu.menu_price,
    };
    if (deletedItems.length > 0) {
      urun.urunNotu =
        urun.urunNotu +
        " -->  1. Hamburger için Çıkarılacak Malzemeler : " +
        deletedItems.join(", ");
    }
    if (deletedItems2.length > 0) {
      urun.urunNotu =
        urun.urunNotu +
        " | 2. Hamburger için Çıkarılacak Malzemeler : " +
        deletedItems2.join(", ");
    }
    if (deletedItems3.length > 0) {
      urun.urunNotu =
        urun.urunNotu +
        " | 3. Hamburger için Çıkarılacak Malzemeler : " +
        deletedItems3.join(", ");
    }
    if (deletedItems4.length > 0) {
      urun.urunNotu =
        urun.urunNotu +
        " | 4. Hamburger için Çıkarılacak Malzemeler : " +
        deletedItems4.join(", ");
    }
    var newCart = [...cart, urun];
    dispatch(addToCart(newCart));
    alertify.success(urun.urunAdi + " Sepete Eklendi");
    closeWindow();
  };
  // ekran kapatılıyor
  const closeWindow = () => {
    // go back to previous window code
    setShow(false);
    // window.history.back();
    window.history.go(-1);
  };

  // sos ekleniyor
  const sosSecim = () => {
    let soslar = [];
    for (let i = 0; i < menu.menu_sauce_selection.length; i++) {
      if (
        menu.menu_sauce_selection[i] === "Eklenmedi" ||
        !menu.menu_sauce_selection[i][0] ||
        menu.menu_sauce_selection[i][0] === " "
      ) {
      } else {
        soslar.push(
          <div key={i} className="relative flex flex-col   h-auto p-4   w-full">
            <h1 className="text-lg font-bold ">{i + 1}. Sos Seçimi</h1>
            <select
              className="flex  p-2 gap-2 flex-wrap flex-grow flex-row w-3/4 h-auto  "
              onChange={(e) => {
                let prdt = products.find((item) => item._id === e.target.value);

                let secilenSosFiyati = prdt.product_price;
                let suankiSosunFiyati = menu.menu_sauce_selection[i][2];

                if (secilenSosFiyati > suankiSosunFiyati) {
                  let fark = secilenSosFiyati - suankiSosunFiyati;

                  setMenu({
                    ...menu,
                    menu_sauce_selection: [
                      ...menu.menu_sauce_selection.slice(0, i),
                      [prdt.product_name, prdt._id, prdt.product_price],
                      ...menu.menu_sauce_selection.slice(i + 1),
                    ],
                    menu_price: menu.menu_price + fark,
                  });
                }
                if (secilenSosFiyati < suankiSosunFiyati) {
                  let fark = secilenSosFiyati - suankiSosunFiyati;
                  setMenu({
                    ...menu,
                    menu_sauce_selection: [
                      ...menu.menu_sauce_selection.slice(0, i),
                      [prdt.product_name, prdt._id, prdt.product_price],
                      ...menu.menu_sauce_selection.slice(i + 1),
                    ],
                    menu_price: menu.menu_price + fark,
                  });
                }
              }}
              value={menu.menu_sauce_selection[i][1]}
            >
              {sosSecimSecenekleri()}
            </select>
          </div>
        );
      }
    }

    return soslar;
  };
  const sosSecimSecenekleri = (i) => {
    let soslar = [];
    products.map((product) => {
      if (product.product_category === "Soslar") {
        soslar.push(
          <option key={product._id} value={product._id}>
            {product.product_name} - {product.product_price} TL
          </option>
        );
      }
    });

    return soslar;
  };
  // patates kızartması seçimi yapılıyor
  const patatesKizartmalari = () => {
    let patatesKizartmalari = [];
    for (let i = 0; i < menu.menu_cips_selection.length; i++) {
      patatesKizartmalari.push(
        <div key={i} className="relative flex flex-col   h-auto p-4   w-full">
          <h1 className="text-lg font-bold ">
            {i + 1}. Patates Kızartması Seçimi
          </h1>
          <select
            className="flex  p-2 gap-2 flex-wrap flex-grow flex-row w-3/4 h-auto  "
            onChange={(e) => {
              let prdt = products.find((item) => item._id === e.target.value);

              let choosingCipsPrice = prdt.product_price;
              let currentCipsPrice = menu.menu_cips_selection[i][2];

              if (choosingCipsPrice > currentCipsPrice) {
                let fark = choosingCipsPrice - currentCipsPrice;

                setMenu({
                  ...menu,
                  menu_cips_selection: [
                    ...menu.menu_cips_selection.slice(0, i),
                    [prdt.product_name, prdt._id, prdt.product_price],
                    ...menu.menu_cips_selection.slice(i + 1),
                  ],
                  menu_price: menu.menu_price + fark,
                });
              }
              if (choosingCipsPrice < currentCipsPrice) {
                console.log("choosing cips price is bigger");
                let fark = choosingCipsPrice - currentCipsPrice;
                console.log("fark", fark);
                setMenu({
                  ...menu,
                  menu_cips_selection: [
                    ...menu.menu_cips_selection.slice(0, i),
                    [prdt.product_name, prdt._id, prdt.product_price],
                    ...menu.menu_cips_selection.slice(i + 1),
                  ],
                  menu_price: menu.menu_price + fark,
                });
              }
            }}
            value={menu.menu_cips_selection[i][1]}
          >
            {patatesKizartmasiSecenekleri()}
          </select>
        </div>
      );
    }
    return patatesKizartmalari;
  };
  const patatesKizartmasiSecenekleri = (i) => {
    let patatesKizartmasiSecenekleri = [];
    products.map((product) => {
      if (product.product_category === "Patates Cipsi") {
        patatesKizartmasiSecenekleri.push(
          <option key={product._id} value={product._id}>
            {product.product_name} - {product.product_price} TL
          </option>
        );
      }
    });

    return patatesKizartmasiSecenekleri;
  };

  // burger icindekiler kısmı yazılıyor
  const icindekiler = () => {
    let icindekiler = [];
    for (let i = 0; i < menu.menu_burger_selection.length; i++) {
      icindekiler.push(
        <div key={i} className="relative flex flex-col  h-auto p-4   w-full">
          <h1 className="text-lg font-bold ">
            {i + 1}. {menu.menu_burger_selection[i][0]} İçindekiler
          </h1>
          <ul className="flex  p-2 gap-2 flex-wrap flex-grow flex-row w-full h-auto  ">
            {fonksiyonPozitif(i)}
            {fonksiyonNegatif(i)}
          </ul>
        </div>
      );
    }
    return icindekiler;
  };
  const fonksiyonPozitif = (i) => {
    let array = [];
    if (i === 0) {
      productContentArray.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleDelete(item, i);
            }}
            className="transition-all ease-in-out duration-500 p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-green-500"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className="text-xs  m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
          </li>
        )
      );
    }
    if (i === 1) {
      productContentArray2.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleDelete(item, i);
            }}
            className="transition-all ease-in-out duration-500 p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-green-500"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className="text-xs  m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
          </li>
        )
      );
    }
    if (i === 2) {
      productContentArray3.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleDelete(item, i);
            }}
            className="transition-all ease-in-out duration-500 p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-green-500"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className="text-xs  m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
          </li>
        )
      );
    }
    if (i === 3) {
      productContentArray4.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleDelete(item, i);
            }}
            className="transition-all ease-in-out duration-500 p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-green-500"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className="text-xs  m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
          </li>
        )
      );
    }
    return array;
  };
  const fonksiyonNegatif = (i) => {
    let array = [];
    if (i === 0) {
      deletedItems.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleAdd(item, i);
            }}
            className="transition-all ease-in-out duration-500 relative p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-red-600"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className=" m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
            <p className="absolute w-full opacity-40 top-5 rotate-[20deg] left-0 border border-red-500 "></p>
          </li>
        )
      );
    }
    if (i === 1) {
      deletedItems2.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleAdd(item, i);
            }}
            className="transition-all ease-in-out duration-500 relative p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-red-600"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className=" m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
            <p className="absolute w-full opacity-40 top-5 rotate-[20deg] left-0 border border-red-500 "></p>
          </li>
        )
      );
    }
    if (i === 2) {
      deletedItems3.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleAdd(item, i);
            }}
            className="transition-all ease-in-out duration-500 relative p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-red-600"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className=" m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
            <p className="absolute w-full opacity-40 top-5 rotate-[20deg] left-0 border border-red-500 "></p>
          </li>
        )
      );
    }
    if (i === 3) {
      deletedItems4.map((item, index) =>
        array.push(
          <li
            key={index}
            onClick={() => {
              handleAdd(item, i);
            }}
            className="transition-all ease-in-out duration-500 relative p-2 flex gap-2 h-10 min-w-[100px] rounded-lg border border-red-600"
          >
            <h1 className="text-xs font-bold m-auto">{item}</h1>
            <h1 className=" m-auto">
              <CloseIcon fontSize="xs" />
            </h1>
            <p className="absolute w-full opacity-40 top-5 rotate-[20deg] left-0 border border-red-500 "></p>
          </li>
        )
      );
    }
    return array;
  };

  useEffect(() => {
    initSetMenu();
    setShow(true);
    window.scrollTo(0, 0);
  }, [menus, id]);
  return (
    <>
      <div
        className={`relative flex w-full  items-center justify-center min-h-screen mb-32  transition-all duration-500 ease-in-out  ${
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
              src={menu.menu_image}
              alt="uploaded"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full px-3 ">
            <div className="flex flex-row p-2 items-center justify-between">
              <h1 className="text-2xl font-bold">{menu.menu_name}</h1>
              <h1 className="text-lg font-semibold to-textColor">
                {menu.menu_price} TL
              </h1>
            </div>
            <h1 className="text-xs flex font-bold p-2 text-textColor w-4/5 h-auto overflow-hidden">
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
          </div>
          {/* buraya sleeect box koyulacak. */}
          <div className="flex flex-col w-full p-2">
            <h1 className="text-lg font-bold">Menu Icerigi</h1>
            <p className="text-sm font-bold m-auto p-2">Hamburger Secimi</p>
            <div className="flex flex-col w-full max-h-60 overflow-y-scroll">
              {icindekiler()}
            </div>
            <p className="text-sm font-bold m-auto p-2 ">Patates Secimi</p>
            <div className="flex flex-col w-full h-auto ">
              {patatesKizartmalari()}
            </div>

            <p className="text-sm font-bold m-auto p-2 ">Sos Secimi</p>
            <div className="flex flex-col w-full h-auto ">
              {menu.menu_sauce_selection.length > 0 ? (
                sosSecim()
              ) : (
                <h1 className="text-xs font-bold text-textColor">
                  Sos secimi bulunmamaktadir.
                </h1>
              )}
            </div>
          </div>

          <div className="relative flex flex-col mt-auto p-2 h-60   w-full">
            <h1 className="text-lg font-bold">Menu Notu</h1>
            <textarea
              onChange={(e) => setMenuNotu(e.target.value)}
              className="w-full mt-3 h-full border border-slate-600 p-2"
              placeholder="Menu ilgili bilgi yazabilirsiniz."
              maxLength={250}
            ></textarea>
            <h4 className="text-xs text-textColor ml-auto mr-4 mt-1">
              {menuNotu.length}/250
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
                color={`${menuAdet > 1 ? "primary" : "disabled"}`}
                className=" cursor-pointer  h-14 hover:scale-105 transform transition-all ease-in-out duration-300"
              />

              <div className=" w-10 h-10  rounded-full flex items-center justify-center">
                <h1 className=" text-2xl font-smallbold">{menuAdet}</h1>
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

export default AddToCartForMenus;

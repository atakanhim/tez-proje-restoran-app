import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { setMenus } from "../../../store/slices/restoranSlice";
import { useSelector } from "react-redux";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import * as Yup from "yup";

import {
  getMenusFromDB,
  addMenuDB,
  deleteMenuDB,
  deleteAllMenusDB,
  updateMenuDB,
} from "../../../api/api";
// import motion
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebase.config";
import { CategoryCard, Loader } from "../../CustomCarts";
import { useNavigate, useParams } from "react-router-dom";

import { Formik } from "formik";

import alertify from "alertifyjs";

import "alertifyjs/build/css/alertify.css";
import { useEffect } from "react";
const MenuUpdate = () => {
  const dispatch = useDispatch();
  // param ile id alma
  const params = useParams();
  const { id } = params;

  // values for yup
  const [values, setValues] = useState({
    menu_name: "",
    menu_price: "",
    menu_image: "",
  });
  // values for arrays
  const [valuesArray, setValuesArray] = useState({
    menu_burger_selection: [],
    menu_snacks_selection: [],
    menu_cips_selection: [],
    menu_drink_selection: [],
    menu_sauce_selection: [],
  });
  const [counts, setCounts] = useState({
    burgerCount: 1,
    drinkCount: 1,
    snackCount: 1,
    cipsCount: 1,
    sauceCount: 1,
  });
  // global stateden veri çekme
  const { products, categories, menus } = useSelector(
    (state) => state.restoran
  );
  // image update states
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(0);
  const [show, setShow] = useState(false);

  const renderOption = () => {
    let content = [];

    for (let i = 1; i < 5; i++) {
      content.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return content;
  };
  const setEstimatedTotalAmountFunction = () => {
    var total = 0;

    for (let i = 0; i < valuesArray.menu_burger_selection.length; i++) {
      if (valuesArray.menu_burger_selection[i]) {
        total += valuesArray.menu_burger_selection[i][2];
      }
    }

    for (let i = 0; i < valuesArray.menu_cips_selection.length; i++) {
      if (valuesArray.menu_cips_selection[i]) {
        total += valuesArray.menu_cips_selection[i][2];
      }
    }
    for (let i = 0; i < valuesArray.menu_drink_selection.length; i++) {
      if (valuesArray.menu_drink_selection[i]) {
        total += valuesArray.menu_drink_selection[i][2];
      }
    }
    for (let i = 0; i < valuesArray.menu_snacks_selection.length; i++) {
      if (
        valuesArray.menu_snacks_selection[i] &&
        valuesArray.menu_snacks_selection[i][2] > 0
      ) {
        total += valuesArray.menu_snacks_selection[i][2];
      }
    }
    for (let i = 0; i < valuesArray.menu_sauce_selection.length; i++) {
      if (
        valuesArray.menu_sauce_selection[i] &&
        valuesArray.menu_sauce_selection[i][2] > 0
      ) {
        total += valuesArray.menu_sauce_selection[i][2];
      }
    }

    total = total.toFixed(2);
    setEstimatedTotalAmount(total);
  };

  const renderSauces = () => {
    let content = [];

    for (let i = 0; i < counts.sauceCount; i++) {
      content.push(
        <div key={i} className=" ">
          <p className="text-xs text-gray-600">Zorunlu Degildir</p>
          <select
            id="menu_sauce_selection"
            name="menu_sauce_selection"
            className="flex flex-col w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            onChange={(e) => {
              var prdt = products.find(
                (product) => product._id === e.target.value
              );

              if (prdt) {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_sauce_selection[i] = [
                  prdt.product_name,
                  prdt._id,
                  prdt.product_price,
                ];

                setValuesArray(newValuesArray);
              } else {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_sauce_selection[i] = e.target.value;

                setValuesArray(newValuesArray);
              }
              setEstimatedTotalAmountFunction();
            }}
            value={
              valuesArray.menu_sauce_selection[i]
                ? valuesArray.menu_sauce_selection[i][1]
                : "Eklenmedi"
            }
          >
            <option value="Eklenmedi">Sos Eklemeyecegim</option>
            {products.map((product) => {
              if (product.product_category === "Soslar") {
                return (
                  <option key={product._id} value={product._id}>
                    {product.product_name} - {product.product_price} TL
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }
    return content;
  };
  const renderBurgers = () => {
    let content = [];

    for (let i = 0; i < counts.burgerCount; i++) {
      content.push(
        <div key={i} className=" ">
          <select
            id="menu_burger_selection"
            name="menu_burger_selection"
            className="flex flex-col w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            onChange={(e) => {
              var prdt = products.find(
                (product) => product._id === e.target.value
              );

              if (prdt) {
                var newValuesArray = { ...valuesArray };
                console.log(newValuesArray.menu_burger_selection);
                newValuesArray.menu_burger_selection[i] = [
                  prdt.product_name,
                  prdt._id,
                  prdt.product_price,
                ];
                setValuesArray(newValuesArray);
              }
              setEstimatedTotalAmountFunction();
            }}
            value={
              valuesArray.menu_burger_selection[i]
                ? valuesArray.menu_burger_selection[i][1]
                : ""
            }
          >
            <option value="">{i + 1}.Burger Seçiniz</option>
            {products.map((product) => {
              if (product.product_category === "Burgerler") {
                return (
                  <option key={product._id} value={product._id}>
                    {product.product_name} - {product.product_price} TL
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }

    return content;
  };
  const renderCips = () => {
    let content = [];

    for (let i = 0; i < counts.cipsCount; i++) {
      content.push(
        <div key={i} className=" ">
          <select
            id="menu_cips_selection"
            name="menu_cips_selection"
            className="flex flex-col w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            onChange={(e) => {
              var prdt = products.find(
                (product) => product._id === e.target.value
              );

              if (prdt) {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_cips_selection[i] = [
                  prdt.product_name,
                  prdt._id,
                  prdt.product_price,
                ];
                setValuesArray(newValuesArray);
              }
              setEstimatedTotalAmountFunction();
            }}
            value={
              valuesArray.menu_cips_selection[i]
                ? valuesArray.menu_cips_selection[i][1]
                : ""
            }
          >
            <option value="">{i + 1}.Cips Seçiniz</option>
            {products.map((product) => {
              if (product.product_category === "Patates Cipsi") {
                return (
                  <option key={product._id} value={product._id}>
                    {product.product_name} - {product.product_price} TL
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }
    return content;
  };
  const renderDrinks = () => {
    let content = [];

    for (let i = 0; i < counts.drinkCount; i++) {
      content.push(
        <div key={i} className=" ">
          <select
            id="menu_drink_selection"
            name="menu_drink_selection"
            className="flex flex-col w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            onChange={(e) => {
              var prdt = products.find(
                (product) => product._id === e.target.value
              );

              if (prdt) {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_drink_selection[i] = [
                  prdt.product_name,
                  prdt._id,
                  prdt.product_price,
                ];
                setValuesArray(newValuesArray);
              }
              setEstimatedTotalAmountFunction();
            }}
            value={
              valuesArray.menu_drink_selection[i]
                ? valuesArray.menu_drink_selection[i][1]
                : ""
            }
          >
            <option value="">{i + 1}.İçecek Seçiniz</option>
            {products.map((product) => {
              if (product.product_category === "İçecekler") {
                return (
                  <option key={product._id} value={product._id}>
                    {product.product_name} - {product.product_price} TL
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }
    return content;
  };
  const renderSnacks = () => {
    let content = [];

    for (let i = 0; i < counts.snackCount; i++) {
      content.push(
        <div key={i} className=" ">
          <p className="text-xs text-gray-600">Zorunlu Degildir</p>
          <select
            id="menu_snack_selection"
            name="menu_snack_selection"
            className="flex flex-col w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            onChange={(e) => {
              var prdt = products.find(
                (product) => product._id === e.target.value
              );

              if (prdt) {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_snacks_selection[i] = [
                  prdt.product_name,
                  prdt._id,
                  prdt.product_price,
                ];

                setValuesArray(newValuesArray);
              } else {
                const newValuesArray = { ...valuesArray };
                newValuesArray.menu_snacks_selection[i] = e.target.value;

                setValuesArray(newValuesArray);
              }
              setEstimatedTotalAmountFunction();
            }}
            value={
              valuesArray.menu_snacks_selection[i]
                ? valuesArray.menu_snacks_selection[i][1]
                : "Eklenmedi"
            }
          >
            <option value="Eklenmedi">Atıştırmalık Eklemeyecegim</option>
            {products.map((product) => {
              if (product.product_category === "Atıştırmalıklar") {
                return (
                  <option key={product._id} value={product._id}>
                    {product.product_name} - {product.product_price} TL
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }
    return content;
  };
  const valuesArraycontrol = () => {
    let control = true;

    if (valuesArray.menu_burger_selection.length >= 0) {
      for (let i = 0; i < valuesArray.menu_burger_selection.length; i++) {
        if (valuesArray.menu_burger_selection[i] === "" || null) {
          return false;
        }
      }
    }
    if (valuesArray.menu_drink_selection.length >= 0) {
      for (let i = 0; i < valuesArray.menu_drink_selection.length; i++) {
        if (valuesArray.menu_drink_selection[i] === "" || null) {
          return false;
        }
      }
    }
    if (valuesArray.menu_cips_selection.length >= 0) {
      for (let i = 0; i < valuesArray.menu_cips_selection.length; i++) {
        if (valuesArray.menu_cips_selection[i] === "" || null) {
          return false;
        }
      }
    }

    return control;
  };
  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // upload Progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      },
      () => {
        // upload işlemi bittikten sonra
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset(downloadURL);
          setIsLoading(false);
          alertify.success("Resim yükleme işlemi başarılı");
          console.log("File available at scces", downloadURL);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef)
      .then(() => {
        setImageAsset(false);
        setIsLoading(false);

        alertify.success("Resim silme işlemi başarılı");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const getMenusFunction = async () => {
    const response = await getMenusFromDB(); // apiden gelen verileri response değişkenine atadık
    dispatch(setMenus(response)); // response değişkenini global state e atadık
  };

  const updateProduct = async (values) => {
    var menu = {
      _id: id,
      menu_name: values.menu_name,
      menu_burger_selection: valuesArray.menu_burger_selection,
      menu_drink_selection: valuesArray.menu_drink_selection,
      menu_snacks_selection: valuesArray.menu_snacks_selection,
      menu_cips_selection: valuesArray.menu_cips_selection,
      menu_sauce_selection: valuesArray.menu_sauce_selection,
      menu_price: values.menu_price,
      menu_image: imageAsset,
    };

    updateMenuDB(menu)
      .then((res) => {
        console.log(res);
        getMenusFunction();
        alertify.success("Ürün güncelleme işlemi başarılı");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const doldurInput = () => {
    const menu = menus.find((item) => item._id === id);
    setCounts({
      burgerCount: menu.menu_burger_selection.length,
      drinkCount: menu.menu_drink_selection.length,
      snackCount: menu.menu_snacks_selection.length,
      cipsCount: menu.menu_cips_selection.length,
      sauceCount: menu.menu_sauce_selection.length,
    });
    setValuesArray({
      ...valuesArray,
      menu_burger_selection: new Array(
        parseInt(menu.menu_burger_selection.length)
      ).fill(""),
      menu_drink_selection: new Array(
        parseInt(menu.menu_drink_selection.length)
      ).fill(""),
      menu_snacks_selection: new Array(
        parseInt(menu.menu_snacks_selection.length)
      ).fill(""),
      menu_cips_selection: new Array(
        parseInt(menu.menu_cips_selection.length)
      ).fill(""),
      menu_sauce_selection: new Array(
        parseInt(menu.menu_sauce_selection.length)
      ).fill(""),
    });

    for (let i = 0; i < menu.menu_burger_selection.length; i++) {
      let prdt = products.find(
        (product) => product._id === menu.menu_burger_selection[i][1]
      );

      if (prdt) {
        let newValuesArray = { ...valuesArray };
        newValuesArray.menu_burger_selection[i] = [
          prdt.product_name,
          prdt._id,
          prdt.product_price,
        ];
        setValuesArray(newValuesArray);
      }
    }
    for (let i = 0; i < menu.menu_cips_selection.length; i++) {
      let prdt = products.find(
        (product) => product._id === menu.menu_cips_selection[i][1]
      );

      if (prdt) {
        let newValuesArray = { ...valuesArray };
        newValuesArray.menu_cips_selection[i] = [
          prdt.product_name,
          prdt._id,
          prdt.product_price,
        ];
        setValuesArray(newValuesArray);
      }
    }
    for (let i = 0; i < menu.menu_drink_selection.length; i++) {
      let prdt = products.find(
        (product) => product._id === menu.menu_drink_selection[i][1]
      );

      if (prdt) {
        let newValuesArray = { ...valuesArray };

        newValuesArray.menu_drink_selection[i] = [
          prdt.product_name,
          prdt._id,
          prdt.product_price,
        ];
        setValuesArray(newValuesArray);
      }
    }
    for (let i = 0; i < menu.menu_snacks_selection.length; i++) {
      if (
        menu.menu_snacks_selection[i] === undefined ||
        menu.menu_snacks_selection[i] === null
      ) {
        continue;
      }
      let prdt = products.find(
        (product) => product._id === menu.menu_snacks_selection[i][1]
      );

      if (prdt) {
        let newValuesArray = { ...valuesArray };

        newValuesArray.menu_snacks_selection[i] = [
          prdt.product_name,
          prdt._id,
          prdt.product_price,
        ];
        setValuesArray(newValuesArray);
      }
    }
    for (let i = 0; i < menu.menu_sauce_selection.length; i++) {
      if (
        menu.menu_sauce_selection[i] === undefined ||
        menu.menu_sauce_selection[i] === null
      ) {
        continue;
      }
      let prdt = products.find(
        (product) => product._id === menu.menu_sauce_selection[i][1]
      );

      if (prdt) {
        let newValuesArray = { ...valuesArray };

        newValuesArray.menu_sauce_selection[i] = [
          prdt.product_name,
          prdt._id,
          prdt.product_price,
        ];
        setValuesArray(newValuesArray);
      }
    }
    setValues({
      menu_name: menu.menu_name,
      menu_price: menu.menu_price,
      menu_image: menu.menu_image,
    });

    setImageAsset(menu.menu_image);
  };

  useEffect(() => {
    // get the last part of the url
    doldurInput();

    setShow(true);
  }, [products, id]);

  return (
    <>
      {show ? (
        <div className="relative z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 h-full ">
          <div className="w-full  mt-16 flex items-center justify-center p-3">
            <p className="text-gray-800 text-3xl italic"> Menü Güncelle</p>
          </div>
          <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
            <Formik
              initialValues={values}
              validationSchema={Yup.object({
                menu_name: Yup.string().required("Ürün adı zorunludur"),
                menu_price: Yup.number().required("Ürün fiyatı zorunludur"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                var menux = menus.filter(
                  (menu) =>
                    menu.menu_name.trim() === values.menu_name.trim() &&
                    menu._id !== id
                );

                var result = valuesArraycontrol();
                if (menux.length > 0 || products === null) {
                  alertify.error("Menü zaten mevcut");
                } else if (result === false) {
                  alertify.error("Lütfen menü seçimlerini tamamlayınız");
                } else if (imageAsset === false || imageAsset === null) {
                  alertify.error("Lütfen resim ekleyiniz");
                } else {
                  updateProduct(values);
                }
                setTimeout(() => {
                  setSubmitting(false);
                }, 1000);
              }}
            >
              {(formik) => (
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col items-center justify-center w-full gap-5"
                >
                  {/* menu adı */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_name">Menü Adı</label>
                    <input
                      type="text"
                      id="menu_name"
                      name="menu_name"
                      placeholder="Menu Adı"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.menu_name}
                    />
                    {formik.touched.menu_name && formik.errors.menu_name ? (
                      <div className="text-red-500">
                        {formik.errors.menu_name}
                      </div>
                    ) : null}
                  </div>
                  {/* eklenen hamburgerler */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_burger_selection">
                      Eklenecek Hamburger sayısını seciniz
                    </label>
                    <select
                      className="w-12 h-6  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={(e) => {
                        setCounts({
                          ...counts,
                          burgerCount: e.target.value,
                        });
                        setValuesArray({
                          ...valuesArray,
                          menu_burger_selection: new Array(
                            parseInt(e.target.value)
                          ).fill(""),
                        });
                      }}
                      value={counts.burgerCount}
                    >
                      {renderOption()}
                    </select>
                    {counts.burgerCount > 0 ? renderBurgers() : null}
                  </div>
                  {/* eklenen cipsler */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_cips_selection">
                      Eklenecek Cips sayısını seciniz
                    </label>
                    <select
                      className="w-12 h-6  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={(e) => {
                        setCounts({
                          ...counts,
                          cipsCount: e.target.value,
                        });
                        setValuesArray({
                          ...valuesArray,
                          menu_cips_selection: new Array(
                            parseInt(e.target.value)
                          ).fill(""),
                        });
                      }}
                      value={counts.cipsCount}
                    >
                      {renderOption()}
                    </select>
                    {counts.cipsCount > 0 ? renderCips() : null}
                  </div>
                  {/* eklenen icecekler */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_drink_selection">
                      Eklenecek İçecek sayısını seciniz
                    </label>
                    <select
                      className="w-12 h-6  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={(e) => {
                        setCounts({
                          ...counts,
                          drinkCount: e.target.value,
                        });
                        setValuesArray({
                          ...valuesArray,
                          menu_drink_selection: new Array(
                            parseInt(e.target.value)
                          ).fill(""),
                        });
                      }}
                      value={counts.drinkCount}
                    >
                      {renderOption()}
                    </select>
                    {counts.drinkCount > 0 ? renderDrinks() : null}
                  </div>
                  {/* eklenen atistirmaliklar  */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_burger_selection">
                      Eklenecek Atıştırmalık sayısını seciniz
                    </label>
                    <select
                      className="w-12 h-6  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={(e) => {
                        setCounts({
                          ...counts,
                          snackCount: e.target.value,
                        });
                        setValuesArray({
                          ...valuesArray,
                          menu_snacks_selection: new Array(
                            parseInt(e.target.value)
                          ).fill(""),
                        });
                      }}
                      value={counts.snackCount}
                    >
                      {renderOption()}
                    </select>
                    {counts.snackCount > 0 ? renderSnacks() : null}
                  </div>
                  {/* eklenen soslar */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="menu_sauce_selection">
                      Eklenecek Sos sayısını seciniz
                    </label>
                    <select
                      className="w-12 h-6  border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={(e) => {
                        setCounts({
                          ...counts,
                          sauceCount: e.target.value,
                        });
                        setValuesArray({
                          ...valuesArray,
                          menu_sauce_selection: new Array(
                            parseInt(e.target.value)
                          ).fill(""),
                        });
                      }}
                      value={counts.sauceCount}
                    >
                      {renderOption()}
                    </select>
                    {counts.sauceCount > 0 ? renderSauces() : null}
                  </div>
                  {/* menu fiyati */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="product_price">Menü Fiyati</label>
                    <p className="text-xs text-gray-600">
                      TL Üzerinden giriniz.(Örnek: 10.99) - Toplam fiyat:{" "}
                      {estimatedTotalAmount} TL
                    </p>
                    <input
                      type="text"
                      id="menu_price"
                      name="menu_price"
                      placeholder="Menü Fiyat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.menu_price}
                    />
                    {formik.touched.menu_price && formik.errors.menu_price ? (
                      <div className="text-red-500">
                        {formik.errors.menu_price}
                      </div>
                    ) : null}
                  </div>
                  {/* menu resim */}
                  <div className="flex justify-center items-center w-2/5">
                    <div
                      className="flex justify-center items-center flex-col border-2 border-dotted
                border-gray-200 hover:border-gray-700 transition-all ease-in-out duration-200 w-full h-225 md:h-225 cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <>
                          {!imageAsset ? (
                            <>
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                                  <MdCloudUpload className="w-10 h-10 text-gray-500 text-3xl hover:text-gray-700" />
                                  <p className=" text-gray-500  hover:text-gray-700">
                                    Click here to upload
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  name="uploadimage"
                                  accept="image/*"
                                  onChange={uploadImage}
                                  className="hidden"
                                />
                              </label>
                            </>
                          ) : (
                            <>
                              <div className="relative h-full">
                                <img
                                  src={imageAsset}
                                  alt="uploaded"
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  className="absolute top-3 right-3 p-3 rounded-full text-xl bg-red-400 cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out "
                                  onClick={deleteImage}
                                >
                                  <MdDelete className="text-white" />
                                </button>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {/* menu ekle button */}
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <button
                      type="submit"
                      className="w-full px-3 py-2 text-white bg-indigo-700 rounded-md disabled:bg-indigo-400 focus:outline-none"
                      disabled={!formik.dirty || formik.isSubmitting}
                    >
                      Menü Ekle
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MenuUpdate;

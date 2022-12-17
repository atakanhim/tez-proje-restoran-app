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
import { useNavigate } from "react-router-dom";

import { Formik } from "formik";

import alertify from "alertifyjs";

import "alertifyjs/build/css/alertify.css";
import { useEffect } from "react";

const Menus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //global state
  const { products, categories, menus } = useSelector(
    (state) => state.restoran
  );

  // local state
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  // local states 2
  const [burgerCount, setBurgerCount] = useState(0);

  // Atistirmaliklar
  const [secondSnack, setSnack] = useState("");

  const [values, setValues] = useState({
    menu_name: "",
    menu_burger_selection: "",
    menu_snacks_selection: "",
    menu_drink_selection: "",
    menu_price: "",
    menu_image: "",
  });

  // api yardımıyla kategori ekleme
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
          console.log("File available at scces", downloadURL);
        });
      }
    );

    console.log(imageFile);
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageAsset);
    deleteObject(deleteRef)
      .then(() => {
        setImageAsset(null);
        setIsLoading(false);
        console.log("File deleted successfully");
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

  const deleteProductWithId = async (id) => {
    deleteMenuDB(id).then((res) => {
      console.log(res);
      getMenusFunction();
    });
  };
  // resim ekleme işlemleri için gerekli fonksiyonlar
  const updateMenuWithId = async (id) => {
    //navigate("/admin/product-update/" + id);
  };
  const setMenu = async (
    menu_name,
    menu_burger_selection,
    menu_snacks_selection,
    menu_drink_selection,
    menu_price,
    menu_image
  ) => {
    const menu_snacks_selection_array = [];

    menu_snacks_selection_array.push(menu_snacks_selection);
    if (secondSnack !== "") {
      menu_snacks_selection_array.push(secondSnack);
    }
    const selectedBurger = products.find(
      (product) => product._id === menu_burger_selection
    );

    const menu_burger_selection_array = [
      selectedBurger._id,
      selectedBurger.product_name,
    ]; // bu idsi

    const response = await addMenuDB(
      menu_name,
      menu_burger_selection_array,
      menu_snacks_selection_array,
      menu_drink_selection,
      menu_price,
      menu_image
    );

    getMenusFunction();
    setImageAsset(null);
  };
  return (
    <div className="relative z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 h-full ">
      <div className="w-full  mt-16 flex items-center justify-center p-3">
        <p className="text-gray-800 text-3xl italic"> Menü Ekle</p>
      </div>
      <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
        <Formik
          initialValues={values}
          validationSchema={Yup.object({
            menu_name: Yup.string().required("Ürün adı zorunludur"),
            menu_price: Yup.number().required("Ürün fiyatı zorunludur"),
            menu_burger_selection: Yup.string().required(
              "Hamburger seçimi zorunludur"
            ),
            menu_snacks_selection: Yup.string().required(
              "Atıştırmalık seçimi zorunludur"
            ),
            menu_drink_selection: Yup.string().required(
              "İçecek seçimi zorunludur"
            ),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            var menux = menus.filter(
              (menu) => menu.menu_name === values.menu_name
            );
            if (menux.length > 0 || products === null) {
              alertify.error("Menü zaten mevcut");
            } else if (values.menu_snacks_selection === secondSnack) {
              alertify.error("2 atıştırmalık farklı olmalı");
            } else if (imageAsset === false || imageAsset === null) {
              alertify.error("Lütfen resim ekleyiniz");
            } else {
              setMenu(
                values.menu_name,
                values.menu_burger_selection,
                values.menu_snacks_selection,
                values.menu_drink_selection,
                values.menu_price,
                imageAsset
              );
              console.log(values);
              setTimeout(() => {
                resetForm();
                setImageAsset(null);
                setSnack("");
              }, 1000);
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
                  <div className="text-red-500">{formik.errors.menu_name}</div>
                ) : null}
              </div>

              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="menu_burger_selection">Hamburger seçimi</label>
                <select
                  id="menu_burger_selection"
                  name="menu_burger_selection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.menu_burger_selection}
                >
                  <option value="">Hamburger seçiniz</option>
                  {products.map((product) => {
                    if (product.product_category === "Burgerler") {
                      return (
                        <option key={product._id} value={product._id}>
                          {product.product_name}
                        </option>
                      );
                    }
                  })}
                </select>

                {formik.touched.menu_burger_selection &&
                formik.errors.menu_burger_selection ? (
                  <div className="text-red-500">
                    {formik.errors.menu_burger_selection}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="menu_snacks_selection">
                  1.Atıştırmalık seçimi
                </label>
                <p className="text-xs text-gray-600">
                  (Patates Kizartması Seçimi)
                </p>
                <select
                  id="menu_snacks_selection"
                  name="menu_snacks_selection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.menu_snacks_selection}
                >
                  <option value="">Atıştırmalık seçiniz</option>
                  {products.map((product) => {
                    if (
                      product.product_category === "Atıştırmalıklar" &&
                      product.product_description === "patates kızartması"
                    ) {
                      return (
                        <option key={product._id} value={product.product_name}>
                          {product.product_name}
                        </option>
                      );
                    }
                  })}
                </select>

                {formik.touched.menu_snacks_selection &&
                formik.errors.menu_snacks_selection ? (
                  <div className="text-red-500">
                    {formik.errors.menu_snacks_selection}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="menu_snacks_selection">
                  2.Atıştırmalık seçimi
                </label>
                <p className="text-xs text-gray-600">(İsteğe bağlı)</p>
                <select
                  id="secondSnake"
                  name="secondSnake"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={(e) => {
                    setSnack(e.target.value);
                  }}
                  value={secondSnack}
                >
                  <option value="">Atıştırmalık seçiniz</option>
                  {products.map((product) => {
                    if (product.product_category === "Atıştırmalıklar") {
                      return (
                        <option key={product._id} value={product.product_name}>
                          {product.product_name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="menu_drink_selection">İçecek seçimi</label>
                <select
                  id="menu_drink_selection"
                  name="menu_drink_selection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.menu_drink_selection}
                >
                  <option value="">İçecek seçiniz</option>
                  {products.map((product) => {
                    if (product.product_category === "İçecekler") {
                      return (
                        <option key={product._id} value={product.product_name}>
                          {product.product_name}
                        </option>
                      );
                    }
                  })}
                </select>

                {formik.touched.menu_drink_selection &&
                formik.errors.menu_drink_selection ? (
                  <div className="text-red-500">
                    {formik.errors.menu_drink_selection}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="product_price">Menü Fiyati</label>
                <p className="text-xs text-gray-600">
                  TL Üzerinden giriniz.(Örnek: 10.99) - Onerilen fiyat: 15.99
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
                  <div className="text-red-500">{formik.errors.menu_price}</div>
                ) : null}
              </div>
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
      <div className="flex w-3/5 h-auto gap-12 p-3 flex-wrap justify-center">
        {menus.length > 0 &&
          menus.map((menu) => (
            <motion.div
              key={menu._id}
              className="relative rounded-lg  w-40 min-w-210 px-4 py-4 h-[270px] cursor-pointer hover:bg-card bg-gray-100 shadow-md  flex flex-col items-center "
            >
              <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={menu.menu_image}
                  className="w-full h-full object-cover rounded-lg"
                ></motion.img>
              </div>
              <p className="text-base text-headingColor font-semibold my-2">
                {menu.menu_name.length > 25
                  ? `${menu.menu_name.slice(0, 25)}..`
                  : menu.menu_name + " - " + menu.menu_price + "₺"}
              </p>

              <div>
                <motion.i
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteProductWithId(menu._id)}
                  className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4"
                >
                  <DeleteOutlineOutlinedIcon
                    className="text-base text-red-400 drop-shadow-md hover:text-red-600
                "
                  />
                </motion.i>
              </div>
              <div>
                <motion.i
                  onClick={() => updateMenuWithId(menu._id)}
                  className="w-full absolute bottom-2 left-40   flex items-center justify-between px-4 hover:scale-95 transition-all duration-150 ease-in-out"
                >
                  <ModeEditOutlineIcon
                    className="text-base text-red-400 drop-shadow-md hover:text-red-600
                "
                  />
                </motion.i>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Menus;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { setProducts } from "../../../store/slices/restoranSlice";
import { useSelector } from "react-redux";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import * as Yup from "yup";

import {
  getProductsFromDB,
  addProductDB,
  deleteProductDB,
  deleteAllProductsDB,
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

const Products = () => {
  const navigate = useNavigate();
  //global state
  const { products, categories } = useSelector((state) => state.restoran);
  // local state
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [values, setValues] = useState({
    product_name: "",
    product_price: "",
    product_description: "",
    product_image: "",
    product_category: "",
    product_featured: false,
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

  const dispatch = useDispatch();
  const getProductFunction = async () => {
    const response = await getProductsFromDB(); // apiden gelen verileri response değişkenine atadık
    dispatch(setProducts(response)); // response değişkenini global state e atadık
  };

  const deleteProductWithId = async (id) => {
    deleteProductDB(id).then((res) => {
      console.log(res);
      getProductFunction();
    });
  };
  // resim ekleme işlemleri için gerekli fonksiyonlar
  const updateProductWithId = async (id) => {
    navigate("/admin/product-update/" + id);
  };
  const setProduct = async (
    product_name,
    product_description,
    product_image,
    product_price,
    product_category
  ) => {
    console.log(isFeatured);
    const response = await addProductDB(
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
      isFeatured
    );

    getProductFunction();
    setImageAsset(null);
  };
  return (
    <div className="relative z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 h-full ">
      <div className="w-full  mt-16 flex items-center justify-center p-3">
        <p className="text-gray-800 text-3xl italic">
          {" "}
          Product Ekle / Sil / Güncelle
        </p>
      </div>
      <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
        <Formik
          initialValues={values}
          validationSchema={Yup.object({
            product_name: Yup.string().required("Ürün adı zorunludur"),
            product_price: Yup.number().required("Ürün fiyatı zorunludur"),
            product_description: Yup.string().required(
              "Ürün açıklaması zorunludur"
            ),
            product_isFeatured: Yup.boolean().required(
              "Ürünün özellikli olup olmadığı zorunludur"
            ),
            product_category: Yup.string().required(
              "Ürünün kategorisi zorunludur"
            ),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            var product = products.filter(
              (product) => product.product_name === values.product_name
            );
            if (product.length > 0 || products === null) {
              alertify.error("Ürün zaten mevcut");
            } else if (imageAsset === false || imageAsset === null) {
              alertify.error("Lütfen resim ekleyiniz");
            } else {
              // setProduct(
              //   values.product_name,
              //   values.product_description,
              //   imageAsset,
              //   values.product_price,
              //   values.product_category
              // );
              console.log(values);
              setTimeout(() => {
                resetForm();
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
                <label htmlFor="product_name">Ürün Adı</label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  placeholder="Ürün Adı"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.product_name}
                />
                {formik.touched.product_name && formik.errors.product_name ? (
                  <div className="text-red-500">
                    {formik.errors.product_name}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="product_description">Ürün açıklaması</label>
                <input
                  type="text"
                  id="product_description"
                  name="product_description"
                  placeholder="Ürün Açıklaması"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.product_description}
                />
                {formik.touched.product_description &&
                formik.errors.product_description ? (
                  <div className="text-red-500">
                    {formik.errors.product_description}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="product_price">Ürün Fiyati</label>
                <input
                  type="text"
                  id="product_price"
                  name="product_price"
                  placeholder="Ürün Fiyat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  onChange={formik.handleChange}
                  value={formik.values.product_price}
                />
                {formik.touched.product_price && formik.errors.product_price ? (
                  <div className="text-red-500">
                    {formik.errors.product_price}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="product_category">Ürün Kategorisi</label>
                <select
                  placeholder="product_category"
                  type="text"
                  id="product_category"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={formik.handleChange}
                  value={formik.values.product_category}
                >
                  <option value={""}>Kategori seçiniz</option>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <option key={category._id} value={category.category_name}>
                        {category.category_name}
                      </option>
                    ))}
                </select>
                {formik.touched.product_category &&
                formik.errors.product_category ? (
                  <div className="text-red-500">
                    {formik.errors.product_category}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label htmlFor="product_isFeatured">
                  Ürün Öne çıkarılsın mı
                </label>
                <select
                  placeholder="product_isFeatured"
                  type="text"
                  id="product_isFeatured"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  onChange={formik.handleChange}
                  value={formik.values.product_isFeatured}
                >
                  <option value="">Öne çıkarılsın mı ?</option>
                  <option value={false}>false</option>
                  <option value={true}>true</option>
                </select>
                {formik.touched.product_isFeatured &&
                formik.errors.product_isFeatured ? (
                  <div className="text-red-500">
                    {formik.errors.product_isFeatured}
                  </div>
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
                  Ürün Ekle
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div className="flex w-3/5 h-auto gap-12 p-3 flex-wrap justify-center">
        {products.length > 0 &&
          products.map((product) => (
            <motion.div
              key={product._id}
              className="relative rounded-lg  w-40 min-w-210 px-4 py-4 h-225 cursor-pointer hover:bg-card bg-gray-100 shadow-md  flex flex-col items-center "
            >
              <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={product.product_image}
                  className="w-full h-full object-cover rounded-lg"
                ></motion.img>
              </div>
              <p className="text-base text-headingColor font-semibold my-2">
                {product.product_name.length > 25
                  ? `${product.category_name.slice(0, 25)}..`
                  : product.product_name + " - " + product.product_price + "₺"}
              </p>

              <div>
                <motion.i
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteProductWithId(product._id)}
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
                  onClick={() => updateProductWithId(product._id)}
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

export default Products;

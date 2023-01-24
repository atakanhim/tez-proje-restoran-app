import * as yup from "yup";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { storage } from "../../../firebase.config";
import { Loader } from "../../CustomCarts";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { getProductsFromDB, updateProductDB } from "../../../api/api";
import { setProducts } from "../../../store/slices/restoranSlice";

//alertfy
import alertify from "alertifyjs";

// import dispaych
import { useDispatch } from "react-redux";
const ProductUpdate = () => {
  const dispatch = useDispatch();
  // param ile id alma
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_content: "",
    product_price: "",
    product_category: "",
    _id: "",
  });

  // global stateden veri çekme
  const { products, categories } = useSelector((state) => state.restoran);
  // image update states
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  const [show, setShow] = useState(false);

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
  const getProduct = async () => {
    const response = await getProductsFromDB();
    dispatch(setProducts(response));
  };
  const updateProduct = async (values) => {
    updateProductDB({
      product_name: values.product_name.trim(),
      product_description: values.product_description.trim(),
      product_price: values.product_price,
      product_category: values.product_category.trim(),
      product_content: values.product_content.trim(),
      _id: id,
      product_image: imageAsset,
    })
      .then((res) => {
        console.log(res);
        getProduct();
        alertify.success("Ürün güncelleme işlemi başarılı");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const doldurInput = () => {
    const product = products.find((item) => item._id === id);
    setProduct({
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: product.product_price,
      product_category: product.product_category,
      product_content: product.product_content,
      _id: product._id,
    });
    setImageAsset(product.product_image);
  };

  useEffect(() => {
    // get the last part of the url
    doldurInput();
    console.log("useEffect çalıştı");
    setShow(true);
  }, [products, id]);

  return (
    <>
      {show ? (
        <div className="relative z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 h-full ">
          <div className="w-full  mt-16 flex items-center justify-center p-3">
            <p className="text-gray-800 text-3xl italic"> Ürün Güncelle</p>
          </div>
          <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
            <Formik
              initialValues={product}
              validationSchema={Yup.object({
                product_name: Yup.string().required("Ürün adı zorunludur"),
                product_price: Yup.number().required("Ürün fiyatı zorunludur"),
                product_description: Yup.string().required(
                  "Ürün açıklaması zorunludur"
                ),
                product_category: Yup.string().required(
                  "Ürünün kategorisi zorunludur"
                ),
                product_content: Yup.string().required(
                  "Ürün içeriği zorunludur"
                ),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                var product1 = products.filter(
                  (product) =>
                    product.product_name.trim() ===
                      values.product_name.trim() && product._id !== id
                );
                if (product1.length > 0 || categories === null) {
                  alertify.error("Bu ürün zaten mevcut.");
                } else if (imageAsset === false || imageAsset === null) {
                  alertify.error("Lütfen resim yükleyiniz.");
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
                    {formik.touched.product_name &&
                    formik.errors.product_name ? (
                      <div className="text-red-500">
                        {formik.errors.product_name}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="product_description">Ürün Açıklaması</label>
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
                    <label htmlFor="product_content">Ürün İçindekiler</label>
                    <p className="text-xs text-gray-600">
                      Virgül ' , ' işaretini kullanarak malzemeleri
                      ayırabilirsiniz.(Örnek:Soğan,Domates,Patates)
                    </p>
                    <input
                      type="text"
                      id="product_content"
                      name="product_content"
                      placeholder="Ürün İçindekiler"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.product_content}
                    />
                    {formik.touched.product_content &&
                    formik.errors.product_content ? (
                      <div className="text-red-500">
                        {formik.errors.product_content}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="product_price">Ürün Fiyatı</label>
                    <input
                      type="text"
                      id="product_price"
                      name="product_price"
                      placeholder="Ürün Fiyatı"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.product_price}
                    />
                    {formik.touched.product_price &&
                    formik.errors.product_price ? (
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
                          <option
                            key={category._id}
                            value={category.category_name}
                          >
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
                    >
                      Ürün Güncelle
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

export default ProductUpdate;

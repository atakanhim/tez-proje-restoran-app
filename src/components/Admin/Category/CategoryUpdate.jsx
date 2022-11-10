import { yupResolver } from "@hookform/resolvers/yup";
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
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { storage } from "../../../firebase.config";
import { Loader } from "../../CustomCarts";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { updateCategoryDB, getCategoriesFromDB } from "../../../api/api";
import { setCategories } from "../../../store/slices/restoranSlice";
//alertfy
import alertify from "alertifyjs";

// import dispaych
import { useDispatch } from "react-redux";
const CategoryUpdate = () => {
  const dispatch = useDispatch();
  // param ile id alma
  const params = useParams();
  const { id } = params;
  // local states

  const [value, setValue] = useState({
    category_name: "",
    category_description: "",
  });
  const [cateName, setCateName] = useState("");
  const [cateDesc, setCateDesc] = useState("");
  // global stateden veri çekme
  const { categories } = useSelector((state) => state.restoran);
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
  const getCategory = async () => {
    const response = await getCategoriesFromDB(); // apiden veri çekme
    dispatch(setCategories(response)); // redux store a veri gönderme
  };
  const updateCategory = async (values) => {
    updateCategoryDB({
      _id: id,
      category_name: values.category_name.trim(),
      category_description: values.category_description.trim(),
      category_image: imageAsset,
    })
      .then((res) => {
        console.log(values);
        getCategory();
        alertify.success("Kategori güncelleme işlemi başarılı");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const doldurInput = () => {
    const category = categories.find((item) => item._id === id);
    setValue({
      category_name: category.category_name,
      category_description: category.category_description,
    });
    setImageAsset(category.category_image);
  };

  useEffect(() => {
    // get the last part of the url
    doldurInput();
    setShow(true);
  }, [categories]);

  return (
    <>
      {show ? (
        <div className="relative z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 h-full ">
          <div className="w-full  mt-16 flex items-center justify-center p-3">
            <p className="text-gray-800 text-3xl italic">
              {" "}
              Kategori Ekle / Sil / Güncelle
            </p>
          </div>
          <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
            <Formik
              initialValues={value}
              validationSchema={Yup.object({
                category_name: Yup.string().required("Kategori adı zorunludur"),
                category_description: Yup.string().required(
                  "Kategori açıklaması zorunludur"
                ),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                var category1 = categories.filter(
                  (category) =>
                    category.category_name.trim() ===
                      values.category_name.trim() && category._id !== id
                );
                console.log(category1.length);
                console.log(value);
                if (category1.length > 0 || categories === null) {
                  alertify.error("Bu kategori zaten mevcut.");
                } else if (imageAsset === false || imageAsset === null) {
                  alertify.error("Lütfen resim yükleyiniz.");
                } else {
                  updateCategory(values);
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
                    <label htmlFor="category_name">Kategori Adı</label>
                    <input
                      type="text"
                      id="category_name"
                      name="category_name"
                      placeholder="Kategori Adı"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.category_name}
                    />
                    {formik.touched.category_name &&
                    formik.errors.category_name ? (
                      <div className="text-red-500">
                        {formik.errors.category_name}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <label htmlFor="category_description">
                      Kategori Açıklaması
                    </label>
                    <input
                      type="text"
                      id="category_description"
                      name="category_description"
                      placeholder="Kategori Açıklaması"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      onChange={formik.handleChange}
                      value={formik.values.category_description}
                    />
                    {formik.touched.category_description &&
                    formik.errors.category_description ? (
                      <div className="text-red-500">
                        {formik.errors.category_description}
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
                      Kategori Güncelle
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

export default CategoryUpdate;

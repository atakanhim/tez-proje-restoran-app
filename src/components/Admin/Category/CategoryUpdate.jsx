import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

// import dispaych
import { useDispatch } from "react-redux";
const CategoryUpdate = () => {
  const dispatch = useDispatch();
  // param ile id alma
  const params = useParams();
  const { id } = params;
  // local states
  const [category, setCategory] = useState({
    category_name: "",
    category_image: "",
    category_id: "",
    category_description: "",
  });

  // global stateden veri çekme
  const { categories } = useSelector((state) => state.restoran);
  // image update states
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);

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
          setCategory({ ...category, category_image: downloadURL });
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
        setImageAsset(false);
        setIsLoading(false);
        console.log("File deleted successfully");
        setCategory({
          ...category,
          category_image: "",
        });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const getCategory = async () => {
    const response = await getCategoriesFromDB();
    dispatch(setCategories(response));
  };
  const updateCategory = async () => {
    updateCategoryDB(category)
      .then((res) => {
        console.log(res);
        getCategory();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (data) => {
    // filter ile aynı isimde kategori eklenmesin
    var category1 = categories.filter(
      (category) =>
        category.category_name === data.category_name && category._id !== id
    );
    console.log(data);

    if (category1.length > 0 || categories === null) {
      alert("aynı isimde kategori eklenemez");
    } else if (imageAsset === false) {
      alert("resim ekle");
    } else {
      updateCategory();
    }
  };

  // schema

  const schema = yup
    .object({
      category_name: yup.string().required("ad gereklidir"),
      category_description: yup.string().required("aciklama gereklidir"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  //

  useEffect(() => {
    // get the last part of the url
    var categori = categories.find((category) => category._id === id);
    setCategory({
      category_name: categori.category_name,
      category_image: categori.category_image,
      _id: categori._id,
      category_description: categori.category_description,
    });
    setImageAsset(categori.category_image);
  }, [categories, id]);

  return (
    <div className="absolute flex z-10 items-center justify-center bg-gray-200 text-black w-full h-auto">
      <div className="flex flex-col  items-center justify-center w-2/5 min-w-210 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg mt-20 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex flex-col gap-4"}
        >
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Kategori adı
            </label>
            <input
              type="text"
              id="category_name"
              {...register("category_name")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Category name"
              value={category.category_name}
              onChange={(e) =>
                setCategory({
                  ...category,
                  category_name: e.target.value,
                })
              }
              required=""
            />
            <p>{errors.category_name?.message}</p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Kategori açıklaması
            </label>

            <input
              placeholder="Description"
              type="description"
              id="category_description"
              {...register("category_description")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
              value={category.category_description}
              onChange={(e) =>
                setCategory({
                  ...category,
                  category_description: e.target.value,
                })
              }
            />
          </div>

          <p>{errors.category_description?.message}</p>
          <div className="flex justify-center items-center">
            <div
              className="flex justify-center items-center flex-col border-2 border-dotted
           border-gray-200 hover:border-gray-700 transition-all ease-in-out duration-200 w-2/5 md:w-4/5 h-100 md:h-225 cursor-pointer"
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
                          className="relative md:absolute top-3 right-3 p-3 rounded-full text-sm md:text-xl bg-red-400 cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out "
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

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-4  w-full md:w-auto border-none outline-none bg-emerald-400 px-12 py-2 rounded-lg text-lg text-white font-semibold focus:ring-4 focus:outline-none focus:ring-blue-300  hover:bg-emerald-800  transition-all ease-in-out duration-500"
            >
              Kategori Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryUpdate;

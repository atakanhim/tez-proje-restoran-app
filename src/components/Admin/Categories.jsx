import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setCategories } from "../../store/slices/restoranSlice";
import { useSelector } from "react-redux";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import {
  getCategories,
  deleteCategory,
  addCategory,
  deleteAllCategories,
} from "../../api/api";
import { yupResolver } from "@hookform/resolvers/yup";
// import motion
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase.config";
import { CategoryCard, Loader } from "../CustomCarts";

const Categories = () => {
  //global state
  const { categories } = useSelector((state) => state.restoran);
  // local state
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
  const getCategory = async () => {
    const response = await getCategories();
    dispatch(setCategories(response));
  };

  const deleteCategoryWithId = async (id) => {
    deleteCategory(id).then((res) => {
      getCategory();
      console.log(res);
    });
  };

  const deleteAll = async () => {
    deleteAllCategories().then((res) => {
      getCategory();
      console.log(res);
    });
  };
  const setCategory = async (
    category_name,
    category_description,
    category_image
  ) => {
    const response = await addCategory(
      category_name,
      category_description,
      category_image
    );
    getCategory();
    setImageAsset(false);
  };

  // schema for yup
  const schema = yup
    .object({
      category_name: yup.string().required("ad gereklidir"),
      category_description: yup.string().required("aciklama gereklidir"),

      // category_description: yup.number().positive().integer().required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // data gönderiliyor    //axios post
  const onSubmit = (data) => {
    // filter ile aynı isimde kategori eklenmesin
    var category = categories.filter(
      (category) => category.category_name === data.category_name
    );

    if (category.length > 0 || categories === null) {
      alert("aynı isimde kategori eklenemez");
    } else if (imageAsset === false) {
      alert("resim ekle");
    } else {
      setCategory(data.category_name, data.category_description, imageAsset);
    }

    // clear input
    document.getElementById("category_name").value = "";
    document.getElementById("category_description").value = "";
    // daha sonra bu töntem use ref ile degişecek
    //use ref ile inputları temizleme
  };

  return (
    <div className="absolute top-16 z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 ">
      <div className="w-full  mt-16 flex items-center justify-center p-3">
        <p className="text-gray-800 text-3xl italic">
          {" "}
          Kategori Ekle / Sil / Güncelle
        </p>
      </div>
      <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
        <form onSubmit={handleSubmit(onSubmit)} className="w-3/5">
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
            />
          </div>

          <p>{errors.category_description?.message}</p>
          <div className="flex justify-center items-center">
            <div
              className="flex justify-center items-center flex-col border-2 border-dotted
           border-gray-200 hover:border-gray-700 transition-all ease-in-out duration-200 w-full lg:w-4/5 xl:w-3/5 h-225 md:h-225 cursor-pointer"
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

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="mt-4  w-full md:w-auto border-none outline-none bg-emerald-400 px-12 py-2 rounded-lg text-lg text-white font-semibold focus:ring-4 focus:outline-none focus:ring-blue-300  hover:bg-emerald-800  transition-all ease-in-out duration-500"
            >
              Kategori Ekle
            </button>
          </div>
        </form>
      </div>

      <div className="flex w-3/5 h-auto gap-12 p-3 flex-wrap justify-center">
        <CategoryCard
          categories={categories}
          deleteCategory={deleteCategoryWithId}
        />
      </div>

      <div className="flex w-4/5 h-auto bg-slate-600 gap-12 p-3 flex-wrap justify-center">
        <button
          onClick={deleteAll}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Hepsini Sil
        </button>
      </div>
    </div>
  );
};

export default Categories;

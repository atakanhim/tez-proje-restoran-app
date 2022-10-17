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
import { storage } from "../../firebase.config";
import { Loader } from "../CustomCarts";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { getProductsFromDB, updateProductDB } from "../../api/api";
import { setProducts } from "../../store/slices/restoranSlice";

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
    product_price: "",
    product_category: "",
    product_isFeatured: null,
    product_image: "",
    _id: "",
  });

  // global stateden veri çekme
  const { products, categories } = useSelector((state) => state.restoran);
  // image update states
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

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
          setProduct({ ...product, product_image: downloadURL });
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
        setProduct({
          ...product,
          product_image: "",
        });
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
  const updateProduct = async () => {
    updateProductDB(product)
      .then((res) => {
        console.log(res);
        getProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = (data) => {
    // filter ile aynı isimde kategori eklenmesin
    var product1 = products.filter(
      (prdct) => prdct.product_name === product.product_name && prdct._id !== id
    );

    if (product1.length > 0 || products === null) {
      alert("aynı isimde product eklenemez");
    } else if (imageAsset === false) {
      alert("resim ekle");
    } else {
      updateProduct();
    }
  };

  const schema = yup
    .object({
      product_name: yup.string().required("ad gereklidir"),
      product_description: yup.string().required("aciklama gereklidir"),
      product_price: yup.number().required("price gereklidir"),

      product_category: yup.string().required("category gereklidir"),

      // category_description: yup.number().positive().integer().required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // get the last part of the url
    var productu = products.find((product) => product._id === id);
    try {
      setProduct({
        product_name: productu.product_name,
        product_description: productu.product_description,
        product_price: productu.product_price,
        product_category: productu.product_category,
        product_isFeatured: productu.product_isFeatured,
        product_image: productu.product_image,
        _id: productu._id,
      });
      setImageAsset(productu.product_image);
      setIsFeatured(productu.product_isFeatured);
    } catch (error) {
      console.log(error);
    }
  }, [products, id]);

  return (
    <div className="absolute flex z-10 items-center justify-center bg-gray-200 text-black w-full h-auto">
      <div className="flex flex-col  items-center justify-center w-3/5 min-w-210 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg mt-20 ">
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col g-4  justify-center overflow-hidden overflow-y-auto"
          >
            <div className="mb-6">
              <label
                htmlFor="product_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Urun adı
              </label>
              <input
                type="text"
                id="product_name"
                {...register("product_name")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="product_name"
                value={product.product_name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_name: e.target.value,
                  })
                }
                required=""
              />
              <p>{errors.product_name?.message}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="product_description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Ürün açıklaması
              </label>

              <input
                placeholder="Description"
                type="text"
                id="product_description"
                {...register("product_description")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={product.product_description}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_description: e.target.value,
                  })
                }
              />
              <p>{errors.product_description?.message}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="product_price"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Ürün fiyatı
              </label>

              <input
                placeholder="product_price"
                type="text"
                id="product_price"
                {...register("product_price")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={product.product_price}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_price: e.target.value,
                  })
                }
              />
              <p>{errors.product_price?.message}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="product_category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Ürün categoriesi
              </label>

              <select
                placeholder="product_category"
                type="text"
                id="product_category"
                {...register("product_category")}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={product.product_category}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_category: e.target.value,
                  })
                }
              >
                <option value={""}>Kategori seçiniz</option>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <option key={category._id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
              </select>
              <p>{errors.product_category?.message}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="product_isFeatured"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Öne çıkarılsın mı
              </label>

              <select
                placeholder="product_isFeatured"
                type="text"
                id="product_isFeatured"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                onChange={(e) => setIsFeatured(e.target.value)}
                value={isFeatured}
              >
                <option value={false}>false</option>
                <option value={true}>true</option>
              </select>
            </div>

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
                Urun ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;

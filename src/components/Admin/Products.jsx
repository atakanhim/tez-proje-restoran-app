import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { motion } from "framer-motion";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useDispatch } from "react-redux";
import { setProducts } from "../../store/slices/restoranSlice";
import { useSelector } from "react-redux";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import {
  getProductsFromDB,
  addProductDB,
  deleteProductDB,
  deleteAllProductsDB,
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
  const { products, categories } = useSelector((state) => state.restoran);
  // local state
  const [isLoading, setIsLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  //useRef
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
    const response = await getProductsFromDB();
    dispatch(setProducts(response));
  };

  const deleteProductWithId = async (id) => {
    deleteProductDB(id).then((res) => {
      console.log(res);
      getProductFunction();
    });
  };

  const deleteAll = async () => {
    deleteAllProductsDB().then((res) => {
      getProductFunction();
      console.log(res);
    });
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

    console.log(response);
    getProductFunction();
    setImageAsset(null);
    reset();
  };

  // schema for yup
  const schema = yup
    .object({
      product_name: yup.string().required("ad gereklidir"),
      product_description: yup.string().required("aciklama gereklidir"),
      product_price: yup.string().required("price gereklidir"),
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

  // data gönderiliyor    //axios post
  const onSubmit = (data) => {
    // filter ile aynı isimde product eklenmesin
    var product = products.filter(
      (product) => product.product_name === data.product_nameValue
    );

    if (product.length > 0 || products === null) {
      alert("aynı isimde ürün eklenemez");
    } else if (imageAsset === false) {
      alert("resim ekle");
    } else {
      setProduct(
        data.product_name,
        data.product_description,
        imageAsset,
        data.product_price,
        data.product_category
      );
    }

    // clear input
    document.getElementById("product_name").value = "";
    document.getElementById("product_description").value = "";
    document.getElementById("product_price").value = "";
    document.getElementById("product_category").value = "";

    // daha sonra bu töntem use ref ile degişecek
    //use ref ile inputları temizleme
  };

  return (
    <div className="absolute top-16 z-10 flex items-center w-full gap-7 bg-gray-200 flex-col p-5 ">
      <div className="w-full  mt-16 flex items-center justify-center p-3">
        <p className="text-gray-800 text-3xl italic">
          {" "}
          Urun Ekle / Sil / Güncelle
        </p>
      </div>
      <div className="flex flex-col  items-center justify-center w-1/2 h-auto px-4 py-10 bg-gray-300 rounded-lg shadow-lg ">
        <form onSubmit={handleSubmit(onSubmit)} className="w-3/5">
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
              placeholder="product_name "
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
                  : product.product_name}
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
            </motion.div>
          ))}
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

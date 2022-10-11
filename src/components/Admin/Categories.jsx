import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setCategories } from "../../store/slices/restoranSlice";
import { useSelector } from "react-redux";

import { yupResolver } from "@hookform/resolvers/yup";
// import motion

import Axios from "axios";
import CategoryCard from "../CustomCarts/CategoryCard";

const Categories = () => {
  const { categories } = useSelector((state) => state.restoran);

  const dispatch = useDispatch();

  // axios get req
  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const response = await Axios.get("http://localhost:5000/api/category");
    console.log(response.data);
    dispatch(setCategories(response.data));
  };

  const deleteCategory = async (id) => {
    const response = await Axios.delete(
      `http://localhost:5000/api/category/clear/${id}`
    );
    getCategory();
    console.log(response.data);
  };

  const deleteAll = async () => {
    const response = await Axios.delete(
      "http://localhost:5000/api/category/clear"
    );
    getCategory();
    console.log(response.data);
  };
  const setCategory = async (category_name, category_description) => {
    Axios.post("http://localhost:5000/api/category/add", {
      category_name,
      category_description,
    })
      .then((res) => {
        console.log(res);
        getCategory();
      })
      .catch((err) => {
        console.log(err);
      });
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
    const category_name = data.category_name;
    const category_description = data.category_description;
    // filter ile aynı isimde kategori eklenmesin

    var category = categories.filter(
      (category) => category.category_name === category_name
    );

    if (category.length > 0 || categories === null) {
      alert("aynı isimde kategori eklenemez");
    } else {
      setCategory(category_name, category_description);
    }

    // clear input
    document.getElementById("category_name").value = "";
    document.getElementById("category_description").value = "";
    // daha sonra bu töntem use ref ile degişecek
    //use ref ile inputları temizleme
  };

  return (
    <div className="flex items-center w-full h-[1200px] gap-7 bg-slate-400 flex-col">
      <div className="flex flex-col  items-center justify-center w-1/2 h-370 bg-gray-400 rounded-lg shadow-lg mt-36">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your description
            </label>
            <input
              placeholder="Description"
              type="description"
              id="category_description"
              {...register("category_description")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
            />
            <p>{errors.category_description?.message}</p>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Ekle
          </button>
        </form>
      </div>

      <div className="flex w-4/5 h-auto gap-12 p-3 flex-wrap justify-center">
        <CategoryCard categories={categories} deleteCategory={deleteCategory} />
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

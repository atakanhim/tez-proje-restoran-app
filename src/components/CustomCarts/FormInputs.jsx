import React from "react";

const FormInputs = () => {
  return (
    <div className="">
      <label
        htmlFor="text"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Kategori adı
      </label>
      <input
        type="text"
        id="category_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Category name"
        required=""
      />
    </div>
  );
};

export default FormInputs;

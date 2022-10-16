import axios from "axios";
// categories

export const getCategories = async () => {
  const response = await axios.get("http://localhost:5000/api/category");
  return response.data;
};
export const deleteCategory = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/category/${id}`
  );
  return response.data;
};
export const deleteAllCategories = async () => {
  const response = await axios.delete(`http://localhost:5000/api/category`);
  return response.data;
};
export const updateCategory = async (category) => {
  const response = await axios.put(
    `http://localhost:5000/api/category/${category._id}`,
    category
  );
  return response.data;
};
export const addCategory = async (x, y, z) => {
  console.log("add category " + x, y);

  const response = await axios
    .post("http://localhost:5000/api/category", {
      category_name: x,
      category_description: y,
      category_image: z,
    })
    .then((res) => {
      console.log(res);
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};
// products

export const getProductsFromDB = async () => {
  const response = await axios.get("http://localhost:5000/api/product");
  return response.data;
};
export const addProductDB = async (
  product_nameValue,
  product_descriptionValue,
  product_imageValue,
  product_priceValue,
  product_categoryValue
) => {
  const response = await axios
    .post("http://localhost:5000/api/product", {
      product_name: product_nameValue,
      product_image: product_imageValue,
      product_description: product_descriptionValue,
      product_category: product_categoryValue,
      product_price: product_priceValue,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};
export const deleteProductDB = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/product/${id}`
  );
  return response.data;
};
export const deleteAllProductsDB = async () => {
  const response = await axios.delete(`http://localhost:5000/api/product`);
  return response.data;
};

import axios from "axios";
// categories

export const getCategoriesFromDB = async () => {
  const response = await axios.get("http://localhost:5000/api/category");
  return response.data;
};
export const deleteCategoryDB = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/category/${id}`
  );
  return response.data;
};
export const deleteAllCategoriesDB = async () => {
  const response = await axios.delete(`http://localhost:5000/api/category`);
  return response.data;
};
export const updateCategoryDB = async (category) => {
  console.log(category);
  const response = await axios
    .put(`http://localhost:5000/api/category/${category._id}`, category)
    .catch((err) => {
      console.log(err);
    });

  return response.data;
};
export const addCategoryDB = async (x, y, z) => {
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

// menus

export const getMenusFromDB = async () => {
  const response = await axios.get("http://localhost:5000/api/menu");
  return response.data;
};
export const deleteMenuDB = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/menu/${id}`);
  return response.data;
};
export const deleteAllMenusDB = async () => {
  const response = await axios.delete(`http://localhost:5000/api/menu`);
  return response.data;
};
export const updateMenuDB = async (menu) => {
  console.log(menu);

  const response = await axios
    .put(`http://localhost:5000/api/menu/${menu._id}`, menu)
    .catch((err) => {
      console.log(err);
    });

  return response.data;
};
export const addMenuDB = async (
  menu_name,
  menu_burger_selection,
  menu_snacks_selection,
  menu_drink_selection,
  menu_cips_selection,
  menu_sauce_selection,
  menu_price,
  menu_image
) => {
  const response = await axios
    .post("http://localhost:5000/api/menu", {
      menu_name: menu_name,
      menu_burger_selection: menu_burger_selection,
      menu_snacks_selection: menu_snacks_selection,
      menu_drink_selection: menu_drink_selection,
      menu_cips_selection: menu_cips_selection,
      menu_sauce_selection: menu_sauce_selection,
      menu_price: menu_price,
      menu_image: menu_image,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};

// products
export const updateProductDB = async (product) => {
  console.log(product);

  const response = await axios
    .put(`http://localhost:5000/api/product/${product._id}`, product)
    .catch((err) => {
      console.log(err);
    });

  return response.data;
};
export const getProductsFromDB = async () => {
  const response = await axios.get("http://localhost:5000/api/product");
  return response.data;
};
export const addProductDB = async (
  product_nameValue,
  product_descriptionValue,
  product_imageValue,
  product_priceValue,
  product_categoryValue,
  product_contentValue
) => {
  const response = await axios
    .post("http://localhost:5000/api/product", {
      product_name: product_nameValue,
      product_image: product_imageValue,
      product_description: product_descriptionValue,
      product_category: product_categoryValue,
      product_price: product_priceValue,
      product_content: product_contentValue,
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

// orders
export const getOrdersFromDB = async () => {
  const response = await axios.get("http://localhost:5000/api/order");
  return response.data;
};
export const deleteOrderDB = async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/order/${id}`);
  return response.data;
};
export const deleteAllOrdersDB = async () => {
  const response = await axios.delete(`http://localhost:5000/api/order`);
  return response.data;
};
export const updateOrderDB = async (order) => {
  console.log(order);

  const response = await axios
    .put(`http://localhost:5000/api/order/${order._id}`, order)
    .catch((err) => {
      console.log(err);
    });

  return response.data;
};
export const addOrderDB = async (order) => {
  const response = await axios
    .post("http://localhost:5000/api/order", order)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};

import axios from "axios";

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

export const updateCategory = async (category) => {
  const response = await axios.put(
    `http://localhost:5000/api/category/${category._id}`,
    category
  );
  return response.data;
};

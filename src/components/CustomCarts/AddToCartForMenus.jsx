import React from "react";
import { useParams } from "react-router-dom";

const AddToCartForMenus = () => {
  const params = useParams();
  const { id } = params;
  return <div>simdi: {id}</div>;
};

export default AddToCartForMenus;

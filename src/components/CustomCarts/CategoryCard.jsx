import React from "react";
import { motion } from "framer-motion";
const CategoryCard = ({ categories }) => {
  return (
    <>
      {categories.length > 0 &&
        categories.map((category) => (
          <motion.div
            key={category._id}
            className="relative rounded-lg  w-40 min-w-210 px-4 py-4 h-225 cursor-pointer hover:bg-card bg-gray-100 shadow-md  flex flex-col items-center "
          >
            <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={category.category_image}
                className="w-full h-full object-cover rounded-lg"
              ></motion.img>
            </div>
          </motion.div>
        ))}
    </>
  );
};

export default CategoryCard;

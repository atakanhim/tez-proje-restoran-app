import React from "react";
import { motion } from "framer-motion";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
const CategoryCard = ({ categories, deleteCategory, updateCategory }) => {
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
            <p className="text-base text-headingColor font-semibold my-2">
              {category.category_name.length > 25
                ? `${category.category_name.slice(0, 25)}..`
                : category.category_name}
            </p>

            <div>
              <motion.i
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteCategory(category._id)}
                className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4"
              >
                <DeleteOutlineOutlinedIcon
                  className="text-base text-red-400 drop-shadow-md hover:text-red-600
                "
                />
              </motion.i>
            </div>
            <div>
              <motion.i
                onClick={() => updateCategory(category._id)}
                className="w-full absolute bottom-2 left-40   flex items-center justify-between px-4 hover:scale-95 transition-all duration-150 ease-in-out"
              >
                <ModeEditOutlineIcon
                  className="text-base text-red-400 drop-shadow-md hover:text-red-600
                "
                />
              </motion.i>
            </div>
          </motion.div>
        ))}
    </>
  );
};

export default CategoryCard;

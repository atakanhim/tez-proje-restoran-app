import React from "react";
// import navlink
import { NavLink } from "react-router-dom";

// create header for admin
const logout = () => {
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};

const AdminHeader = () => {
  return (
    <div>
      <div className="flex fixed w-full h-16 justify-between items-center bg-gray-800 py-4 px-6 z-40 ">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">Admin</div>
        </div>
        <div className="flex items-center  ">
          <ul className="flex gap-6 ">
            <li className="text-white font-bold text-xl italic border-b border-white hover:border-[dcfce7] hover:scale-110  hover:text-[#dcfce7] rounded-lg p-2  transition-all duration-300 ease-in-out">
              <NavLink to="/admin/categories">Kategoriler</NavLink>
            </li>
            <li className="text-white font-bold text-xl italic border-b border-white hover:border-[dcfce7] hover:scale-110   hover:text-[#dcfce7] rounded-lg p-2  transition-all duration-300 ease-in-out">
              <NavLink to="/admin/products">Ürünler</NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={logout}
          >
            Logoutt
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

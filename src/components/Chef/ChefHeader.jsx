import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setUser } from "../../store/slices/restoranSlice";

// create header for admin

const ChefHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    sessionStorage.removeItem("user");
    dispatch(setUser(null));

    navigate("/login", { replace: true });
  };
  return (
    <div>
      <div className="flex fixed w-full h-16 justify-between items-center bg-gray-800 py-4 px-6    ">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">Chef</div>
        </div>
        <div className="flex items-center  ">
          <ul className="flex gap-6 ">
            <li className="text-white font-bold text-xl italic border-b border-white hover:border-[dcfce7] hover:scale-110  hover:text-[#dcfce7] rounded-lg p-2  transition-all duration-300 ease-in-out">
              <NavLink to="/chef/orders">Siparişler</NavLink>
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

export default ChefHeader;

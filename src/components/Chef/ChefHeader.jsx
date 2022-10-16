import React from "react";

// create header for admin
const logout = () => {
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};
const ChefHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 p-4 z-40 fixed w-full">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">ChefHeader</div>
        </div>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ChefHeader;

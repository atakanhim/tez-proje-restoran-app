import React from "react";

// create header for admin
const AdminHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 p-4">
        <div className="flex items-center">
          <div className="text-white font-bold text-2xl">Admin</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

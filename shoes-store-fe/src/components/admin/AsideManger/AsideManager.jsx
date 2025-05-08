import React from "react";
import MenuItem from "./MenuItem";
import { toast } from "react-toastify";
const AsideManager = ({ isMobile, toggleSidebar }) => {
  const handleClick = () => {
    toast.info("Tính năng đang phát triển");
    return;
  };
  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`bg-white text-gray-800 h-screen transition-all duration-300 fixed sm:relative top-0 left-0 z-50 w-64 shadow-md
          ${isMobile ? "block" : "hidden"} sm:block`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-indigo-600">AT STORE</h2>
        </div>

        <div className="p-4">
          <h3 className="text-xs uppercase font-semibold text-gray-500 mb-4">
            Quản lý
          </h3>
          <nav className="space-y-1">
            <MenuItem
              onClick={handleClick}
              icon="🏠"
              text="Trang chủ"
              to="/admin"
            />
            <MenuItem icon="🛒" text="Đơn hàng" to="/admin/order" />
            <MenuItem
              onClick={handleClick}
              icon="📦"
              text="Sản phẩm"
              to="/admin/product"
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AsideManager;

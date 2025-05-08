import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderManager from "../../components/admin/Header";
import AsideManager from "../../components/admin/AsideManger/AsideManager";
import { ToastContainer } from "react-toastify";
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AsideManager isMobile={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <HeaderManager toggleSidebar={toggleSidebar} />
        <main className="flex-grow overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default AdminLayout;

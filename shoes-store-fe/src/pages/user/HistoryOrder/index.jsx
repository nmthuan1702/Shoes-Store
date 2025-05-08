import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderItem from "./OrderItem";
import Cookies from "js-cookie";
import orderApi from "../../../api/user/orderApi";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000021] bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-medium mb-4">Xác nhận hủy đơn hàng</h3>
        <p className="mb-6 text-gray-600">Bạn có chắc chắn muốn hủy đơn hàng #{orderId} không?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            Không
          </button>
          <button
            onClick={() => {
              onConfirm(orderId);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
};

// Tab Component
const OrderHistoryTab = ({ active, title, count, onClick }) => {
  return (
    <div
      className={`px-4 py-2 text-center flex-1 relative overflow-hidden group cursor-pointer ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
      onClick={onClick}
    >
      {!active && (
        <div className="absolute inset-0 bg-blue-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></div>
      )}
      <span className="relative z-10">
        {title}
        {count > 0 && <span className="ml-1">({count})</span>}
      </span>
    </div>
  );
};

const OrderHistoryPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const username = Cookies.get("username");

  const fetchOrders = async () => {
    if (!username) return;
    
    setIsLoading(true);
    try {
      let data;
      if (activeTab === "all") {
        data = await orderApi.getOrdersByUsername(username);
      } else {
        data = await orderApi.getOrdersByUsernameAndStatus(
          username,
          convertTabToStatus(activeTab)
        );
      }
      setOrders(data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, username]);

  const convertTabToStatus = (tab) => {
    switch (tab) {
      case "processing":
        return "Chờ xử lý";
      case "confirmed":
        return "Hoàn thành";
      case "shipping":
        return "Đang chuyển hàng";
      case "delivering":
        return "Đang giao hàng";
      case "cancelled":
        return "Đã hủy";
      case "purchased":
        return "Hoàn thành";
      default:
        return "";
    }
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const confirmCancelOrder = async (orderId) => {
    try {
      await orderApi.updateOrder(orderId);
      toast.success("Đơn hàng đã được hủy thành công!");
      fetchOrders();
    } catch (error) {
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const tabItems = [
    { label: "Tất cả", key: "all" },
    { label: "Chờ xử lý", key: "processing" },
    { label: "Đã xác nhận", key: "confirmed" },
    { label: "Đang chuyển hàng", key: "shipping" },
    { label: "Đang giao hàng", key: "delivering" },
    { label: "Đã hủy", key: "cancelled" },
    { label: "Thành công", key: "purchased" },
  ];

  return (
    <div className="flex mt-2">
      <div className="flex-1 p-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <h2 className="p-4 border-b border-gray-200 font-medium text-lg">
            Đơn hàng đã mua
          </h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabItems.map((tab) => (
              <OrderHistoryTab
                key={tab.key}
                title={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onOrderUpdated={fetchOrders}
                  onCancelOrder={handleCancelOrder}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Không có đơn hàng nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancelOrder}
        orderId={selectedOrderId}
      />
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OrderHistoryPage;
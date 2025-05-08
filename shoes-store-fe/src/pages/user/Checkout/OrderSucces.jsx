import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const handleContinueShopping = () => {
    navigate("/"); // Điều hướng về trang chủ
  };
  const handleViewOrderHistory = () => {
    navigate("/order");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-30 bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Chúng tôi sẽ liên hệ
          với bạn sớm nhất để xác nhận đơn hàng.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={handleViewOrderHistory}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Xem lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

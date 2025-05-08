import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const navigate = useNavigate();
  const orderNumber = "833883794";

  const handleContinueShopping = () => {
    navigate("/");
  };

  const viewOrderDetails = () => {
    navigate("/order-history");
  };

  return (
    <div className="flex items-center justify-center mt-30 bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Thanh toán thành công
        </h2>

        {/* Order Details */}
        <div className="text-center text-gray-600 mb-6">
          <p className="mb-2">
            Mã số đơn hàng của bạn là{" "}
            <span className="font-semibold text-green-600">{orderNumber}</span>
          </p>
          <p className="mb-2">
            Bạn có thể xem chi tiết trong{" "}
            <button
              className="text-blue-500 font-medium hover:underline"
              onClick={viewOrderDetails}
            >
              đơn hàng của tôi
            </button>
            .
          </p>
          <p>Thời gian dự kiến giao hàng là...</p>
        </div>
        <button
          onClick={handleContinueShopping}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 text-center cursor-pointer"
        >
          TIẾP TỤC MUA HÀNG
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;

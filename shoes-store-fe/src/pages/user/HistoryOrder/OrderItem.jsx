import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import orderApi from "../../../api/user/orderApi";

const OrderItem = ({ order, onOrderUpdated, onCancelOrder }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(
    order.status === "Hoàn thành"
  );
  const showCancelButton =
    order.status !== "Đã giao" &&
    order.status !== "Đã hủy" &&
    order.status !== "Hoàn thành" &&
    order.status !== "Đã xác nhận";

  const showReceivedButton = order.status === "Đã xác nhận" && !orderCompleted;

  const handleConfirmReceived = async () => {
    try {
      setIsConfirming(true);
      const response = await orderApi.updateOrderStatus(order.id, "Hoàn thành");

      if (response.error) {
        toast.error(response.error || "Không thể cập nhật trạng thái đơn hàng");
      } else {
        toast.success("Xác nhận đã nhận hàng thành công!");
        console.log(response);

        setOrderCompleted(true);
        if (onOrderUpdated) onOrderUpdated();
      }
    } catch (error) {
      toast.error(
        "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau."
      );
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      <div className="flex justify-between items-center mb-2 pb-3 border-b border-gray-100">
        <span className="text-base text-gray-700 font-medium">
          Đơn hàng: <span className="text-blue-600">DH{order.id}</span>
          <span className="text-gray-500 text-sm ml-3">
            Thời gian đặt hàng: {order.createdAt}
          </span>
        </span>
        <span
          className={`text-xs rounded-full px-3 py-1 font-medium ${
            order.status === "Hoàn thành" || order.status === "Đã giao"
              ? "bg-green-100 text-green-800"
              : order.status === "Đang xử lý" || order.status === "Chờ xử lý"
              ? "bg-blue-100 text-blue-800"
              : order.status === "Đang giao hàng" ||
                order.status === "Đang chuyển hàng"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "Đã hủy"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-4">
        {order.orderDetails?.map((detail, index) => {
          const product = detail.productDetail;

          return (
            <div
              key={index}
              className={`flex py-4 ${
                index !== order.orderDetails.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="w-20 h-20 mr-4 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow pr-4">
                <p className="text-base font-medium text-gray-800 mb-1">
                  {product.name}
                </p>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Kích thước:</span>{" "}
                    {product.size}
                  </p>
                  <p>
                    <span className="font-medium">Màu sắc:</span>{" "}
                    {product.color}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-base font-medium text-red-600 mb-1">
                  {detail.formatPrice}
                </p>
                <p className="text-sm text-gray-600">SL: {detail.quantity}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex flex-col items-end mb-2">
          <div className="space-y-1 text-right mb-1">
            <p className="text-sm text-gray-600">
              Thành tiền:{" "}
              <span className="font-medium">{order.formattedTotalPrice}</span>
            </p>
            <p className="text-sm text-gray-600">
              Phí vận chuyển:{" "}
              <span className="font-medium">{order.formatShippingFee}</span>
            </p>
            <p className="text-lg font-medium text-red-600">
              Tổng tiền: {order.totalAmount}
            </p>
          </div>

          <div className="flex space-x-3">
            <Link to={`/order/${order.id}`}>
              <button className="cursor-pointer text-blue-600 text-sm py-2 px-4 border border-blue-600 rounded-md font-medium hover:bg-blue-600 hover:text-white transition duration-200 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Xem chi tiết
              </button>
            </Link>

            {showReceivedButton && (
              <button
                onClick={handleConfirmReceived}
                disabled={isConfirming}
                className="cursor-pointer text-green-600 text-sm py-2 px-4 border
                border-green-600 rounded-md font-medium hover:bg-green-600
                hover:text-white transition duration-200 flex items-center"
              >
                {isConfirming ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Đã nhận hàng
                  </>
                )}
              </button>
            )}

            {showCancelButton && (
              <button
                onClick={() => onCancelOrder(order.id)}
                className="cursor-pointer text-red-600 text-sm py-2 px-4 border
                border-red-600 rounded-md font-medium hover:bg-red-600
                hover:text-white transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;

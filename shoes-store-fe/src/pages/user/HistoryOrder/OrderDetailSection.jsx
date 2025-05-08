import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../../api/user/orderApi";
import { useNavigate } from "react-router-dom";
export default function OrderDetailSection() {
  const params = useParams();
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const handleBackToOrderList = () => {
    navigate("/order");
  };
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderData = await orderApi.getByOrderId(orderId);
        setOrder(orderData);
        setOrderDetails(orderData.orderDetails || []);
      } catch (error) {
    
      }
    };
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  return (
    <div className="bg-white p-4">
      <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-sm p-4">
        {order && (
          <>
            {" "}
            <div className="flex items-center justify-between bg-gray-50 p-3 mb-4 rounded">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium mr-1">
                  Anh Thuận
                </span>
              </div>
              <div className="flex items-center text-base">
                <span className="mr-1 text-gray-700">
                  Chi tiết đơn hàng #DH{order.id} -
                </span>

                <span className="text-green-500 font-medium">
                  {order.status}
                </span>
                <span className="ml-2 text-gray-600 text-sm">
                  Đặt lúc: {order.createdAt}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-white p-4 rounded shadow md:w-1/2">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      <h3 className="font-medium text-base">
                        THÔNG TIN NHẬN HÀNG
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-base">
                      <div className="text-gray-600">Người nhận:</div>
                      <div className="col-span-2">
                        {order.shippingAddress.recipientName} -{" "}
                        {order.shippingAddress.phone}
                      </div>

                      <div className="text-gray-600">Nhận tại:</div>
                      <div className="col-span-2">
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.country} -{" "}
                        {order.shippingAddress.province} -{" "}
                        {order.shippingAddress.city} -{" "}
                      </div>

                      <div className="text-gray-600">Dự kiến nhận hàng:</div>
                      <div className="col-span-2">{order.shippingTime}</div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white p-4 rounded shadow md:w-1/2">
                    <div className="flex items-center mb-3">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                      <h3 className="font-medium text-base">
                        HÌNH THỨC THANH TOÁN
                      </h3>
                    </div>
                    <p className="text-base">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-white p-4 rounded shadow my-4">
                  <div className="flex items-center mb-4">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      ></path>
                    </svg>
                    <h3 className="font-medium text-base">
                      THÔNG TIN SẢN PHẨM
                    </h3>
                  </div>

                  {orderDetails.map((detail) => (
                    <div key={detail.id} className="flex border-b pb-4 mb-4">
                      <div className="w-20">
                        <img
                          src={detail.productDetail.imageUrl}
                          alt={detail.productDetail.name}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1 ml-4 text-base">
                        <h4 className="font-medium">
                          {detail.productDetail.name}
                        </h4>
                        Màu: {detail.productDetail.color} / Size:{" "}
                        {detail.productDetail.size}
                        <p className="text-xs mt-1">
                          Số lượng: {detail.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">
                          {detail.formatShippingFee}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end">
                    <div className="w-1/2">
                      <div className="flex justify-between mb-2 text-base">
                        <span>Tạm tính:</span>
                        <span className="font-medium">
                          {order.formattedTotalPrice}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2 text-base">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">
                          {order.formatShippingFee}
                        </span>
                      </div>
                      <div className="flex justify-between text-red-600 text-base">
                        <span>Tổng tiền:</span>
                        <span className="font-medium">{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleBackToOrderList}
                    className="bg-blue-100 text-blue-500 px-4 py-2 rounded font-medium text-base cursor-pointer hover:bg-blue-200 transition duration-200"
                  >
                    VỀ TRANG DANH SÁCH ĐƠN HÀNG
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

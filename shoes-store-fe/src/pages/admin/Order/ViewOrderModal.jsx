import React, { useEffect, useState } from "react";
import adminOrderApi from "../../../api/admin/adminOrderApi";
import { toast } from "react-toastify";
function ViewOrderModal({ isOpen, onClose, selectedOrder, onStatusUpdate }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [allowedStatuses, setAllowedStatuses] = useState([]);

  useEffect(() => {
    if (selectedOrder && isOpen) {
      getOrderById(selectedOrder.id);
      setNewStatus(selectedOrder.status || "");
      const currentStatus = selectedOrder.status || "";
      if (currentStatus === "Chờ xử lý") {
        setAllowedStatuses(["Chờ xử lý", "Đã xác nhận", "Đã hủy"]);
      } else if (currentStatus === "Đã xác nhận") {
        setAllowedStatuses(["Đã xác nhận", "Hoàn thành", "Đã hủy"]);
      } else if (currentStatus === "Hoàn thành") {
        // Thêm điều kiện này
        setAllowedStatuses(["Hoàn thành"]);
      } else if (currentStatus === "Đã hủy") {
        setAllowedStatuses(["Đã hủy"]);
      } else {
        setAllowedStatuses([
          "Chờ xử lý",
          "Đã xác nhận",
          "Hoàn thành",
          "Đã hủy",
        ]);
      }
    }
  }, [selectedOrder, isOpen]);

  if (!isOpen || !selectedOrder) return null;

  const getOrderById = async (orderId) => {
    try {
      setLoading(true);
      const response = await adminOrderApi.getOrderById(orderId);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    try {
      setUpdatingStatus(true);
      await adminOrderApi.updateOrderStatus(selectedOrder.id, newStatus);

      if (orderDetails) {
        setOrderDetails({
          ...orderDetails,
          status: newStatus,
        });
      }
      if (onStatusUpdate) {
        onStatusUpdate(selectedOrder.id, newStatus);
      }
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000021] bg-opacity-40 z-50 flex items-center justify-center overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
            Chi tiết đơn hàng #DH{selectedOrder.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer rounded-full p-1 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Order Status Update Section */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Cập nhật trạng thái đơn hàng
              </h4>
              <div className="flex items-center flex-wrap md:flex-nowrap gap-4">
                <div className="w-full md:w-2/3">
                  <label
                    htmlFor="orderStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Trạng thái
                  </label>
                  <select
                    id="orderStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    disabled={allowedStatuses.length <= 1}
                  >
                    {allowedStatuses.includes("Chờ xử lý") && (
                      <option value="Chờ xử lý">Chờ xử lý</option>
                    )}
                    {allowedStatuses.includes("Đã xác nhận") && (
                      <option value="Đã xác nhận">Đã xác nhận</option>
                    )}
                    {allowedStatuses.includes("Hoàn thành") && ( // Thêm dòng này
                      <option value="Hoàn thành">Hoàn thành</option>
                    )}
                    {allowedStatuses.includes("Đã hủy") && (
                      <option value="Đã hủy">Đã hủy</option>
                    )}
                  </select>
                  {(selectedOrder.status === "Đã xác nhận" ||
                    selectedOrder.status === "Đã hủy") && (
                    <p className="mt-2 text-sm text-red-600">
                      {selectedOrder.status === "Đã xác nhận"
                        ? "Đơn hàng đã được xác nhận, không thể chuyển về trạng thái chờ xử lý"
                        : "Đơn hàng đã bị hủy, không thể thay đổi trạng thái"}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/3 self-end">
                  <button
                    onClick={updateOrderStatus}
                    disabled={
                      updatingStatus ||
                      newStatus === selectedOrder.status ||
                      allowedStatuses.length <= 1
                    }
                    className={`cursor-pointer w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      newStatus === "Đã hủy"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 mb-7 "
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 mb-7 "
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      updatingStatus ||
                      newStatus === selectedOrder.status ||
                      allowedStatuses.length <= 1
                        ? "opacity-50 cursor-not-allowed mb-7 "
                        : ""
                    }`}
                  >
                    {updatingStatus ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Đang cập nhật...
                      </span>
                    ) : newStatus === "Đã hủy" ? (
                      "Hủy đơn hàng"
                    ) : (
                      "Cập nhật trạng thái"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                <div className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Thông tin đơn hàng
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-semibold">
                        #DH{selectedOrder.id}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span>{selectedOrder.createdAt}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-semibold text-blue-600">
                        {selectedOrder.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">
                        Phương thức thanh toán:
                      </span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">
                        Trạng thái đơn hàng:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          orderDetails?.status || selectedOrder.status
                        )}`}
                      >
                        {orderDetails?.status || selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Trạng thái thanh toán:
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedOrder.paymentStatus === "Đã thanh toán"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <div className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-blue-600">
                        {selectedOrder.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Tên khách hàng:</span>
                      <span className="font-medium">
                        {selectedOrder.shippingAddress.recipientName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span>{selectedOrder.shippingAddress.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Sản phẩm ({selectedOrder.orderDetails?.length || 0})
              </h4>
              {selectedOrder.orderDetails &&
              selectedOrder.orderDetails.length > 0 ? (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.orderDetails.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12 mr-4">
                                <img
                                  className="h-12 w-12 rounded-md object-cover border border-gray-200"
                                  src={item.productDetail.imageUrl}
                                  alt={item.productDetail.name}
                                />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {item.productDetail.name || "Sản phẩm"}
                                </div>
                                <div className="text-gray-500 text-sm">
                                  Mã: {item.productDetail.sku || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-right">
                            {item.formatPrice}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium text-right">
                            {item.formattedSubtotal ||
                              (
                                parseFloat(
                                  item.formatPrice.replace(/[^0-9]/g, "")
                                ) * item.quantity
                              ).toLocaleString("vi-VN") + "đ"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                        >
                          Tạm tính:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {selectedOrder.formattedSubtotal ||
                            selectedOrder.totalAmount}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-right text-sm font-medium text-gray-500"
                        >
                          Phí vận chuyển:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {selectedOrder.formatShippingFee || "0đ"}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-200">
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-right font-semibold text-gray-800"
                        >
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-lg text-blue-600">
                          {selectedOrder.totalAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-gray-50 text-gray-500">
                  Không có thông tin sản phẩm
                </div>
              )}
            </div>

            {/* Shipping address */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Địa chỉ giao hàng
              </h4>
              <div className="p-5 border rounded-lg bg-white shadow-sm">
                {selectedOrder.shippingAddress ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-gray-400 mt-1"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span className="font-medium text-base">
                        {selectedOrder.shippingAddress.recipientName ||
                          selectedOrder.user?.name ||
                          "Người nhận"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-gray-400 mt-1"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>
                        {selectedOrder.shippingAddress.phone ||
                          selectedOrder.user?.phone ||
                          "Không có thông tin"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-gray-400 mt-1"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <div>
                        <div>
                          {selectedOrder.shippingAddress.address ||
                            "Không có thông tin"}
                        </div>
                        <div>
                          {[
                            selectedOrder.shippingAddress.country,
                            selectedOrder.shippingAddress.province,
                            selectedOrder.shippingAddress.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start pt-2 border-t border-gray-100 mt-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-gray-400 mt-1"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div>
                        Thời gian giao hàng dự kiến:{" "}
                        <span className="text-red-500 font-medium">
                          {selectedOrder.shippingTime || "Không có thông tin"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có thông tin địa chỉ giao hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewOrderModal;

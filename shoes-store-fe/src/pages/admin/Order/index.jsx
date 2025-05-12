import React, { useState, useEffect } from "react";
import ViewOrderModal from "./ViewOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";
import { toast } from "react-toastify";
const SearchIcon = () => (
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
    className="text-gray-400"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronLeft = () => (
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
    className="text-gray-500"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
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
    className="text-gray-500"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const PrintIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-500"
  >
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const CloseIcon = () => (
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
);

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    paymentStatus: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState({
    show: false,
    message: "",
  });

  const [lastOrderCount, setLastOrderCount] = useState(0);
  const checkForNewOrders = async () => {
    try {
      const response = await adminOrderApi.getNewOrderCount();
      const newOrderCount = response.data;
      if (newOrderCount > lastOrderCount && lastOrderCount !== 0) {
        const newOrders = newOrderCount - lastOrderCount;
        toast.info(`Bạn có ${newOrders} đơn hàng mới!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (statusFilter === "processing" || statusFilter === "all") {
          fetchOrders(pagination.currentPage, statusFilter);
        }
      }
      setLastOrderCount(newOrderCount);
    } catch (error) {
      console.error("Error checking for new orders:", error);
    }
  };
  useEffect(() => {
    checkForNewOrders();
    const intervalId = setInterval(checkForNewOrders, 10000);
    return () => clearInterval(intervalId);
  }, [lastOrderCount]);
  const fetchOrders = async (pageNumber = 0, status = statusFilter) => {
    setIsLoading(true);
    try {
      let result;
      if (status === "all") {
        result = await adminOrderApi.getAllOrder(phone, pageNumber);
      } else {
        let backendStatus;
        switch (status) {
          case "completed":
            backendStatus = "Đã xác nhận";
            break;
          case "processing":
            backendStatus = "Chờ xử lý";
            break;
          case "canceled":
            backendStatus = "Đã hủy";
            break;
          default:
            backendStatus = status;
        }
        result = await adminOrderApi.getAllOrderByStatus(
          backendStatus,
          phone,
          pageNumber
        );
      }
      if (!result.error) {
        setOrders(result.data?.orders || []);
        setPagination({
          totalItems: result.data?.totalItems || 0,
          totalPages: result.data?.totalPages || 1,
          currentPage: result.data?.currentPage || 0,
        });
      } else {
        setOrders([]);
      }
    } catch (err) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(0, statusFilter);
  }, [phone, statusFilter]);

  const handlePageChange = (pageNumber) => {
    fetchOrders(pageNumber, statusFilter);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    setIsLoading(true);
    try {
      // Assuming updateOrder endpoint exists
      const result = await adminOrderApi.updateOrder(
        selectedOrder.id,
        updateData
      );
      if (!result.error) {
        setActionSuccess({
          show: true,
          message: "Cập nhật đơn hàng thành công!",
        });
        setIsUpdateModalOpen(false);

        // Update the order in the list
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  status: updateData.status,
                  paymentStatus: updateData.paymentStatus,
                }
              : order
          )
        );

        setTimeout(() => {
          setActionSuccess({ show: false, message: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setIsLoading(true);
    try {
      // Assuming cancelOrder endpoint exists
      const result = await adminOrderApi.cancelOrder(selectedOrder.id);
      if (!result.error) {
        setActionSuccess({
          show: true,
          message: "Hủy đơn hàng thành công!",
        });
        setIsDeleteModalOpen(false);

        // Update the order in the list
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, status: "Đã hủy", paymentStatus: "Đã hủy" }
              : order
          )
        );

        setTimeout(() => {
          setActionSuccess({ show: false, message: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Error canceling order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportOrder = async (e, orderId) => {
    e.preventDefault;
    toast.info("Tính năng đang phát triển");

    // try {

    //   const result = await adminOrderApi.exportOrder(orderId);
    //   if (!result.error) {
    //     const url = window.URL.createObjectURL(new Blob([result.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", `don-hang-${orderId}.pdf`);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //   }
    // } catch (err) {
    //   console.error("Error exporting order:", err);
    // }
  };
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    fetchOrders(pagination.currentPage, statusFilter);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-green-100 text-green-800";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800";
      case "Đã hủy":
        return "bg-gray-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800";
      case "Đang xử lý":
        return "bg-orange-100 text-orange-800";
      case "Chưa xử lý":
        return "bg-gray-100 text-gray-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getShippingMethodClass = (method) => {
    switch (method) {
      case "VNPay":
        return "bg-blue-100 text-blue-800";
      case "Thanh toán khi nhận hàng":
        return "bg-green-100 text-green-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;
    const startPage = Math.max(
      0,
      Math.min(
        pagination.currentPage - Math.floor(maxButtonsToShow / 2),
        pagination.totalPages - maxButtonsToShow
      )
    );
    const endPage = Math.min(
      startPage + maxButtonsToShow - 1,
      pagination.totalPages - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 rounded-md border border-gray-300 ${
            pagination.currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } flex items-center justify-center transition-colors`}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="w-full">
      {/* Success Notification */}
      {actionSuccess.show && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 flex justify-between items-center">
          <div>{actionSuccess.message}</div>
          <button
            onClick={() => setActionSuccess({ show: false, message: "" })}
            className="text-green-700 hover:text-green-900"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleExportOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
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
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm đơn hàng
          </button>
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tìm kiếm theo số điện thoại"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <button
            className={`cursor-pointer px-3 py-1 ${
              statusFilter === "all"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-100"
            } rounded-full transition-colors`}
            onClick={() => handleStatusFilterChange("all")}
          >
            Tất cả đơn hàng ({pagination.totalItems})
          </button>
          <button
            className={`cursor-pointer px-3 py-1 ${
              statusFilter === "completed"
                ? "bg-green-100 text-green-800"
                : "text-gray-600 hover:bg-gray-100"
            } rounded-full transition-colors`}
            onClick={() => handleStatusFilterChange("completed")}
          >
            Đã xác nhận
          </button>
          <button
            className={`cursor-pointer px-3 py-1 ${
              statusFilter === "processing"
                ? "bg-orange-100 text-orange-800"
                : "text-gray-600 hover:bg-gray-100"
            } rounded-full transition-colors`}
            onClick={() => handleStatusFilterChange("processing")}
          >
            Chờ xử lý
          </button>

          <button
            className={`cursor-pointer px-3 py-1 ${
              statusFilter === "canceled"
                ? "bg-red-100 text-red-800"
                : "text-gray-600 hover:bg-gray-100"
            } rounded-full transition-colors`}
            onClick={() => handleStatusFilterChange("canceled")}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">STT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SDT nhận hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức thanh toán
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center">
                    <div className="flex justify-center">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-500"
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
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {pagination.currentPage * 10 + index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          openViewModal(item);
                        }}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        #{item.id}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                      {item.createdAt}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {item.user?.email}
                        </a>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-gray-700 text-center">
                      {item.shippingAddress?.phone}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex text-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShippingMethodClass(
                          item.paymentMethod
                        )}`}
                      >
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-900 font-medium text-center">
                      {item.totalAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
                          onClick={() => openViewModal(item)}
                          title="Xem chi tiết"
                        >
                          <ViewIcon />
                        </button>

                        <button
                          className="hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
                          onClick={() => handleExportOrder(item.id)}
                          title="Xuất đơn hàng"
                        >
                          <PrintIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-700"></div>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                pagination.currentPage > 0 &&
                handlePageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage <= 0}
              className={`p-1 rounded-md border border-gray-300 ${
                pagination.currentPage <= 0
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } transition-colors`}
            >
              <ChevronLeft />
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() =>
                pagination.currentPage < pagination.totalPages - 1 &&
                handlePageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className={`p-1 rounded-md border border-gray-300 ${
                pagination.currentPage >= pagination.totalPages - 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } transition-colors`}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Order Modal */}
      {isDeleteModalOpen && (
        <DeleteOrderModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          selectedOrder={selectedOrder}
          handleCancelOrder={handleCancelOrder}
          isLoading={isLoading}
        />
      )}

      {/* View Order Modal */}
      {isViewModalOpen && (
        <ViewOrderModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          selectedOrder={selectedOrder}
          onStatusUpdate={handleOrderStatusUpdate}
        />
      )}
    </div>
  );
}

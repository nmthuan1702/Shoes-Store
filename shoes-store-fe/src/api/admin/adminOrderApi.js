import axiosClient from "../axiosClient";

const adminOrderApi = {
  getAllOrder: async (phone = "", page = 0, size = 10) => {
    const response = await axiosClient.get(
      `/admin/order/all?phone=${phone}&page=${page}&size=${size}`
    );
    return response.data;
  },

  getAllOrderByStatus: async (status, phone = "", page = 0, size = 10) => {
    const response = await axiosClient.get(
      `/admin/order/status?status=${status}&phone=${phone}&page=${page}&size=${size}`
    );
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await axiosClient.get(
      `/admin/order/detail?orderId=${orderId}`
    );
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await axiosClient.put(
      `/admin/order?orderId=${orderId}&status=${status}`
    );
    return response.data;
  },
  getNewOrderCount: async () => {
    const response = await axiosClient.get("/admin/order/new-count");
    return response.data;
  },
};

export default adminOrderApi;

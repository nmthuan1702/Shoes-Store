import axiosClient from "../axiosClient";

const adminOrderApi = {
  getAllOrder: async (phone = "", page = 0, size = 10) => {
    try {
      const response = await axiosClient.get(
        `/admin/order/all?phone=${phone}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return { error: error.response?.data?.message || "An error occurred" };
    }
  },

  getAllOrderByStatus: async (status, phone = "", page = 0, size = 10) => {
    try {
      const response = await axiosClient.get(
        `/admin/order/status?status=${status}&phone=${phone}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      return { error: error.response?.data?.message || "An error occurred" };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await axiosClient.get(
        `/admin/order/detail?orderId=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { error: error.response.message || "An error occurred" };
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axiosClient.put(
        `/admin/order?orderId=${orderId}&status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { error: error.response.data.message || "An error occurred" };
    }
  },
  getNewOrderCount: async () => {
    try {
      const response = await axiosClient.get("/admin/order/new-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching new order count:", error);
      return { error: error.response.data.message || "An error occurred" };
    }
  },
};

export default adminOrderApi;

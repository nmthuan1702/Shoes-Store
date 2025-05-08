import axiosClient from "../axiosClient";

const orderApi = {
  getByOrderId: async (orderId) => {
    try {
      const response = await axiosClient.get(`/user/order?orderId=${orderId}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  createOrder: async (orderData) => {
    try {
      const response = await axiosClient.post("/user/order", orderData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  updateOrder: async (orderId) => {
    try {
      const response = await axiosClient.put(
        `/user/history/cancel?orderId=${orderId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  getOrdersByUsername: async (username) => {
    try {
      const response = await axiosClient.get(
        `/user/history/u?username=${username}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  getOrdersByUsernameAndStatus: async (username, status) => {
    try {
      const response = await axiosClient.get(
        `/user/history/s?username=${username}&status=${status}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  getOrdersByUsernameAndPaymentStatus: async (username, paymentStatus) => {
    try {
      const response = await axiosClient.get(
        `/user/history/p?username=${username}&paymentStatus=${paymentStatus}`
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axiosClient.put(
        `/user/order?orderId=${orderId}&status=${status}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      }
      throw error;
    }
  },
};
export default orderApi;

import axiosClient from "../axiosClient";

const orderApi = {
  getByOrderId: async (orderId) => {
   
      const response = await axiosClient.get(`/user/order?orderId=${orderId}`);
      return response.data.data;
  
  },
  createOrder: async (orderData) => {
   
      const response = await axiosClient.post("/user/order", orderData);
      return response.data;
    
  },
  updateOrder: async (orderId) => {
   
      const response = await axiosClient.put(
        `/user/history/cancel?orderId=${orderId}`
      );
      return response.data;
   
  },
  getOrdersByUsername: async (username) => {
    
      const response = await axiosClient.get(
        `/user/history/u?username=${username}`
      );

      return response.data.data;
  
  },
  getOrdersByUsernameAndStatus: async (username, status) => {
  
      const response = await axiosClient.get(
        `/user/history/s?username=${username}&status=${status}`
      );

      return response.data.data;
   
  },
  getOrdersByUsernameAndPaymentStatus: async (username, paymentStatus) => {
   
      const response = await axiosClient.get(
        `/user/history/p?username=${username}&paymentStatus=${paymentStatus}`
      );

      return response.data.data;
   
  },
  updateOrderStatus: async (orderId, status) => {
   
      const response = await axiosClient.put(
        `/user/order?orderId=${orderId}&status=${status}`
      );
      return response.data;
  
  },
};
export default orderApi;

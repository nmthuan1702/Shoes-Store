import axiosClient from "../axiosClient";

const cartApi = {
  getByUsername: async (username) => {
    try {
      const response = await axiosClient.get(
        `/user/shopping-cart?username=${username}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  

  addToCart: async (cartData) => {
    try {
      const response = await axiosClient.post("/user/shopping-cart", cartData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  updateQuantity: async (cartDetailId, quantity) => {
    try {
      const response = await axiosClient.put(`/user/shopping-cart`, {
        cartDetailId,
        quantity,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },

  removeFromCart: async (cartDetailId) => {
    try {
      const response = await axiosClient.delete(
        `/user/shopping-cart/cart-detail?cartId=${cartDetailId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  clearCart: async (username) => {
    try {
      const response = await axiosClient.delete(
        `/user/shopping-cart/${username}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
};

export default cartApi;

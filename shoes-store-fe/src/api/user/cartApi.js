import axiosClient from "../axiosClient";

const cartApi = {
  getByUsername: async (username) => {
    const response = await axiosClient.get(
      `/user/shopping-cart?username=${username}`
    );
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await axiosClient.post("/user/shopping-cart", cartData);
    return response.data;
  },
  updateQuantity: async (cartDetailId, quantity) => {
    const response = await axiosClient.put(`/user/shopping-cart`, {
      cartDetailId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (cartDetailId) => {
    const response = await axiosClient.delete(
      `/user/shopping-cart/cart-detail?cartId=${cartDetailId}`
    );
    return response.data;
  },
  clearCart: async (username) => {
    const response = await axiosClient.delete(
      `/user/shopping-cart/${username}`
    );
    return response.data;
  },
};

export default cartApi;

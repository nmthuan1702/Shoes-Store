
import axiosClient from "../axiosClient";

const addressApi = {
  getAddressByUsername: async (username) => {
    try {
      const response = await axiosClient.get(
        `/user/address?username=${username}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  addAddressByUsername: async (addressData) => {
    try {
      const response = await axiosClient.post(`/user/address`, addressData);

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },
  updateAddressById: async (shippingAddressId, addressData) => {
    try {
      const response = await axiosClient.put(
        `/user/address?shippingAddressId=${shippingAddressId}`,
        addressData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: "Connection error!" };
    }
  },

  removeAddressById: async (shippingAddressId) => {
    try {
      const response = await axiosClient.put(
        `/user/address/deactivate?shippingAddressId=${shippingAddressId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.message };
      } else return { error: error.response.message };
    }
  },
};
export default addressApi;

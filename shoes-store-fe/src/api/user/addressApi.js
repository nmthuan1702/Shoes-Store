import axiosClient from "../axiosClient";

const addressApi = {
  getAddressByUsername: async (username) => {
    const response = await axiosClient.get(
      `/user/address?username=${username}`
    );
    return response.data.data;
  },
  addAddressByUsername: async (addressData) => {
    const response = await axiosClient.post(`/user/address`, addressData);
    return response.data;
  },

  updateAddressById: async (shippingAddressId, addressData) => {
    const response = await axiosClient.put(
      `/user/address?shippingAddressId=${shippingAddressId}`,
      addressData
    );
    return response.data;
  },

  removeAddressById: async (shippingAddressId) => {
    const response = await axiosClient.put(
      `/user/address/deactivate?shippingAddressId=${shippingAddressId}`
    );
    return response.data;
  },
};
export default addressApi;

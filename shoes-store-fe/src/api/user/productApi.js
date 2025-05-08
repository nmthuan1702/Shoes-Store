import axiosClient from "../axiosClient";
const productApi = {
  getByCategory: async (
    categoryId,
    page = 0,
    size = 10,
    sortBy = "id",
    direction = "asc"
  ) => {
    const response = await axiosClient.get(
      `/user/product/category/${categoryId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data;
  },

  getAll: async (page = 0, size = 10, sortBy = "id", direction = "asc") => {
    const response = await axiosClient.get(
      `/user/product?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data;
  },

  getById: async (productId) => {
    const response = await axiosClient.get(`/user/product/${productId}`);
    return response.data;
  },
};

export default productApi;

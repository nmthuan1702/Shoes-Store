import axiosClient from "../axiosClient";
const productApi = {
  getByCategory: async (
    categoryId,
    page = 0,
    size = 10,
    sortBy = "id",
    direction = "asc"
  ) => {
    try {
      const response = await axiosClient.get(
        `/user/product/category/${categoryId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.data.message || "An error occurred!" };
      } else {
        return { error: "Connection error!" };
      }
    }
  },

  getAll: async (page = 0, size = 10, sortBy = "id", direction = "asc") => {
    try {
      const response = await axiosClient.get(
        `/user/product?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.data.message || "An error occurred!" };
      } else {
        return { error: "Connection error!" };
      }
    }
  },

  getById: async (productId) => {
    try {
      const response = await axiosClient.get(`/user/product/${productId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.data.message || "An error occurred!" };
      } else {
        return { error: "Connection error!" };
      }
    }
  },
};

export default productApi;

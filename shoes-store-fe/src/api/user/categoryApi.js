import axiosClient from "../axiosClient";

const categoryApi = {
  getAll: async () => {
    const response = await axiosClient.get("/user/category");
    return response.data;
  },
  getById: async (categoryId) => {
    const response = await axiosClient.get(`/user/category/${categoryId}`);
    return response.data;
  },
};

export default categoryApi;

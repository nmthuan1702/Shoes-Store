import Cookies from "js-cookie";
import axiosClient from "../axiosClient";
import { toast } from "react-toastify";

export const loginAPI = async (username, password) => {
  try {
    const { data } = await axiosClient.post("/auth/login", {
      username,
      password,
    });
    const { token, expiresAt, role } = data;
    Cookies.set("token", data.data.token, {
      expires: new Date(expiresAt),
      path: "/",
    });
    Cookies.set("role", data.data.role, {
      expires: new Date(expiresAt),
      path: "/",
    });
    Cookies.set("username", username, {
      expires: new Date(expiresAt),
      path: "/",
    });
    toast.success("Đăng nhập thành công!");
    return data.data.role;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    throw error;
  }
};

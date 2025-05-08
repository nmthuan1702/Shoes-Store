import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Lấy token từ cookie
const getToken = () => Cookies.get("token");

// Tạo instance của axios
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
// // Xử lý response và lỗi toàn cục
// axiosClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response) {
//       const { status, data } = error.response;

//       if (status === 401) {
//         toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
//         Cookies.remove("token");
//         window.location.href = "/login";
//       } else if (status === 403) {
//         toast.error("Bạn không có quyền truy cập chức năng này.");
//       } else if (status >= 500) {
//         toast.error("Lỗi từ phía máy chủ. Vui lòng thử lại sau.");
//       } else {
//         toast.error(data?.message || "Có lỗi xảy ra.");
//       }

//       return Promise.reject(data?.message || "Có lỗi xảy ra.");
//     }

//     // Lỗi không có response (lỗi mạng, CORS, ...)
//     toast.error("Không thể kết nối đến máy chủ.");
//     return Promise.reject(error.message || "Có lỗi xảy ra.");
//   }
// );

export default axiosClient;

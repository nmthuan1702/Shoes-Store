import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ProtectedRoute = ({ allowedRoles }) => {
  const role = Cookies.get("role");

  if (!role) {
    toast.error("Vui lòng đăng nhập!");
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    toast.error("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;

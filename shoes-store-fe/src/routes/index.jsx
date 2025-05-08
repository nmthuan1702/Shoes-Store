import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/admin";
import Product from "../pages/admin/Product";
import Dashboard from "../pages/admin/Dashboard";
import Order from "../pages/admin/Order";
import HomePage from "../pages/user/HomePage";
import UserLayout from "../layouts/user";
import ProductDetail from "../pages/user/ProductDetail";
import CheckoutForm from "../pages/user/Checkout/index";
import ProductGrid from "../pages/user/Product/index";
import OrderHistoryPage from "../pages/user/HistoryOrder";
import OrderDetailSection from "../pages/user/HistoryOrder/OrderDetailSection";
import ShoppingCart from "../pages/user/Cart/index";
import OrderSuccess from "../pages/user/Checkout/OrderSucces";
import PaymentResult from "../pages/user/Checkout/PaymentResult";
import Register from "../pages/Accounts/Register";
import Login from "../pages/Accounts/login";
import CafeBill from "../pages/admin/Order/Bill";
import ProtectedRoute from "./ProtectedRoute"; // Đảm bảo đường dẫn đúng

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes - không cần role */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="index" element={<HomePage />} />
          <Route path="product" element={<ProductGrid />} />
          <Route
            path="product/category/:categoryId"
            element={<ProductGrid />}
          />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>

        {/* USER protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route path="/" element={<UserLayout />}>
            <Route path="shopping-cart" element={<ShoppingCart />} />
            <Route path="checkout" element={<CheckoutForm />} />
            <Route path="success" element={<OrderSuccess />} />
            <Route path="payment/return" element={<PaymentResult />} />
            <Route path="order" element={<OrderHistoryPage />} />
            <Route path="profile" element={<OrderHistoryPage />} />
            <Route path="order/:orderId" element={<OrderDetailSection />} />
          </Route>
        </Route>

        {/* ADMIN protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            {/* <Route path="order/bill" element={<CafeBill />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

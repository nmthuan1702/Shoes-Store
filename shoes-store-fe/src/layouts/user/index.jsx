import { Outlet } from "react-router-dom";
import Header from "../../components/user/Header";
import Navbar from "../../components/user/NavBar";
import Footer from "../../components/user/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "../../context/CartContext";
const UserLayout = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <ToastContainer autoClose={1000} />
        <div className="w-full fixed top-0 left-0 z-50 bg-white shadow-md ">
          <Header />
          <Navbar />
        </div>
        <div className="flex-grow mt-32">
          <Outlet />
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default UserLayout;

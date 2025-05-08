import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import Cookies from "js-cookie";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const {
    cartItems,
    totalAmount,
    isLoading,
    totalItems,
    clearCart,
    removeFromCart,
    formatTotalAmount,
  } = useCart();

  const userCookie = Cookies.get("username");
  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("token");
    Cookies.remove("role");
    setIsAccountDropdownOpen(false);
    navigate("/login");
  };
  const handleRemoveItem = async (cartDetailId) => {
    await removeFromCart(cartDetailId);
  };
  const navigate = useNavigate();

  const handleGoToProduct = () => {
    setIsCartOpen(false);
    navigate("/product");
  };
  const handleGoToCart = () => {
    setIsAccountDropdownOpen(false);
    navigate("/shopping-cart");
  };
  const handleGoToCheckOut = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };
  const handleGoOrder = () => {
    setIsAccountDropdownOpen(false);
    navigate("/order");
  };

  const handleClearCart = async () => {
    await clearCart();
  };
  return (
    <header className="w-full relative">
      {/* Header chính */}
      <div className="flex items-center justify-between px-10 py-4">
        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-2 text-gray-600 relative">
          <input
            type="text"
            placeholder="Bạn đang tìm kiếm gì?"
            className="outline-none border border-gray-300 placeholder-gray-500 pr-10 pl-2 py-2 rounded-lg w-64"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="text-xl font-bold text-center">AT Store</div>

        {/* Ngôn ngữ & tài khoản */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <span
              className="text-lg cursor-pointer"
              onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
            >
              👤
            </span>

            {isAccountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={() => handleGoToCart()}
                  className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Giỏ hàng của bạn
                </button>
                <button
                  onClick={() => handleGoOrder()}
                  className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Đơn hàng của bạn
                </button>
                {userCookie ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                  >
                    Đăng nhập
                  </a>
                )}
              </div>
            )}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => setIsCartOpen(true)}
          >
            <span className="text-lg">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Giỏ Hàng */}
      <div
        className={`z-50 fixed top-0 right-0 w-96 h-200 bg-white shadow-lg transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">🛍️ GIỎ HÀNG</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-2xl cursor-pointer"
          >
            ✖
          </button>
        </div>

        {/* Nội dung giỏ hàng */}
        <div className="p-6 flex flex-col h-180">
          {isLoading ? (
            <Loading />
          ) : cartItems.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{cartItems.length} sản phẩm</span>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-base cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-96">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-3 relative cursor-pointer"
                    onClick={() =>
                      handleGoProductDetail(item.productDetail?.id)
                    }
                  >
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-14 right-0 text-gray-500 hover:text-red-500 cursor-pointer"
                      title="Xóa sản phẩm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 px-3">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-base text-gray-600">
                        {item.formattedPrice}
                      </p>
                      <div className="flex text-xs text-gray-500 mt-1">
                        <span className="mr-2">Size: {item.size}</span>
                        <span>Màu: {item.color}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-800 mb-1">
                        x{item.quantity}
                      </span>
                      <span className="font-medium">{item.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t">
                <div className="flex justify-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatTotalAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Tổng:</span>
                  <span>{formatTotalAmount}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full border border-black text-black px-6 py-2 rounded hover:bg-gray-100 transition cursor-pointer"
                  >
                    TIẾP TỤC MUA SẮM
                  </button>
                  <button
                    className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition cursor-pointer"
                    onClick={handleGoToCheckOut}
                  >
                    THANH TOÁN
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={handleGoToProduct}
                className="cursor-pointer bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                BẮT ĐẦU MUA SẮM
              </button>
            </div>
          )}
        </div>
      </div>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}
    </header>
  );
}

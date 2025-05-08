import { useMemo } from "react";
import { useCart } from "../../../context/CartContext";
import Cookies from "js-cookie";
import Loading from "../../../components/Loading";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function ShoppingCart() {
  const username = Cookies.get("username");

  const navigator = useNavigate();
  if (!username) {
    toast.error("Vui lòng đăng nhập để tiếp tục!");
    return <Navigate to="/login" replace />;
  }
  const {
    cartItems,
    isLoading,
    formatTotalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);
  const formattedCartItems = useMemo(() => {
    return cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.formattedPrice,
      totalPrice: item.totalPrice,
      quantity: item.quantity,
      image: item.image,
      size: item.size,
      color: item.color,
      formattedPrice: item.formattedPrice,
    }));
  }, [cartItems]);

  const handleUpdateQuantity = async (cartDetailId, quantity) => {
    if (quantity < 1) return;
    await updateQuantity(cartDetailId, quantity);
  };

  const handleDeleteItem = async (cartDetailId) => {
    await removeFromCart(cartDetailId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };
  const handleCheckout = async () => {
    if (formattedCartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể thanh toán!");
      return;
    }
    navigator("/checkout");
  };
  return (
    <div className="max-w-6xl mx-auto p-4 font-sans mt-6">
      <h1 className="text-center font-bold text-2xl mb-6">Giỏ hàng của bạn</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <div className="border-b border-gray-200">
              <div className="grid grid-cols-12 py-3 text-gray-600 text-base font-medium">
                <div className="col-span-6">SẢN PHẨM</div>
                <div className="col-span-3 text-center">SỐ LƯỢNG</div>
                <div className="col-span-2 text-center">TỔNG CỘNG</div>
              </div>
            </div>

            {formattedCartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Giỏ hàng trống
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-1 mt-2">
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 text-base cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                </div>
                {formattedCartItems.map((item, index) => (
                  <div key={item.id} className="py-1 border-b border-gray-200">
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-6 flex gap-4">
                        <div className="w-24 h-28 bg-gray-100 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-2">
                          <div>
                            <div className="font-medium text-base">
                              {item.name}
                            </div>
                            <div className="text-gray-500 text-base mt-1">
                              Size: {item.size}
                            </div>
                            <div className="text-gray-500 text-base">
                              Màu: {item.color}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-base mt-2">
                              {item.formattedPrice}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex justify-center items-center">
                          <div className="flex border border-gray-300 rounded">
                            <button
                              className="px-3 py-1 text-lg cursor-pointer"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <input
                              type="text"
                              className="w-12 text-center border-l border-r border-gray-300"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="px-3 py-1 text-lg cursor-pointer"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-medium">
                        {item.totalPrice}
                      </div>
                      <div className="col-span-1 text-center font-medium">
                        <button
                          className="text-red-500 hover:text-red-700 text-base mt-2 cursor-pointer"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right side - Order summary */}
          <div className="md:w-72">
            <div className="bg-gray-50 p-6 rounded">
              <h2 className="text-lg font-medium mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{formatTotalAmount}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>Tính khi thanh toán</span>
                </div>
              </div>

              <div className="flex justify-between py-3 font-medium">
                <span>TỔNG CỘNG</span>
                <span>{formatTotalAmount}</span>
              </div>

              <button
                onClick={() => handleCheckout()}
                className="w-full bg-black text-white py-3 mt-6 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                THANH TOÁN
              </button>

              <div className="text-base text-gray-600 mt-4 text-center">
                Phí vận chuyển sẽ được tính khi thanh toán.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

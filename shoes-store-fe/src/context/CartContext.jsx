import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import cartApi from "../api/user/cartApi";
import Cookies from "js-cookie";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const username = Cookies.get("username");
  const [formatTotalAmount, setFormatTotalAmount] = useState(0);
  const fetchCartData = useCallback(async () => {
    if (!username) return;
    setIsLoading(true);
    try {
      const response = await cartApi.getByUsername(username);

      if (response && response.data) {
        const transformedItems = response.data.cartdetails.map((item) => ({
          id: item.id,
          name: item.productName,
          formattedPrice: item.formattedPrice,
          totalPrice: item.totalPrice,
          quantity: item.quantity,
          image: item.productDetail.imageUrl,
          size: item.productDetail.size,
          color: item.productDetail.color,
          formatTotalAmount: item.totalAmount,
        }));
     
        setCartItems(transformedItems);
        setFormatTotalAmount(response.data.formatTotalAmount);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const addToCart = async (cartData) => {
    setIsLoading(true);
    try {
      const response = await cartApi.addToCart(cartData);
      if (response && response.status === 200) {
        setLastUpdate(Date.now());
        await fetchCartData();
        return { success: true, message: "Đã thêm sản phẩm vào giỏ hàng" };
      } else {
        return {
          success: false,
          message: response.message,
        };
      }
    } catch (error) {
      return null;
    }
  };

  const removeFromCart = async (cartDetailId) => {
    try {
      const response = await cartApi.removeFromCart(cartDetailId);
      if (response && response.status === 200) {
        setLastUpdate(Date.now());
        await fetchCartData();
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.data.message);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartApi.clearCart(username);
      if (response && response.status === 200) {
        setLastUpdate(Date.now()); // Cập nhật thời gian
        setCartItems([]);
        setTotalAmount(0);
        return true;
      }
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  // Thêm phương thức updateQuantity vào context
  const updateQuantity = async (cartDetailId, newQuantity) => {
    if (newQuantity < 1) return { success: false };

    try {
      const response = await cartApi.updateQuantity(cartDetailId, newQuantity);
      if (response && response.status === 200) {
        setLastUpdate(Date.now());
        await fetchCartData();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error(error.data.message);
      return null;
    }
  };

  useEffect(() => {
    if (username) {
      fetchCartData();
    }
  }, [username, fetchCartData]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (username && Date.now() - lastUpdate > 30000) {
        fetchCartData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [username, fetchCartData, lastUpdate]);

  const value = {
    cartItems,
    formatTotalAmount,
    isLoading,
    totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    removeFromCart,
    clearCart,
    fetchCartData,
    updateQuantity,
    lastUpdate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

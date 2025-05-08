import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productApi from "../../../api/user/productApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const username = Cookies.get("username");
  const navigate = useNavigate();
  // Sử dụng context
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const response = await productApi.getById(productId);
      if (response && response.data) {
        const productData = response.data;
        setProduct(productData);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const availableColors = product?.productDetails
    ? [...new Set(product.productDetails.map((d) => d.color))]
    : [];

  const availableSizes = product?.productDetails
    ? [...new Set(product.productDetails.map((d) => d.size))].sort(
        (a, b) => Number(a) - Number(b)
      )
    : [];

  const hasColorOptions = availableColors.length > 0;
  const hasSizeOptions = availableSizes.length > 0;

  const selectedProductDetail =
    product?.productDetails?.find(
      (detail) =>
        (!hasColorOptions || detail.color === selectedColor) &&
        (!hasSizeOptions || detail.size === selectedSize)
    ) || {};
  useEffect(() => {
    const checkQuantityInCart = async () => {
      if (!username || !selectedProductDetail.id) return;

      try {
        const cartItem = cartItems.find(
          (item) =>
            item.size === selectedProductDetail.size &&
            item.color === selectedProductDetail.color &&
            item.image === selectedProductDetail.imageUrl
        );
        setQuantityInCart(cartItem ? cartItem.quantity : 0);
      } catch (error) {}
    };

    checkQuantityInCart();
  }, [username, selectedProductDetail, cartItems]);

  const increaseQuantity = () => {
    if (
      selectedProductDetail &&
      selectedProductDetail.id &&
      quantity + quantityInCart >= selectedProductDetail.stock
    ) {
      toast.warning("Số lượng vượt quá hàng tồn kho!");
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!username) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    const hasColors = availableColors.length > 0;
    const hasSizes = availableSizes.length > 0;

    if ((hasColors && !selectedColor) || (hasSizes && !selectedSize)) {
      toast.error("Vui lòng chọn kích cỡ và màu sắc có sẵn");
      return;
    }

    if (!selectedProductDetail || !selectedProductDetail.id) {
      toast.error("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    if (quantityInCart + quantity > selectedProductDetail.stock) {
      toast.warning("Số lượng sản phẩm này trong giỏ hàng đã đạt giới hạn!");
      return;
    }

    if (selectedProductDetail.stock < quantity) {
      toast.error(`Sản phẩm hiện đã hết hàng!`);
      return;
    }

    const cartData = {
      username: username,
      productDetailId: selectedProductDetail.id,
      quantity: quantity,
    };

    try {
      setLoading(true);
      const result = await addToCart(cartData);
      if (result.success) {
        toast.success(result.message);
        setQuantityInCart((prevQuantity) => prevQuantity + quantity);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm vào giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-5 text-center">Đang tải...</div>;

  const { name, description, fomatPrice, category } = product || {};

  // Get default image for product display
  const defaultImage = product?.productDetails?.[0]?.imageUrl || "";

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-base text-gray-500 mb-2">
        <span>
          Trang Chủ / {category?.name || "Danh mục"} / {name || "Sản phẩm"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="aspect-square bg-gray-100 mb-2 flex items-center justify-center overflow-hidden">
            {selectedProductDetail?.imageUrl || defaultImage ? (
              <img
                src={selectedProductDetail?.imageUrl || defaultImage}
                alt={name || "Product Image"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400">Không có ảnh</div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold mb-2">
            {name || "Sản phẩm không có tên"}
          </h1>
          <div className="text-2xl font-bold mb-6">
            {fomatPrice ? `${fomatPrice}` : "Liên hệ để biết giá"}
          </div>

          <div className="text-gray-600 mb-2">
            {description || "Không có mô tả"}
          </div>

          {hasColorOptions && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span>Màu:</span>
                  <span className="font-medium">
                    {selectedColor || "Vui lòng chọn màu"}
                  </span>
                </div>
                <span className="text-base text-gray-500">Hàng có sẵn</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`py-2 border ${
                      selectedColor === color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size - only show if sizes are available */}
          {hasSizeOptions && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span className="font-medium">
                    {selectedSize || "Vui lòng chọn size"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`py-2 border ${
                      selectedSize === size ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Số lượng */}
          <div className="mb-2">
            <p className="mb-2">Số lượng:</p>
            <div className="flex">
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={decreaseQuantity}
              >
                −
              </button>
              <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </div>
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={increaseQuantity}
                disabled={
                  selectedProductDetail.id &&
                  quantity + quantityInCart >= selectedProductDetail.stock
                }
              >
                +
              </button>
            </div>
          </div>
          <div className="text-red-500">
            {(selectedColor || !hasColorOptions) &&
            (selectedSize || !hasSizeOptions)
              ? `Còn ${selectedProductDetail?.stock || 0} sản phẩm`
              : "Còn 0 sản phẩm"}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              className={`w-full py-3 border font-medium text-center ${
                loading ||
                !selectedProductDetail.id ||
                selectedProductDetail.stock <= 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer border-black"
              }`}
              onClick={handleAddToCart}
              disabled={
                loading ||
                !selectedProductDetail.id ||
                selectedProductDetail.stock <= 0
              }
            >
              {loading ? "ĐANG XỬ LÝ..." : "THÊM VÀO GIỎ HÀNG"}
            </button>

            <button
              onClick={() => navigate("/shopping-cart")}
              className="w-full py-3 text-white font-medium text-center bg-black cursor-pointer    "
            >
              Giỏ hàng của bạn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const firstProductDetail =
    product.productDetails && product.productDetails.length > 0
      ? product.productDetails[0]
      : null;

  const imageUrl = firstProductDetail?.imageUrl;
  const price = product.price || "Liên hệ";

  return (
    <div className="border border-gray-200 rounded p-2 flex flex-col">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 h-10 overflow-hidden">
        {product.name}
      </div>
      <div className="mt-1 flex items-center">
        <span className="text-gray-800 font-bold text-base">
          {price === "Liên hệ" ? price : `${price.toLocaleString("vi-VN")} VNĐ`}
        </span>
      </div>
      <Link to={`/product/${product.id}`} className="block">
        <button className="mt-2 cursor-pointer bg-amber-400 text-white text-xs py-1 px-2 w-full rounded">
          XEM CHI TIẾT
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
